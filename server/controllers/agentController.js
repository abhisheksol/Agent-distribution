const Agent = require('../models/Agent');

// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ createdBy: req.user.id }).select('-password');
    res.json(agents);
  } catch (error) {
    console.error('Get all agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new agent
exports.createAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    // Check if agent already exists
    let agent = await Agent.findOne({ email, createdBy: req.user.id });
    if (agent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    // Create new agent
    agent = new Agent({
      name,
      email,
      mobileNumber,
      password,
      createdBy: req.user.id
    });

    await agent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber
      }
    });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an agent
exports.updateAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;
    
    // Find agent by ID and creator
    let agent = await Agent.findOne({ 
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Update agent details
    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobileNumber = mobileNumber || agent.mobileNumber;
    
    // If password is provided, it will be hashed by the pre-save hook
    if (req.body.password) {
      agent.password = req.body.password;
    }

    await agent.save();

    res.json({
      message: 'Agent updated successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber
      }
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findOneAndDelete({ 
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({ message: 'Agent removed successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};