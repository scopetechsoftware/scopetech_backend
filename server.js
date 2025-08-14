const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const bodyParser = require('body-parser');
const User = require('./models/user'); // Add this after other requires

dotenv.config();
connectDB();

// Seed default admin user if not exists
(async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'stsclass2021', password: 'admin123', role: 'admin' });
      console.log('Default admin user created: username=admin, password=admin123');
    }
  } catch (err) {
    console.error('Error creating default admin user:', err);
  }
})();

const app = express();

app.use('/uploads', express.static('uploads')); // this line is important for upload the image in the upload folder
app.use(cors()); // Allows React frontend to connect

app.use(express.json()); // Parses JSON request bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/staffs', require('./routes/staffRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/placements', require('./routes/placementRoutes')); 
app.use('/api/company', require('./routes/companyRoutes')); 
app.use('/api/stureg', require('./routes/studentRegRoutes')); 
app.use('/api/receipt',  require('./routes/sendReceiptRoutes'));
app.use('/api/stuins',  require('./routes/studentInstallRoutes'));
app.use('/api/enquiry',  require('./routes/enquiryRoutes'));
app.use('/api/user',  require('./routes/userRoutes'));
app.use('/api/schedule', require('./routes/courseUpdateRoutes'));
app.use('/api/events', require('./routes/events'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


