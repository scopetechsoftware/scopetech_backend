const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    enName: {type: String, required: [true, "Name field is required"]},
    enMail: String,
    enMobile: String,
    enCourse: String,
    enReference: String,
    enReferedStudent: String,
    enStatus: String,
    enNextFollowUp: {type: Date},
    

}, {timestamps: true});

module.exports = mongoose.model('Enquiry', enquirySchema);