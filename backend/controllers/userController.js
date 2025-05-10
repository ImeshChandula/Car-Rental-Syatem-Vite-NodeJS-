const User = require('../models/User');


// Get all users - Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    
    const rolePriority = {
      'owner': 3,
      'manager': 2,
      'customer': 1
    };

    // Sort users by role priority (highest first)
    const sortedUsers = users.sort((a, b) => {
      const priorityA = rolePriority[a.role] || 0;
      const priorityB = rolePriority[b.role] || 0;
      
      // Sort by priority first (descending)
      if (priorityB !== priorityA) {
        return priorityB - priorityA;
      }
      
      // If same priority, sort alphabetically by name (ascending)
      return a.name.localeCompare(b.name);
    });

    // Remove passwords from response
    const sanitizedUsers = sortedUsers.map(user => {
      user.password = undefined;
      return user;
    });
    
    res.json({count: sanitizedUsers.length, data: sanitizedUsers});
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



module.exports = {getAllUsers};