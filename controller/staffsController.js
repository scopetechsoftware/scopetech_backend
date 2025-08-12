const Staff = require('../models/staffs');
const path = require('path');
const fs = require('fs');


// get all the staffs
exports.getAllStaff =  async (req, res) => {
    try {
        const staffList = await Staff.find();
        res.json(staffList)
    } catch (err) {
        res.status(500).json({error: err})
    }
}

// post new staff

exports.addStaff = async (req, res) => {
    try {
        const {
            staffName,
            staffMobile,
            staffMail,
            staffAddress,
            staffQualification,
            staffExperience,
            staffRole
          } = req.body;

          const newStaff = new Staff({
            staffName,
            staffMobile,
            staffMail,
            staffAddress,
            staffRole,
            staffQualification: JSON.parse(staffQualification || '[]'),
            staffExperience: JSON.parse(staffExperience || '[]'),
            staffImage: req.files?.staffImage?.[0]?.filename || '',
            staffAadharImage: req.files?.staffAadharImage?.[0]?.filename || ''
          })
          await newStaff.save();
          res.json(newStaff);
    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

// Edit staff

exports.UpdateStaff = async (req, res) => {
    try {
        const {
             staffName,
             staffMobile,
             staffMail,
             staffAddress,
             staffQualification,
             staffExperience,
             staffRole
        } = req.body;

        const updateData  = {
            staffName,
            staffMobile,
            staffMail,
            staffAddress,
            staffQualification: JSON.parse(staffQualification || '[]'),
            staffExperience: JSON.parse(staffExperience || '[]'),
            staffRole
        }
        if(req.files?.staffImage) {
            updateData.staffImage = req.files.staffImage[0].filename;
        }
        if(req.files?.staffAadharImage){
            updateData.staffAadharImage = req.files.staffAadharImage[0].filename;
        }

       const updated =  await Staff.findByIdAndUpdate(req.params.id, updateData, {new: true})
       res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if(!staff) return res.status(404).json({error: 'Staff not found'})
    
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
    
    
            deleteFile(staff.staffImage);
            deleteFile(staff.staffAadharImage);
            await Staff.findByIdAndDelete(req.params.id);
            res.json({success: true})
    
    } catch (err) {
        res.status(500).json({error: err})
    }
   
}

exports.getStaffById = async (req, res) => {
   try {
     const staff =   await Staff.findById(req.params.id);
     if(!staff) res.status(404).json({error: "The page is not found"});
     res.json(staff);
   } catch (err) {
     res.status(500).json({error: err});
   }
}