const mongoose = require('mongoose');

const staffScema = mongoose.Schema({
    staffName: String,
    staffMobile: String,
    staffMail: String,
    staffQualification: [String],
    staffExperience: [String],
    staffAddress: String,
    staffImage: String,
    staffAadharImage: String,
    staffRole: String,
}, {timestamps: true})

module.exports = mongoose.model('Staff', staffScema);