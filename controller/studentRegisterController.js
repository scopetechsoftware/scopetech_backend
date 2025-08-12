const StudentRegister = require("../models/studentRegister");





// CREATE (Add a new student register

exports.addStudentRegister = async (req, res) => {
   
    
    try {
        const {
            studentId,
            courseId,
            staffId,
            balance,
            courseFees,
            paymentType,
            amountReceived,
             amountReceivedd,
             balanced,
            receiptGen,
            courseDuration,
            freezingDate,
            secondInstallment,
            availTime

        } = req.body;

        const newStudentRegister = new StudentRegister({
            student: studentId,
            course: courseId,
            staff: staffId,           
            courseFees,
            paymentType,
            amountReceived,
            receiptGen,
            courseDuration,
            freezingDate,
             balance,
               amountReceivedd,
             balanced,
            secondInstallment,
            availTime


        });
           const existingRegistration = await StudentRegister.findOne({ student: req.body.student });
          if (existingRegistration) {
    return res.status(400).json({ message: "This registered student already exists." });
             }
        await newStudentRegister.save();
        res.status(201).json(newStudentRegister);
    } catch (err) {
        console.error('Add student Register Error:', err);
        res.status(500).json({ error: err.message, mess: 'can not add student registration' });
    }
};

// READ (Get all student registers)
exports.getAllStudentRegisters = async (req, res) => {
    try {
        const studentRegisters = await StudentRegister.find().populate('student').populate('course').populate('staff');
        res.json(studentRegisters);
    } catch (err) {
        console.error('Fetch student register Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// READ (Get single student register)
exports.getStudentRegisterById = async (req, res) => {
    try {
        const studentRegister = await StudentRegister.findById(req.params.id).populate('student').populate('course').populate('staff');
        if (!studentRegister) return res.status(404).json({ error: 'Student Register not found' });
        res.json(studentRegister);
    } catch (err) {
        console.error('Fetch student register Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// UPDATE (Edit student register)
exports.updateStudentRegister = async (req, res) => {
    try {
        const {
            studentId,
            courseId,
            staffId,
           availTime,
            courseFees,
            paymentType,
            amountReceived,
            receiptGen,
            courseDuration,
            freezingDate,
             balance,
               amountReceivedd,
             balanced,
            secondInstallment
        } = req.body;

        const updatedData = {
            student: studentId,
            course: courseId,
            staff: staffId,           
            courseFees,
            paymentType,
            amountReceived,
            receiptGen,
            courseDuration,
            freezingDate,
            secondInstallment,
            balance,
              amountReceivedd,
             balanced,
            availTime
        };



        const updated = await StudentRegister.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updated) return res.status(404).json({ error: 'Student Register not found' });
        res.json(updated);
    } catch (err) {
        console.error('Update Student Register Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// DELETE (Remove student register)
exports.deleteStudentRegister = async (req, res) => {
    try {
        const deleted = await StudentRegister.findOneAndDelete({ _id: req.params.id });
        if (!deleted) return res.status(404).json({ error: 'student register not found' });
        res.json({ message: 'student register deleted successfully' });
    } catch (err) {
        console.error('Delete student register Error:', err);
        res.status(500).json({ error: err.message });
    }
};
