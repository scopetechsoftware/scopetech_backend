const enquiry = require('../models/enquiry');


exports.addEnquiry = async (req, res) => {
    try {
      const { enName,
    enMail,
    enMobile,
    enCourse,
    enReference,
    enReferedStudent,
    enStatus,
    enNextFollowUp} = req.body;

    const data = {
         enName,
    enMail,
    enMobile,
    enCourse,
    enReference,
    enReferedStudent,
    enStatus,
    enNextFollowUp
    }
     
    const enquData = new enquiry(data);
    await enquData.save();
    res.json({message: 'Enquiry added successfully', data: enquData});


    } catch (error) {
        

        if (error.name ===  "ValidationError") {
         return res.status(400).json({error: "Validation error", message: error.errors.enName.message})
        }
        res.status(500).json({error: "Can't add Enquiry Details server error", error})
    }
}

exports.getEnquiry = async (req, res) => {
  try {
     const data = await enquiry.find();
     res.json(data);  
  } catch (error) {
    res.status(501).json({error: "internal error can't fetch enquiry details"});
  }
}

exports.getSingleEnquiry = async (req, res) => {
  try {
    const data = await enquiry.findById(req.params.id);
    if(!data) {
      res.status(404).json({error: "oops Enquiry  not found"});
    }
    res.json(data);
  } catch (error) {
     res.status(500).json({error: "Internal error is occur"});
  }
}




exports.updateSingleEnquiry = async (req, res ) => {
  try {
     const { enName,
    enMail,
    enMobile,
    enCourse,
    enReference,
    enReferedStudent,
    enStatus,
    enNextFollowUp} = req.body;

    const updateData = {
         enName,
    enMail,
    enMobile,
    enCourse,
    enReference,
    enReferedStudent,
    enStatus,
    enNextFollowUp
    }
     
    const data = await enquiry.findByIdAndUpdate(req.params.id, updateData, {new: true});

    if (!data) {
      res.status(404).json({error: "Enquiry page not found check again give the correct id"});
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({error: "Network error is occur can't update the enquiry"});
  }
}

exports.deleteSingleEnquiry = async (req,res) => {
  try {
     const data = await enquiry.findByIdAndDelete(req.params.id);
     if(!data) {
      res.status(404).json({error: "page not found can't delete the unknown enquiry"});
     }
     res.json({message: "deleted successfully", data: data})
  } catch (error) {
      res.status(500).json({error: 'network error is occur '});
  }
}

exports.getFollowup = async (req, res) => {
  try {
    const data = await enquiry.find().sort({ enNextFollowUp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
