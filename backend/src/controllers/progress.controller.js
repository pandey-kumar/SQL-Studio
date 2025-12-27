const Progress = require('../models/Progress.model');
const User = require('../models/User.model');

// Get or create progress for an assignment
exports.getProgress = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or Session ID is required'
      });
    }

    const query = userId 
      ? { userId, assignmentId }
      : { sessionId, assignmentId };

    let progress = await Progress.findOne(query);

    if (!progress) {
      progress = await Progress.create({
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        assignmentId
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// Update progress (save query)
exports.updateProgress = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { sqlQuery, executionResult } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    const query = userId 
      ? { userId, assignmentId }
      : { sessionId, assignmentId };

    const updateData = {
      sqlQuery,
      $inc: { attemptCount: 1 },
      $push: {
        queryHistory: {
          query: sqlQuery,
          success: executionResult?.success || false,
          executionTime: executionResult?.executionTime || 0
        }
      }
    };

    const progress = await Progress.findOneAndUpdate(
      query,
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// Mark assignment as completed
exports.markCompleted = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { timeTaken, difficulty, points } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    const query = userId 
      ? { userId, assignmentId }
      : { sessionId, assignmentId };

    const progress = await Progress.findOneAndUpdate(
      query,
      {
        isCompleted: true,
        completedAt: new Date(),
        timeTaken
      },
      { new: true }
    );

    // Update user stats if logged in
    if (userId) {
      const statUpdate = {
        $inc: {
          'stats.totalSolved': 1,
          'stats.totalPoints': points || 10
        }
      };

      // Update difficulty-specific count
      if (difficulty) {
        const diffKey = `stats.${difficulty.toLowerCase()}Solved`;
        statUpdate.$inc[diffKey] = 1;
      }

      await User.findByIdAndUpdate(userId, statUpdate);
    }

    res.status(200).json({
      success: true,
      message: 'Assignment marked as completed!',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// Get user's overall progress
exports.getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    const query = userId ? { userId } : { sessionId };

    const progress = await Progress.find(query)
      .populate('assignmentId', 'title difficulty category points')
      .sort({ lastAttempt: -1 });

    const stats = {
      totalAttempted: progress.length,
      totalCompleted: progress.filter(p => p.isCompleted).length,
      totalAttempts: progress.reduce((sum, p) => sum + p.attemptCount, 0),
      hintsUsed: progress.reduce((sum, p) => sum + p.hintsUsed, 0)
    };

    res.status(200).json({
      success: true,
      data: {
        progress,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Increment hints used
exports.useHint = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    const query = userId 
      ? { userId, assignmentId }
      : { sessionId, assignmentId };

    const progress = await Progress.findOneAndUpdate(
      query,
      { $inc: { hintsUsed: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: {
        hintsUsed: progress.hintsUsed
      }
    });
  } catch (error) {
    next(error);
  }
};
