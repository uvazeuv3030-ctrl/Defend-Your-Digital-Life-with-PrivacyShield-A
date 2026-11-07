const express = require('express');
const cors = require('cors');
const { analyzeUrlThreat, SYNTHETIC_THREAT_DATABASE } = require('./threatEngine');
const { PERMISSIONS_DIRECTORY, TOXIC_COMBINATIONS, evaluatePermissions } = require('./permissionsData');
const { PRIVACY_QUESTIONS, calculatePrivacyScore } = require('./quizData');
const { SCAM_PLAYBOOKS, DPDP_ACT_RIGHTS, EMERGENCY_RESOURCES } = require('./scamsData');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: CORS and JSON body size limits (prevents payload-bloat attacks)
app.use(cors({
  origin: '*', // For hackathon prototype development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '64kb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'PrivacyShield AI Core API',
    version: '1.0.0-hackathon',
    timestamp: new Date().toISOString()
  });
});

/**
 * URL Threat Analysis Endpoint
 * Zero-SSRF: never executes an HTTP fetch to the destination
 */
app.post('/api/analyze-url', (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'A valid URL string is required in request body.'
      });
    }

    const analysis = analyzeUrlThreat(url);
    return res.json(analysis);
  } catch (err) {
    return res.status(400).json({
      error: 'Analysis Error',
      message: err.message || 'Unable to parse or analyze submitted URL.'
    });
  }
});

/**
 * Get all known dangerous permissions and toxic combinations
 */
app.get('/api/permissions', (req, res) => {
  res.json({
    directory: PERMISSIONS_DIRECTORY,
    toxicCombinations: TOXIC_COMBINATIONS
  });
});

/**
 * Analyze an app's permission bundle
 */
app.post('/api/analyze-permissions', (req, res) => {
  try {
    const { permissions, appCategory } = req.body;
    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'permissions must be an array of permission IDs.'
      });
    }

    const result = evaluatePermissions(permissions, appCategory || 'general');
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      error: 'Evaluation Error',
      message: err.message
    });
  }
});

/**
 * Get Privacy Quotient Questionnaire
 */
app.get('/api/privacy-quiz/questions', (req, res) => {
  res.json({
    questions: PRIVACY_QUESTIONS
  });
});

/**
 * Calculate Privacy Quotient Score
 */
app.post('/api/privacy-quiz/evaluate', (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'answers object mapping questionId to optionIndex is required.'
      });
    }

    const evaluation = calculatePrivacyScore(answers);
    return res.json(evaluation);
  } catch (err) {
    return res.status(500).json({
      error: 'Evaluation Error',
      message: err.message
    });
  }
});

/**
 * Get India Cyber Threat Hub Playbooks and DPDP Act Resources
 */
app.get('/api/scam-defense', (req, res) => {
  res.json({
    playbooks: SCAM_PLAYBOOKS,
    dpdpRights: DPDP_ACT_RIGHTS,
    emergency: EMERGENCY_RESOURCES
  });
});

// Static client serving for production demo
const path = require('path');
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to React index.html for client-side routing in Express 5
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send('PrivacyShield AI API active. Build dist/ to view web interface.');
    }
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[PrivacyShield AI] Production Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
