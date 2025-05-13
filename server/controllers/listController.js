const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Agent = require('../models/Agent');
const ListItem = require('../models/ListItem');

// Update storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Update file filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLS, and XLSX files are allowed'));
  }
};

// Update multer configuration
exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.unlinkSync(filePath); // Remove file after processing
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const results = xlsx.utils.sheet_to_json(worksheet);
      fs.unlinkSync(filePath); // Remove file after processing
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};

// Update upload and distribute list function
exports.uploadAndDistributeList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let listItems;

    try {
      if (fileExt === '.csv') {
        listItems = await parseCSV(filePath);
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        listItems = await parseExcel(filePath);
      }
    } catch (error) {
      // Clean up file if parsing fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }

    // Validate the list items
    const validListItems = listItems.filter(item => 
      item.FirstName && item.Phone && 
      typeof item.FirstName === 'string' && 
      typeof item.Phone === 'string'
    );

    if (validListItems.length === 0) {
      return res.status(400).json({ message: 'No valid items found in the file' });
    }

    // Get all agents for this admin
    const agents = await Agent.find({ createdBy: req.user.id }).select('_id');
    
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents found. Please add agents first.' });
    }

    // Distribute items among agents
    const distribution = distributeItems(validListItems, agents);

    // Save distributed items to database
    const savedItems = await saveDistributedItems(distribution);

    res.json({
      message: 'List uploaded and distributed successfully',
      totalItems: validListItems.length,
      distribution: savedItems
    });
  } catch (error) {
    console.error('Upload and distribute list error:', error);
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: 'Error processing file upload', 
      error: error.message 
    });
  }
};

// Distribute items among agents
const distributeItems = (items, agents) => {
  const distribution = {};
  agents.forEach(agent => {
    distribution[agent._id] = [];
  });

  const agentIds = agents.map(agent => agent._id);
  const agentCount = agentIds.length;

  items.forEach((item, index) => {
    const agentIndex = index % agentCount;
    const agentId = agentIds[agentIndex];
    
    distribution[agentId].push({
      firstName: item.FirstName,
      phone: item.Phone,
      notes: item.Notes || ''
    });
  });

  return distribution;
};

// Save distributed items to database
const saveDistributedItems = async (distribution) => {
  const savedDistribution = {};

  for (const agentId in distribution) {
    const agentItems = distribution[agentId];
    const savedItems = [];

    for (const item of agentItems) {
      const listItem = new ListItem({
        firstName: item.firstName,
        phone: item.phone,
        notes: item.notes,
        assignedAgent: agentId
      });

      const savedItem = await listItem.save();
      savedItems.push(savedItem);
    }

    savedDistribution[agentId] = savedItems;
  }

  return savedDistribution;
};

// Get lists by agent
exports.getListsByAgent = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    
    // Find agent by ID
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Get all list items assigned to this agent
    const listItems = await ListItem.find({ assignedAgent: agentId });

    res.json({
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      },
      items: listItems
    });
  } catch (error) {
    console.error('Get lists by agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all distributed lists
exports.getAllDistributedLists = async (req, res) => {
  try {
    // Get all agents for this admin
    const agents = await Agent.find({ createdBy: req.user.id }).select('-password');
    
    const distributedLists = {};
    
    // For each agent, get their list items
    for (const agent of agents) {
      const listItems = await ListItem.find({ assignedAgent: agent._id });
      
      distributedLists[agent._id] = {
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          mobileNumber: agent.mobileNumber
        },
        items: listItems
      };
    }

    res.json(distributedLists);
  } catch (error) {
    console.error('Get all distributed lists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};