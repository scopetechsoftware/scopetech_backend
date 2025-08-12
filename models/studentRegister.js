const mongoose  = require('mongoose');
const CourseUpdate = require('./course_update'); 

const studentRegisterSchema = mongoose.Schema({

    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student' , required: true,  unique: true,},
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    staff: {type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true},
    courseFees: String,
    paymentType: String,
    amountReceived: String,
    amountReceivedd: String,
    balanced: String,
    receiptGen: String,
    courseDuration: String,
    freezingDate: String,
    secondInstallment: String,
    balance: String,
    availTime: String,
    

}, {timestamps: true});


studentRegisterSchema.pre('findOneAndDelete', async function (next) {
    try {
        const doc = await this.model.findOne(this.getFilter());
        if (!doc) return next();
        
        const regIdToDelete = doc.regId || doc._id.toString(); // fallback to _id

        await CourseUpdate.deleteMany({ regId: regIdToDelete });
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('StudentRegister', studentRegisterSchema);
