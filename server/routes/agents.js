const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const auth = require('../middleware/auth');

// @route   GET /api/agents
// @desc    Get all agents
// @access  Private
router.get('/', auth, agentController.getAllAgents);

// @route   POST /api/agents
// @desc    Create a new agent
// @access  Private
router.post('/', auth, agentController.createAgent);

// @route   PUT /api/agents/:id
// @desc    Update an agent
// @access  Private
router.put('/:id', auth, agentController.updateAgent);

// @route   DELETE /api/agents/:id
// @desc    Delete an agent
// @access  Private
router.delete('/:id', auth, agentController.deleteAgent);

module.exports = router;