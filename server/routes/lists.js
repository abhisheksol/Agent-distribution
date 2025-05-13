const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const auth = require('../middleware/auth');

// Separate the upload middleware from the route handler
const upload = listController.upload.single('file');

// @route   POST /api/lists/upload
// @desc    Upload and distribute list
// @access  Private
router.post('/upload', auth, (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    }
    next();
  });
}, listController.uploadAndDistributeList);

// @route   GET /api/lists/agent/:agentId
// @desc    Get lists by agent
// @access  Private
router.get('/agent/:agentId', auth, listController.getListsByAgent);

// @route   GET /api/lists/all
// @desc    Get all distributed lists
// @access  Private
router.get('/all', auth, listController.getAllDistributedLists);

module.exports = router;