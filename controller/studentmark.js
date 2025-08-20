// controllers/staffController.js
const StudentRegister = require('../models/studentRegister');
const StudentMarks = require('../models/studentmark');

// 1. Get logged-in staff's students with course
// controllers/staffController.js
exports.getMyStudents = async (req, res) => {
  try {
    const { staffId } = req.query; // ✅ instead of req.body

    const students = await StudentRegister.find({ staff: staffId })
      .populate('student', 'studentName')
      .populate('course', 'courseName');

    res.json(students.map(s => ({
      studentRegisterId: s._id,
      studentName: s.student.studentName,
      courseName: s.course.courseName
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 2. Add mark for a student
exports.addStudentMark = async (req, res) => {
  try {
    const { studentRegisterId, syllabusName, testMark } = req.body;

    const mark = new StudentMarks({
      studentRegister: studentRegisterId,
      syllabusName,
      testMark
    });

    await mark.save();

    res.status(201).json({ message: 'Mark added successfully', data: mark });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get all marks for a student
exports.getStudentMarks = async (req, res) => {
  try {
    const { studentRegisterId } = req.params;

    const marks = await StudentMarks.find({ studentRegister: studentRegisterId })
      .select('syllabusName testMark createdAt');

    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllStudentMarks = async (req, res) => {
  try {
    const marks = await StudentMarks.find()
      .populate({
        path: "studentRegister",
        populate: [
          { path: "student", select: "studentName" },
          { path: "course", select: "courseName" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(
      marks.map((m) => ({
        id: m._id,
        date: m.createdAt,
        studentName: m.studentRegister?.student?.studentName || "N/A",
        courseName: m.studentRegister?.course?.courseName || "N/A",
        syllabusName: m.syllabusName,
        testMark: m.testMark,
        status: m.testMark >= 40 ? "Pass" : "Fail", // ✅ Example rule
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};