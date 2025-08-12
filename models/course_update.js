const mongoose = require('mongoose');

const courseUpdateSchema = new mongoose.Schema({
  regId: {
    type: String,
    unique: true, // Ensure uniqueness
    required: true,
    
  },
  time: String,
  topic: String,
  classType: String,
}, { timestamps: true });

module.exports = mongoose.model('Course_Update', courseUpdateSchema);
