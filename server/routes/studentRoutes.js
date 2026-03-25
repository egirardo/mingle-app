import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import StudentAuth from '../models/StudentAuth.js';
import StudentProfile from '../models/StudentProfile.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── REGISTER ───────────────────────────────────────────────────────────────
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

    // Implode questions array into a single string e.g. "answer1||answer2||answer3"
    const implodedQuestions = questions
      ? questions.filter(Boolean).join('||')
      : null;

    // Create profile record linked to auth
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

// ─── LOGIN ───────────────────────────────────────────────────────────────────
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

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
// GET /api/students/profile
// Protected — requires token
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Explode questions string back into an array for the frontend
    const explodedQuestions = profile.questions
      ? profile.questions.split('||')
      : [];

    res.status(200).json({ ...profile.toObject(), questions: explodedQuestions });

  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
// PUT /api/students/profile
// Protected — requires token
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, program, skills, about, questions, portfolio } = req.body;

    // Implode questions before saving (only if provided)
    const implodedQuestions = questions
      ? questions.filter(Boolean).join('||')
      : null;

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

    // Explode questions before sending back
    const explodedQuestions = updatedProfile.questions
      ? updatedProfile.questions.split('||')
      : [];

    res.status(200).json({ ...updatedProfile.toObject(), questions: explodedQuestions });

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

export default router;