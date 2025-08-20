const Attendance = require('../models/attendance');
const StudentRegister = require('../models/studentRegister');

// Office location coordinates
const OFFICE_LAT = 9.945088;
const OFFICE_LNG = 78.09857;
const MAX_DISTANCE_KM = 0.5; // 500 meters
// allowed distance in KM




function haversineDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Student marks attendance
exports.markAttendance = async (req, res) => {
    try {
        const { studentRegisterId, mode, latitude, longitude } = req.body;

        const studentData = await StudentRegister.findById(studentRegisterId)
            .populate('student', 'name')
            .populate('course', 'courseName')
            .populate('staff', 'name');

        if (!studentData) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Location check for offline mode
        if (mode === 'offline') {
            const distance = haversineDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
            console.log('Student Location:', latitude, longitude);
            console.log('Office Location:', OFFICE_LAT, OFFICE_LNG);
            console.log('Calculated Distance (km):', distance);

            if (distance > MAX_DISTANCE_KM) {
                return res.status(400).json({ message: 'Offline attendance must be marked from office location' });
            }
        }


        const attendance = await Attendance.create({
            studentRegister: studentRegisterId,
            mode,
            location: latitude && longitude ? `${latitude},${longitude}` : undefined
        });

        res.json({ message: 'Attendance request submitted', data: attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin views pending requests
exports.getPendingAttendance = async (req, res) => {
    try {
        const pending = await Attendance.find({ status: 'pending' })
            .populate({
                path: 'studentRegister',
                populate: [
                    { path: 'student', select: 'name' },
                    { path: 'course', select: 'courseName' }
                ]
            });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin approves/rejects
exports.updateAttendanceStatus = async (req, res) => {
    try {
        const { attendanceId, status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const attendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            { status, markedBy: 'admin' },
            { new: true }
        );
        res.json({ message: 'Attendance updated', data: attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getallattend = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({
        path: "studentRegister",
        populate: [
          { path: "student", model: "Student", select: "studentName" },
          { path: "course", model: "Course", select: "courseName" }
        ]
      })
      .lean();

    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Attendance.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.json({ message: "Attendance record deleted successfully", data: deleted });
    } catch (error) {
        console.error("Error deleting attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};



