const mongoose = require('mongoose');

const studentsSchema = mongoose.Schema({
    studentName: String,
    studentMobile: String,
    studentMail: String,   
    studentEducation: [String],
    studentCollege: String,
    studentCollegeAddress: String,
    studentYearOrExperience: String,
    studentImage: String,
    studentAadharImage: String,
    studentAddress: String,
    studentStatus: String,
    studentCourse: String,
    studentRedId: String,
    studentCollegeId: String

}, {timestamps: true})

module.exports = mongoose.model('Student', studentsSchema);