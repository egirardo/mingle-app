import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import rateLimit from 'express-rate-limit';
import StudentAuth from '../models/StudentAuth.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateBody, rules, VALID_PROGRAMS, VALID_SKILLS } from '../middleware/validate.js';

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registration attempts. Please try again in an hour.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

// ─── VALIDATION SCHEMAS ───────────────────────────────────────────────────────

const registerSchema = {
  firstName: { required: true, label: 'First name', rules: [rules.isString('First name'), rules.nonEmpty('First name'), rules.maxLen('First name', 100)] },
  lastName:  { required: true, label: 'Last name',  rules: [rules.isString('Last name'),  rules.nonEmpty('Last name'),  rules.maxLen('Last name', 100)] },
  email:     { required: true, label: 'Email',      rules: [rules.isString('Email'),      rules.nonEmpty('Email'),      rules.email('Email')] },
  password:  { required: true, label: 'Password',   rules: [rules.isString('Password'),   rules.minLen('Password', 4)] },
  program:   { required: true, label: 'Program',    rules: [rules.oneOf('Program', VALID_PROGRAMS)] },
  skills:    { required: true, label: 'Skills',     rules: [rules.isArray('Skills'), rules.arrayOfStrings('Skills'), rules.arrayAllowed('Skills', VALID_SKILLS)] },
  about:     {                 label: 'About',       rules: [rules.isString('About'),      rules.maxLen('About', 300)] },
  questions: {                 label: 'Questions',   rules: [rules.isArray('Questions'), rules.arrayOfStrings('Questions'), rules.maxArrayLen('Questions', 3), rules.arrayItemMaxLen('Questions', 300), rules.noDelimiter('Questions', '||')] },
  portfolio: {                 label: 'Portfolio',   rules: [rules.isString('Portfolio'),  rules.maxLen('Portfolio', 500), rules.safeUrl('Portfolio')] },
};

const loginSchema = {
  email:    { required: true, label: 'Email',    rules: [rules.isString('Email'),    rules.nonEmpty('Email')] },
  password: { required: true, label: 'Password', rules: [rules.isString('Password'), rules.nonEmpty('Password')] },
};

const updateProfileSchema = {
  firstName: { label: 'First name', rules: [rules.isString('First name'), rules.nonEmpty('First name'), rules.maxLen('First name', 100)] },
  lastName:  { label: 'Last name',  rules: [rules.isString('Last name'),  rules.nonEmpty('Last name'),  rules.maxLen('Last name', 100)] },
  program:   { label: 'Program',    rules: [rules.oneOf('Program', VALID_PROGRAMS)] },
  skills:    { label: 'Skills',     rules: [rules.isArray('Skills'), rules.arrayOfStrings('Skills'), rules.arrayAllowed('Skills', VALID_SKILLS)] },
  about:     { label: 'About',      rules: [rules.isString('About'),      rules.maxLen('About', 300)] },
  questions: { label: 'Questions',  rules: [rules.isArray('Questions'), rules.arrayOfStrings('Questions'), rules.maxArrayLen('Questions', 3), rules.arrayItemMaxLen('Questions', 300), rules.noDelimiter('Questions', '||')] },
  portfolio: { label: 'Portfolio',  rules: [rules.isString('Portfolio'),  rules.maxLen('Portfolio', 500), rules.safeUrl('Portfolio')] },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Prepends https:// if no scheme is present, returns null for empty/missing input.
function normalizePortfolio(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();
  return /^[a-z][a-z\d+\-.]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

dotenv.config(); // keeping this and dotenv import in depsite claude's suggestions because the cloudinary config relies on these env vars.
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary environment variables. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});


const router = express.Router();

// ─── MULTER CONFIG ───────────────────────────────────────────────────────────
// memoryStorage keeps the file in memory as a Buffer — never written to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  // Basic MIME type check — real validation (magic bytes) happens in the handler
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File must be an image'));
    }
  },
});

