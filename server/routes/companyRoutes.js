import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import Company from '../models/Company.js';
import { validateBody, rules, VALID_LIA_SPACES, VALID_SKILLS } from '../middleware/validate.js';

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registration attempts. Please try again in an hour.' },
});

// ─── VALIDATION SCHEMA ────────────────────────────────────────────────────────

const companyRegisterSchema = {
  company:       { required: true, label: 'Company name',    rules: [rules.isString('Company name'),    rules.nonEmpty('Company name'),    rules.maxLen('Company name', 150)] },
  contactPerson: { required: true, label: 'Contact person',  rules: [rules.isString('Contact person'),  rules.nonEmpty('Contact person'),  rules.maxLen('Contact person', 150)] },
  email:         {                 label: 'Email',            rules: [rules.isString('Email'),           rules.nonEmpty('Email'),           rules.email('Email')] },
  liaSpaces:     { required: true, label: 'LIA spaces',       rules: [rules.oneOf('LIA spaces', VALID_LIA_SPACES)] },
  skills:        { required: true, label: 'Skills',           rules: [rules.isArray('Skills'), rules.arrayOfStrings('Skills'), rules.arrayAllowed('Skills', VALID_SKILLS)] },
  about:         { required: true, label: 'About',            rules: [rules.isString('About'),           rules.nonEmpty('About'),           rules.maxLen('About', 500)] },
  website:       {                 label: 'Website',          rules: [rules.isString('Website'),         rules.maxLen('Website', 500),      rules.safeUrl('Website')] },
};

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

// ─── GET ALL COMPANIES ────────────────────────────────────────────────────────
// GET /api/companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({}, { company: 1, skills: 1, about: 1, liaSpaces: 1 });
    res.status(200).json(companies);
  } catch (err) {
    console.error('Get all companies error:', err);
    res.status(500).json({ message: 'Server error retrieving companies' });
  }
});

// ─── GET BULK PROFILES ───────────────────────────────────────────────────────
// GET /api/companies/bulk?ids=id1,id2,...
// Returns all companies whose _id is in the comma-separated `ids` query param.
// Used by the client to hydrate saved companies in one round-trip.
router.get('/bulk', async (req, res) => {
  const raw = req.query.ids ?? '';
  const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);

  if (!ids.length) {
    return res.status(400).json({ message: 'ids query param is required' });
  }

  const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validIds.length !== ids.length) {
    return res.status(400).json({ message: 'One or more IDs are invalid' });
  }

  try {
    const companies = await Company.find({ _id: { $in: validIds } });
    res.status(200).json(companies);
  } catch (err) {
    console.error('Bulk companies error:', err);
    res.status(500).json({ message: 'Server error retrieving companies' });
  }
});

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
router.post('/profile', registerLimiter, validateBody(companyRegisterSchema), async (req, res) => {
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