import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import StudentAuth from '../models/StudentAuth.js';
import StudentProfile from '../models/StudentProfile.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── REGISTER ───────────────────────────────────────────────────────────────
// POST /api/students/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, program, skills, about, questions, portfolio } = req.body;

    // Check if student already exists
    const existingUser = await StudentAuth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create auth record
    const studentAuth = new StudentAuth({ email, password: hashedPassword });
    await studentAuth.save();

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
    await studentProfile.save();

    res.status(201).json({ message: 'Student registered successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
// POST /api/students/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await StudentAuth.findOne({ email });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
// PUT /api/students/profile
// Protected — requires token
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, program, skills, about, questions, portfolio } = req.body;

    // Implode questions before saving
    const implodedQuestions = questions
      ? questions.filter(Boolean).join('||')
      : null;

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { studentId: req.user.id },
      { firstName, lastName, program, skills, about, questions: implodedQuestions, portfolio },
      { new: true }
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
    res.status(500).json({ error: err.message });
  }
});

export default router;