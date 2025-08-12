const User = require('../models/user');
const Student = require('../models/student');
const Staff = require('../models/staffs');

// Get all students for dropdown (admin only)
exports.getStudentsForDropdown = async (req, res) => {
    try {
      const students = await Student.find({}, 'studentName studentMobile studentMail')
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all staff for dropdown (admin only)
exports.getStaffForDropdown = async (req, res) => {
    try {
        const staff = await Staff.find({}, 'staffName staffMobile staffMail');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create user account for student or staff
exports.createUser = async (req, res) => {
    const { username, password, role, studentId, staffId } = req.body;

    if (!['student', 'staff'].includes(role)) {
        return res.status(400).json({ message: 'Role must be student or staff' });
    }

    try {
        // Check if username already exists
        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if user account already exists for this student/staff
        let existingUser;
        if (role === 'student') {
            existingUser = await User.findOne({ studentId, role });
            if (existingUser) {
                return res.status(400).json({ message: 'User account already exists for this student' });
            }
        } else if (role === 'staff') {
            existingUser = await User.findOne({ staffId, role });
            if (existingUser) {
                return res.status(400).json({ message: 'User account already exists for this staff' });
            }
        }

        // Verify that the referenced student/staff exists
        if (role === 'student') {
            const student  = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
        } else if (role === 'staff') {
            const staff = await Staff.findById(staffId);
            if (!staff) {
                return res.status(404).json({ message: 'Staff not found' });
            }
        }

        const newUser = new User({ 
            username, 
            password, 
            role,
            studentId: role === 'student' ? studentId : undefined,
            staffId: role === 'staff' ? staffId : undefined
        });
        
        await newUser.save();
        return res.status(201).json({ 
            message: `${role} account created successfully`,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await User.findOne({ username, role: 'admin' });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const users = await User.find({ role: { $in: ['student', 'staff'] } });
        return res.status(200).json({ message: 'Admin login successful', users });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.loginStudentOrStaff = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, isActive: true });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password using bcrypt
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admins not allowed here' });
        }

        // Get profile data
        let profileData;
        if (user.role === 'student') {
            profileData = await Student.findById(user.studentId);
        } else if (user.role === 'staff') {
            profileData = await Staff.findById(user.staffId);
        }

        if (!profileData) {
            return res.status(404).json({ message: 'Profile data not found' });
        }

        return res.status(200).json({
            message: `${user.role} login successful`,
            role: user.role,
            name: profileData.studentName || profileData.staffName,
            userId: user._id,
            profileId: user.studentId || user.staffId,
            profile: profileData
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profileData;
        if (user.role === 'student') {
            profileData = await Student.findById(user.studentId);
        } else if (user.role === 'staff') {
            profileData = await Staff.findById(user.staffId);
        }

        if (!profileData) {
            return res.status(404).json({ message: 'Profile data not found' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            profile: profileData
        });

    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Edit username or password for a staff/student user (admin only)
exports.updateUserAccount = async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user || !['staff', 'student'].includes(user.role)) {
            return res.status(404).json({ message: 'User not found or invalid role' });
        }

        // Check if new username already exists
        if (username && username !== user.username) {
            const existing = await User.findOne({ username });
            if (existing) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }

        if (password) {
            user.password = password; // Make sure password will be hashed in pre-save hook
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a staff/student user account (admin only)
exports.deleteUserAccount = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user || !['staff', 'student'].includes(user.role)) {
            return res.status(404).json({ message: 'User not found or invalid role' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




exports.toggleUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || !['student', 'staff'].includes(user.role)) {
      return res.status(404).json({ message: 'User not found or invalid role' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Toggle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId, 'username role isActive');

    if (!user || !['student', 'staff'].includes(user.role)) {
      return res.status(404).json({ message: 'User not found or invalid role' });
    }

    res.status(200).json({
      message: 'User status retrieved successfully',
      userId: user._id,
      username: user.username,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Error getting user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
