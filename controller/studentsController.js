const Student = require('../models/student');
const Placement = require('../models/placement');

const path = require('path');
const fs = require('fs');


// get all the students
exports.getAllStudent =  async (req, res) => {
    try {
        const studentList = await Student.find();
        res.json(studentList)
    } catch (err) {
        res.status(500).json({error: err})
    }
}

// post new students

exports.addStudent = async (req, res) => {
    try {
        const {
            studentName,
            studentMobile,
            studentMail,   
            studentEducation,
            studentCollege,
            studentCollegeAddress,
            studentYearOrExperience,
            studentAddress,
            studentStatus,
            studentCourse,
            studentRedId,
            studentCollegeId
          } = req.body;

          const newStudent = new Student({
            studentCourse,
            studentName,
            studentMobile,
            studentMail,   
            studentEducation: JSON.parse(studentEducation || '[]'),
            studentCollege,
            studentCollegeAddress,
            studentYearOrExperience,
            studentAddress,
            studentStatus, 
             studentRedId,
            studentCollegeId,          
            studentImage: req.files?.studentImage?.[0]?.filename || '',
            studentAadharImage: req.files?.studentAadharImage?.[0]?.filename || ''
          })
          await newStudent.save();
          res.json(newStudent);
    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

// Edit Student

exports.UpdateStudent = async (req, res) => {
    try {
        const {
            studentName,
            studentMobile,
            studentMail,   
            studentEducation,
            studentCollege,
            studentCollegeAddress,
            studentYearOrExperience,
            studentAddress,
            studentStatus, 
              studentRedId,
            studentCollegeId,  
            studentCourse,
            
        } = req.body;

        const updateData  = {
            studentName,
            studentMobile,
            studentMail,   
            studentEducation: JSON.parse(studentEducation || '[]'),
            studentCollege,
            studentCollegeAddress,
            studentYearOrExperience,
            studentAddress,
            studentStatus, 
              studentRedId,
            studentCollegeId,   
            studentCourse         
        }
        if(req.files?.studentImage) {
            updateData.studentImage = req.files.studentImage[0].filename;
        }
        if(req.files?.studentAadharImage){
            updateData.studentAadharImage = req.files.studentAadharImage[0].filename;
        }

       const updated =  await Student.findByIdAndUpdate(req.params.id, updateData, {new: true})
       res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).json({error: 'student not found'})
    
            const deleteFile = (filename) => {
              if(!filename) return;
              const filePath = path.join(__dirname, '..', 'uploads', filename);
              fs.unlink(filePath, (err)=> {
                if (err) {
                    console.error('❌ Failed to delete file:', err);
                  } else {
                    console.log('✅ File deleted:', filePath);
                  }
                
              })
            }
    
    
            deleteFile(student.studentImage);
            deleteFile(student.studentAadharImage);
            await Student.findByIdAndDelete(req.params.id);
            res.json({success: true})
    
    } catch (err) {
        res.status(500).json({error: err})
    }
   
}

exports.getStudent = async (req, res) => {
   try {
     const student =   await Student.findById(req.params.id);
     if(!student) res.status(404).json({error: "The page is not found"});
     res.json(student);
   } catch (err) {
     res.status(500).json({error: err});
   }
}

exports.getStudentAllDetail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const placement = await Placement.findOne({ student: req.params.id });

    res.json({ student, placement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
}