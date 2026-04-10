import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import StudentAuth from '../models/StudentAuth.js';
import StudentProfile from '../models/StudentProfile.js';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config(); // keeping this and dotenv import in depsite claude's suggestions because the cloudinary config relies on these env vars.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

const uploadToCloudinary = (buffer, mimeType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'mingle-app', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};
// ─── HELPER: Format profile for response ────────────────────────────────────
// Converts the binary image to a base64 data URL the frontend can use directly
// e.g. <img src={profile.profileImage} />
// Falls back to null if no image — frontend should show a default avatar
const formatProfile = (profile) => {
  const obj = profile.toObject();
  obj.questions = obj.questions ? obj.questions.split('||') : [];

  // profileImage is now just a URL string from Cloudinary
  obj.profileImage = obj.profileImage || null;

  return obj;
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/students/register
router.post('/register', async (req, res) => {
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
      portfolio: portfolio || null,
    });
    await studentProfile.save({ session });

    await session.commitTransaction();
    
    // Sign JWT — expires in 1 day
    const token = jwt.sign(
      { id: studentAuth._id, type: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, message: 'Student registered successfully' });

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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if student exists — explicitly select password since it has select: false
    const student = await StudentAuth.findOne({ email: normalizedEmail }).select('+password');
    if (!student) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Sign JWT — expires in 1 day
    const token = jwt.sign(
      { id: student._id, type: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ token, message: 'Login successful' });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
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
router.put('/profile', authMiddleware, async (req, res) => {
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
    if (portfolio !== undefined) updateData.portfolio = portfolio;

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { studentId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
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
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
        return res.status(400).json({ 
          message: 'Invalid image file. Only JPEG, PNG, and WebP are allowed.' 
        });
      }

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer, detectedType.mime);

      const updatedProfile = await StudentProfile.findOneAndUpdate(
        { studentId: req.user.id },
        { $set: { profileImage: cloudinaryResult.secure_url } },
        { new: true }
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

export default router;