const Course = require('../models/course');
const fs = require('fs');
const path = require('path');

exports.getCourses = async (req, res)=> {
 
 try {
  const courses = await Course.find();
  res.json(courses);
 } catch (err) {
   res.status(500).json({error: err.message})
 }
}

exports.createCourse = async (req, res) => {

  try {
    const { courseCode, courseName, fees, duration, prerequire,syllabus } = req.body;
      
      const newSyllabus = JSON.stringify(syllabus.split(','));



    
      
      
      
    
    const image = req.file ? `${req.file.filename}`: '';
    const course = new Course({ courseCode, courseName, fees, duration, prerequire, image,       syllabus: JSON.parse(newSyllabus || '[]')
 });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({error: err.message})
    console.log(err);
    
  }
  
  };
  
  // Update course
  exports.updateCourse = async (req, res) => {

    try {
      const {courseCode, courseName, fees, duration, prerequire, syllabus} = req.body;
        const newSyllabus = JSON.stringify(syllabus.split(','));
    const updateData = {
      courseCode,
      courseName,
      fees,
      duration,
      prerequire,
      syllabus: JSON.parse(newSyllabus || '[]')
    }
    if(req.file) updateData.image = `${req.file.filename}`;
    
    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
    } catch (err) {
      res.status(500).json({error: err.message})
    }

    
  };
  
  // Delete course
  exports.deleteCourse = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      // Delete image file from uploads folder
      if (course.image) {
        console.log('hoi');
        
        const imagePath = path.join(__dirname, '..', 'uploads', course.image.replace(/^\/+/, '')); // remove leading slash if present
       
        
        fs.unlink(imagePath, err => {
          if (err) {
            console.error('❌ Failed to delete image:', err);
          } else {
            console.log('✅ Image deleted:', imagePath);
          }
        });
      }
  
      await Course.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };