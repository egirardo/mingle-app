import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import StudentAuth from '../models/StudentAuth.js';
import StudentProfile from '../models/StudentProfile.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── MULTER CONFIG ───────────────────────────────────────────────────────────
// memoryStorage keeps the file in memory as a Buffer — never written to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed'));
    }
  },
});

// ─── HELPER: Format profile for response ────────────────────────────────────
// Converts the binary image to a base64 data URL the frontend can use directly
// e.g. <img src={profile.profileImage} />
// Falls back to null if no image — frontend should show a default avatar
const formatProfile = (profile) => {
  const obj = profile.toObject();

  // Explode questions string back into an array
  obj.questions = obj.questions ? obj.questions.split('||') : [];

  // Convert binary buffer to base64 data URL
  if (obj.profileImage?.data) {
    obj.profileImage = `data:${obj.profileImage.contentType};base64,${obj.profileImage.data.toString('base64')}`;
  } else {
    obj.profileImage = null; // Frontend handles showing default avatar when null
  }

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
    res.status(201).json({ message: 'Student registered successfully' });

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

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
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

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
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
router.put('/profile/image', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { studentId: req.user.id },
      {
        $set: {
          'profileImage.data': req.file.buffer,       // Binary buffer from multer
          'profileImage.contentType': req.file.mimetype,
        },
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(formatProfile(updatedProfile));

  } catch (err) {
    // Handle multer errors (file too large, wrong type)
    if (err instanceof multer.MulterError || err.message.includes('Only')) {
      return res.status(400).json({ message: err.message });
    }
    console.error('Image upload error:', err);
    res.status(500).json({ message: 'Server error uploading image' });
  }
});

export default router;