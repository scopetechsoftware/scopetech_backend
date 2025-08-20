// models/studentMarks.js
const mongoose = require('mongoose');

const studentMarksSchema = new mongoose.Schema({
  studentRegister: { // Direct link to StudentRegister
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentRegister',
    required: true
  },
  syllabusName: {
    type: String,
    required: true
  },
  testMark: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StudentMark', studentMarksSchema);
