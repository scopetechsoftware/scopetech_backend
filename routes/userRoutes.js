const express = require('express');
const { 
    adminLogin, 
    createUser, 
    loginStudentOrStaff, 
    getStudentsForDropdown, 
    getStaffForDropdown,
    getUserProfile, 
    updateUserAccount,
    deleteUserAccount,
    toggleUserStatus,
    getUserStatus
} = require('../controller/user');
const router = express.Router();

// Admin routes
router.post('/admin-login', adminLogin);
router.post('/create-user', createUser);
router.get('/students-dropdown', getStudentsForDropdown);
router.get('/staff-dropdown', getStaffForDropdown);
router.get('/user-status/:userId', getUserStatus);


// User routes
router.post('/login', loginStudentOrStaff);
router.get('/profile/:userId', getUserProfile);
router.put('/admin/user/:userId', updateUserAccount);   // Edit user
router.delete('/admin/user/:userId', deleteUserAccount); // Delete user
router.patch('/admin/toggle-user/:userId', toggleUserStatus);

module.exports = router;