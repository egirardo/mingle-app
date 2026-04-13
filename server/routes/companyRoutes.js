import express from 'express';
import mongoose from 'mongoose';
import Company from '../models/Company.js';

const router = express.Router();

// ─── HELPERS ─────────────────────────────────────────────────────────────────
/**
 * Validates that a URL has a safe http/https scheme and is a valid URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidWebsiteURL(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    // Only allow http and https schemes
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
    // URL constructor throws if invalid format
    return false;
  }
}

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
// GET /api/companies/profile/:id
router.get('/profile/:id', async (req, res) => {
  // Validate ObjectId upfront
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid company ID format' });
  }

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
    const { company, contactPerson, email, liaSpaces, skills, about, website } = req.body;

    // Normalize website: trim and treat whitespace-only input as undefined
    let processedWebsite = website;
    if (typeof website === 'string') {
      processedWebsite = website.trim();
      // If after trimming it's empty, treat as not provided
      if (!processedWebsite) {
        processedWebsite = undefined;
      } else if (!/^https?:\/\//i.test(processedWebsite)) {
        // Auto-prepend https:// if protocol is missing
        processedWebsite = `https://${processedWebsite}`;
      }
    }

    // Validate website URL if provided
    if (processedWebsite && !isValidWebsiteURL(processedWebsite)) {
      return res.status(400).json({ 
        message: 'Invalid website URL. Must be a valid HTTP or HTTPS URL (e.g., https://example.com)' 
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if company already exists
    const existingCompany = await Company.findOne({ email: normalizedEmail });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newCompany = new Company({
      company,
      contactPerson,
      email: normalizedEmail,
      liaSpaces,
      skills: skills || [],
      about,
      website: processedWebsite
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

// ─── COUNT ────────────────────────────────────────────────────────────────────
// GET /api/companies/count
router.get('/count', async (req, res) => {
  try {
    const count = await Company.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error('Count error:', err);
    res.status(500).json({ message: 'Server error getting count' });
  }
});

export default router; 