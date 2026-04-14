import express from 'express';
import bcrypt from 'bcrypt';
import StudentAuth from '../models/StudentAuth.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET CREDENTIALS ──────────────────────────────────────────────────────────
// GET /api/credentials
// Returns the current student's email (no password — never send that to client)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const auth = await StudentAuth.findById(req.user.id).select('email');
    if (!auth) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json({ email: auth.email });
  } catch (err) {
    console.error('Get credentials error:', err);
    res.status(500).json({ message: 'Server error retrieving credentials' });
  }
});

// ─── UPDATE CREDENTIALS ───────────────────────────────────────────────────────
// PUT /api/credentials
// Updates email and/or password. Password is only changed when a new one is provided.
router.put('/', authMiddleware, async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'Provide at least one field to update' });
  }

  try {
    const updates = {};

    if (email) {
      const normalized = email.toLowerCase().trim();
      const existing = await StudentAuth.findOne({ email: normalized });
      if (existing && String(existing._id) !== String(req.user.id)) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = normalized;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const auth = await StudentAuth.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!auth) return res.status(404).json({ message: 'Account not found' });

    res.status(200).json({ message: 'Credentials updated successfully' });
  } catch (err) {
    console.error('Update credentials error:', err);
    res.status(500).json({ message: 'Server error updating credentials' });
  }
});

export default router;