const uploadToCloudinary = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mingle-app',
        resource_type: 'image',
        public_id: `profile-${userId}`, // deterministic — overwrites the same asset on every update
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};
// ─── HELPER: Format profile for response ────────────────────────────────────
// Returns cloudinary URL for profileImage and splits questions string into array
const formatProfile = (profile) => {
  const obj = profile.toObject();
  obj.questions = obj.questions ? obj.questions.split('||') : [];

  // profileImage is now just a URL string from Cloudinary
  obj.profileImage = obj.profileImage || null;

  return obj;
};

// ─── GET ALL STUDENTS ─────────────────────────────────────────────────────────
// GET /api/students
router.get('/', async (req, res) => {
  try {
    const students = await StudentProfile.find({}, { studentId: 1, firstName: 1, lastName: 1, program: 1, skills: 1, questions: 1, profileImage: 1 });
    res.status(200).json(students.map(formatProfile));
  } catch (err) {
    console.error('Get all students error:', err);
    res.status(500).json({ message: 'Server error retrieving students' });
  }
});

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/students/register
router.post('/register', registerLimiter, validateBody(registerSchema), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, firstName, lastName, program, skills, about, questions, portfolio } = req.body;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if student already exists
    const existingUser = await StudentAuth.findOne({ email: normalizedEmail }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create auth record
    const studentAuth = new StudentAuth({ email: normalizedEmail, password: hashedPassword });
    await studentAuth.save({ session });

    const implodedQuestions = questions ? questions.filter(Boolean).join('||') : null;

    // No image on register — profileImage defaults to null
    // Student can upload one after via PUT /api/students/profile/image
    const studentProfile = new StudentProfile({
      studentId: studentAuth._id,
      firstName,
      lastName,
      program,
      skills: skills || [],
      about: about || null,
      questions: implodedQuestions,
      portfolio: normalizePortfolio(portfolio),
    });
    await studentProfile.save({ session });

    await session.commitTransaction();

    // Sign JWT — expires in 1 day
    const token = jwt.sign(
      { id: studentAuth._id, type: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ id: studentAuth._id, type: 'student', message: 'Student registered successfully' });

  } catch (err) {
    await session.abortTransaction();
    console.error('Register error:', err);
    
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Return generic error to client
    res.status(500).json({ message: 'Server error during registration' });
  } finally {
    session.endSession();
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/students/login
router.post('/login', loginLimiter, validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if student exists — explicitly select password since it has select: false
    const student = await StudentAuth.findOne({ email: normalizedEmail }).select('+password');
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Sign JWT — expires in 1 day
    const token = jwt.sign(
      { id: student._id, type: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ id: student._id, type: 'student', message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// POST /api/students/logout — clears the auth cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// ─── GET PUBLIC PROFILE ───────────────────────────────────────────────────────
// GET /api/students/profile/:id  — no auth required
router.get('/profile/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid student ID' });
  }

  try {
    const profile = await StudentProfile.findOne({ studentId: req.params.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(formatProfile(profile));
  } catch (err) {
    console.error('Get public profile error:', err);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});
// ─── GET PRIVATE PROFILE ──────────────────────────────────────────────────────────────
// GET /api/students/profile
// Protected — requires token
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(formatProfile(profile));

  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// ─── UPDATE PRIVATE PROFILE ───────────────────────────────────────────────────────────
// PUT /api/students/profile
// Protected — requires token
router.put('/profile', authMiddleware, validateBody(updateProfileSchema, { partial: true }), async (req, res) => {
  try {
    const { firstName, lastName, program, skills, about, questions, portfolio } = req.body;

    const implodedQuestions = questions ? questions.filter(Boolean).join('||') : null;

    // Build update payload only with provided fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (program !== undefined) updateData.program = program;
    if (skills !== undefined) updateData.skills = skills;
    if (about !== undefined) updateData.about = about;
    if (questions !== undefined) updateData.questions = implodedQuestions;
    if (portfolio !== undefined) updateData.portfolio = normalizePortfolio(portfolio);

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { studentId: req.user.id },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(formatProfile(updatedProfile));

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// ─── UPLOAD PROFILE IMAGE ─────────────────────────────────────────────────────
// PUT /api/students/profile/image
// Protected — requires token
router.put(
  '/profile/image',
  authMiddleware,
  upload.single('profileImage'),
  // Error-handling middleware to catch multer errors (fileFilter, LIMIT_FILE_SIZE, etc.)
  // Must have signature (err, req, res, next) to be treated as error handler
  (err, req, res, next) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Multer's own errors (e.g., LIMIT_FILE_SIZE)
        return res.status(400).json({ message: err.message });
      }
      // Custom fileFilter errors (e.g., "File must be an image")
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  // Main handler
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Validate actual file type by inspecting magic bytes (not client-supplied mimetype)
      const detectedType = await fileTypeFromBuffer(req.file.buffer);
      
      // Allowed MIME types by their actual signatures
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
      
      if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
        return res.status(400).json({ 
          message: 'Invalid image file. Only JPEG, PNG, WebP, and HEIC are allowed.' 
        });
      }

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.user.id);

      const updatedProfile = await StudentProfile.findOneAndUpdate(
        { studentId: req.user.id },
        { $set: { profileImage: cloudinaryResult.secure_url } },
        { returnDocument: 'after' }
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.status(200).json(formatProfile(updatedProfile));

    } catch (err) {
      console.error('Image upload error:', err);
      res.status(500).json({ message: 'Server error uploading image' });
    }
  }
);

// ─── LIKES ───────────────────────────────────────────────────────────────────
// Logged-in students save company profiles to their account.
// GET /api/students/likes — returns saved profile entries for the logged-in student
router.get('/likes', authMiddleware, async (req, res) => {
  try {
    const auth = await StudentAuth.findById(req.user.id).select('likes');
    if (!auth) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(auth.likes ?? []);
  } catch (err) {
    console.error('Get likes error:', err);
    res.status(500).json({ message: 'Server error retrieving likes' });
  }
});

// POST /api/students/likes — save a profile (students save companies)
router.post('/likes', authMiddleware, async (req, res) => {
  const { profileId, type } = req.body;
  if (!profileId || !type) {
    return res.status(400).json({ message: 'profileId and type are required' });
  }
  if (type !== 'company') {
    return res.status(400).json({ message: 'students can only save company profiles' });
  }
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return res.status(400).json({ message: 'Invalid company ID' });
  }
  try {
    const company = await Company.findById(profileId).select('_id');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const auth = await StudentAuth.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { likes: { profileId, type } } },
      { returnDocument: 'after' }
    ).select('likes');
    if (!auth) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(auth.likes ?? []);
  } catch (err) {
    console.error('Add like error:', err);
    res.status(500).json({ message: 'Server error saving like' });
  }
});

// DELETE /api/students/likes/:profileId — remove a saved profile
router.delete('/likes/:profileId', authMiddleware, async (req, res) => {
  const { profileId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return res.status(400).json({ message: 'Invalid company ID' });
  }
  const profileObjectId = new mongoose.Types.ObjectId(profileId);
  try {
    const auth = await StudentAuth.findByIdAndUpdate(
      req.user.id,
      { $pull: { likes: { profileId: profileObjectId, type: 'company' } } },
      { returnDocument: 'after' }
    ).select('likes');
    if (!auth) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(auth.likes ?? []);
  } catch (err) {
    console.error('Remove like error:', err);
    res.status(500).json({ message: 'Server error removing like' });
  }
});

// ─── COUNT ────────────────────────────────────────────────────────────────────
// GET /api/students/count
router.get('/count', async (req, res) => {
  try {
    const count = await StudentAuth.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error('Count error:', err);
    res.status(500).json({ message: 'Server error getting count' });
  }
});

export default router;