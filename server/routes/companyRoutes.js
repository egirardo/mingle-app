import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
// GET /api/companies/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);

  } catch (err) {
    console.error('Get company error:', err);
    res.status(500).json({ message: 'Server error retrieving company' });
  }
});

// ─── CREATE PROFILE ──────────────────────────────────────────────────────────
// POST /api/companies/profile
router.post('/profile', async (req, res) => {
  try {
    const { company, contactPerson, email, liaSpaces, skills } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newCompany = new Company({
      company,
      contactPerson,
      email,
      liaSpaces,
      skills: skills || [],
    });

    await newCompany.save();
    res.status(201).json(newCompany);

  } catch (err) {
    console.error('Create company error:', err);
    
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Return generic error to client
    res.status(500).json({ message: 'Server error creating company' });
  }
});

export default router;