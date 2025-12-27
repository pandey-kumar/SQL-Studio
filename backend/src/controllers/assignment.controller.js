const Assignment = require('../models/Assignment.model');

// Get all assignments with pagination and filters
exports.getAllAssignments = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      difficulty, 
      category,
      search 
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [assignments, total] = await Promise.all([
      Assignment.find(filter)
        .select('title difficulty category description points timeLimit createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Assignment.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        assignments,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single assignment by ID
exports.getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// Get assignment categories with counts
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Assignment.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get difficulty distribution
exports.getDifficultyStats = async (req, res, next) => {
  try {
    const stats = await Assignment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
