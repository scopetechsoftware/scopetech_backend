const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    studentRegister: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: true },
    date: { type: Date, default: Date.now },
    mode: { type: String, enum: ['online', 'offline'], required: true },
    location: { type: String }, // Only needed for offline
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    markedBy: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
