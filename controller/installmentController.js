const StudentInstallment = require("../models/installment");
const StudentRegister = require('../models/studentRegister');


// ✅ 1. ADD Installment
exports.addStudentInstallment = async (req, res) => {
  try {
    const {
      registerId,
      paymentType,
      amountReceived,
      receiptGen,
      nextIns,
    totalReceived,
      
    } = req.body;

    const newAmount = Number(amountReceived) || 0;

    const newStudentInstallment = new StudentInstallment({
      register: registerId,
      paymentType,
      amountReceived: newAmount,
      receiptGen,
      nextIns,
    totalReceived,

    });

    await newStudentInstallment.save();

    const register = await StudentRegister.findById(registerId);
    if (!register) {
      return res.status(404).json({ error: "Student Register not found" });
    }

    // Update amountReceived and balance
    const prevAmount = Number(register.amountReceived) || 0;
    const updatedAmount = prevAmount + newAmount;

    register.amountReceived = updatedAmount.toString();

    const courseFees = Number(register.courseFees) || 0;
    const newBalance = courseFees - updatedAmount;
    register.balance = newBalance.toString();

    await register.save();

    res.status(201).json(newStudentInstallment);
  } catch (err) {
    console.error('Add student installment Error:', err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ 2. UPDATE Installment
exports.updateStudentInstallment = async (req, res) => {
  

   
    const {
      registerId,
      paymentType,
      amountReceived,
      receiptGen,
      nextIns,
    totalReceived,

    } = req.body;

    // Validate registerId
    if (!registerId || registerId.trim() === "") {
      return res.status(400).json({ error: "registerId is required" });
    }

    const updatedAmount = Number(amountReceived) || 0;

    // Get the existing installment
    const existingInstallment = await StudentInstallment.findById(req.params.id);
    if (!existingInstallment) {
      return res.status(404).json({ error: "Installment not found" });
    }

    const oldAmount = Number(existingInstallment.amountReceived) || 0;

    // Update fields
    existingInstallment.register = registerId; // Only if valid
    existingInstallment.paymentType = paymentType;
    existingInstallment.amountReceived = updatedAmount;
    existingInstallment.receiptGen = receiptGen;
    existingInstallment.nextIns = nextIns;
    existingInstallment.totalReceived = totalReceived;

    await existingInstallment.save();

    // Update related StudentRegister
    const register = await StudentRegister.findById(registerId);
    if (!register) {
      return res.status(404).json({ error: "Student Register not found" });
    }

    const previousTotal = Number(register.amountReceived) || 0;
    const newTotal = previousTotal - oldAmount + updatedAmount;

    register.amountReceived = newTotal.toString();

    const courseFees = Number(register.courseFees) || 0;
    const newBalance = courseFees - newTotal;
    register.balance = newBalance.toString();

    await register.save();

    res.json(existingInstallment);
  
};




// ✅ 3. DELETE Installment
exports.deleteStudentInstallment = async (req, res) => {
  try {
    // Find and delete the installment in one go
    const installment = await StudentInstallment.findByIdAndDelete(req.params.id);

    if (!installment) {
      return res.status(404).json({ error: 'Student Installment not found' });
    }

    const amountToRemove = Number(installment.amountReceived) || 0;

    // Update related student register
    const register = await StudentRegister.findById(installment.register);
    if (register) {
      const prevAmount = Number(register.amountReceived) || 0;
      const updatedAmount = prevAmount - amountToRemove;

      register.amountReceived = updatedAmount.toString();

      const courseFees = Number(register.courseFees) || 0;
      const newBalance = courseFees - updatedAmount;
      register.balance = newBalance.toString();

      await register.save();
    }

    res.json({ message: 'Student Installment deleted successfully' });
  } catch (err) {
    console.error('Delete student installment error:', err);
    res.status(500).json({ error: err.message });
  }
};






// ✅ 4. GET All Installments
exports.getAllStudentInstallments = async (req, res) => {
  try {
    const studentInstallments = await StudentInstallment.find().populate({
      path: 'register',
      populate: [
        { path: 'student' },
        { path: 'course' },
        { path: 'staff' }
      ]
    });
    res.json(studentInstallments);
  } catch (err) {
    console.error('Fetch student installments error:', err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ 5. GET Single Installment
exports.getStudentInstallmentById = async (req, res) => {
  try {
    const studentInstallment = await StudentInstallment.findById(req.params.id).populate({
      path: 'register',
      populate: [
        { path: 'student' },
        { path: 'course' },
        { path: 'staff' }
      ]
    });

    if (!studentInstallment) {
      return res.status(404).json({ error: 'Student Installment not found' });
    }

    res.json(studentInstallment);
  } catch (err) {
    console.error('Fetch student installment error:', err);
    res.status(500).json({ error: err.message });
  }
};
