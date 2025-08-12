const Company = require('../models/company');
const fs = require('fs');
const path = require('path');



// add company 

exports.addCompany = async (req, res) => {
    try {
        const { companyName, companyLocation } = req.body;
        const companyImage = req.file ? `${req.file.filename}` : '';
        const company = new Company({ companyImage, companyName, companyLocation })
        await company.save();
        res.json(company);

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// get company

exports.getCompany = async (req, res) => {
    try {
        const company = await Company.find()
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message, mes: "I don't know"
         })
    }
}


// update the company data

exports.updateCompany = async (req, res) => {
    try {
        const { companyName, companyLocation } = req.body;

        const updateData = {
            companyName,
            companyLocation,

        }
        if (req.file) {
            updateData.companyImage = `${req.file.filename}`;
        }
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.json(updatedCompany);
    } catch (err) {
        res.status(500).json({ error: err.message })

    }
}


// Delete the company


exports.deleteCompany = async (req, res) => {
    try {

        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

          if (company.companyImage) {
                console.log('hoi');
                
                const imagePath = path.join(__dirname, '..', 'uploads', company.companyImage.replace(/^\/+/, '')); // remove leading slash if present
               
                
                fs.unlink(imagePath, err => {
                  if (err) {
                    console.error('❌ Failed to delete image:', err);
                  } else {
                    console.log('✅ Image deleted:', imagePath);
                  }
                });
              }

        await Company.findByIdAndDelete(req.params.id);
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })

    }
}

