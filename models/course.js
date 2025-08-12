const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: String,
    courseName: String,
    fees: String,
    duration: String,
    prerequire: String,
    syllabus: [String],
    image: String
  }, {timestamps: true})
  module.exports = mongoose.model('Course',  courseSchema);


  