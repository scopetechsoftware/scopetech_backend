const nodemailer = require('nodemailer');
const path = require('path');

exports.sendReceiptMail = async (req, res) => {
  const { email, message } = req.body;
  const pdfFile = req.file;

  if (!email || !pdfFile) {
    return res.status(400).json({ error: 'Email and receipt file are required.' });
  }

  const publicURL = `http://localhost:5000/uploads/${pdfFile.filename}`;

  try {
    // Email configuration (Gmail example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
       user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

  

    const mailOptions = {
      from: `"Scope Tech" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your Course Receipt - Scope Tech Software Solution',
      html: `<p>${message || 'Please find your receipt attached.'}</p><p>Also available at: <a href="${publicURL}">${publicURL}</a></p>`,
      attachments: [
        {
          filename: pdfFile.originalname,
          path: path.join(__dirname, '..', 'uploads', pdfFile.filename),
        }
      ]
    };

   

 await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Mail error:", err);
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Email sent successfully!',
        fileName: pdfFile.filename,
        publicURL,
        info,
      });
    });

  } catch (error) {
    console.error('❌ Error sending receipt email:', error);
    return res.status(500).json({ error: 'Server error while sending receipt' });
  }
};
