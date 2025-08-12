const CourseUpdate = require('../models/course_update');

const createCourseUpdate = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Invalid input format. Expecting an array of updates.' });
    }

    const results = [];

    for (const update of updates) {
      const updatedDoc = await CourseUpdate.findOneAndUpdate(
        { regId: update.regId },    // find by regId
        { $set: update },           // update fields
        { new: true, upsert: true } // create if not found
      );
      results.push(updatedDoc);
    }

    res.status(200).json({ message: 'Schedule saved/updated successfully', data: results });
  } catch (error) {
    console.error('Error in schedule update:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCourseUpdates = async (req, res) => {
  try {
    const updates = await CourseUpdate.find().sort({ updatedAt: -1 }); // latest first
    res.status(200).json(updates);
  } catch (error) {
    console.error('Error fetching course updates:', error);
    res.status(500).json({ message: 'Failed to fetch course updates' });
  }
};

module.exports = {
  createCourseUpdate,
  getCourseUpdates
};
