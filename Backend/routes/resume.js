const express = require('express');   //ok
const router = express.Router();
const Resume = require('../models/Resume');
const { body, validationResult } = require('express-validator');

// Middleware to log request details
router.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
  next();
});


// Route to save resume data
router.post('/save-resume', [
  body('email').isEmail().normalizeEmail(),
  body('personalInfo').isObject(),
  body('workEx').isArray(),
  body('education').isArray(),
  body('skills').isArray(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, personalInfo, workEx, education, skills } = req.body;

  console.log("Incoming data:", req.body); // Debugging line

  try {
    let resume = await Resume.findOne({ email });

    if (resume) {
      resume.personalInfo = personalInfo;
      resume.workEx = workEx;
      resume.education = education;
      resume.skills = skills;
      await resume.save();
    } else {
      resume = new Resume({ email, personalInfo, workEx, education, skills });
      await resume.save();
    }

    res.status(200).json({ message: 'Resume saved successfully!' });
  } catch (error) {
    console.error('Error saving resume data:', error.message);
    res.status(500).json({ error: 'Error saving resume data', details: error.message });
  }
});

// Route to get resume data by email
router.get('/get-resume/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const resume = await Resume.findOne({ email });
    console.log('Fetched resume:', resume);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume data:', error.message);
    res.status(500).json({ error: 'Failed to fetch resume. Please try again.', details: error.message });
  }
});

module.exports = router;
