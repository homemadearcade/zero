import User, { hashPassword } from '../models/User';
import nodemailer from 'nodemailer'
import { generateUniqueId } from '../utils/utils';
import express from 'express';
const router = express.Router();


//you can use the registerUser controller and getUsers controller to test the API endpoints in Postman since they are not connected to the client

// verify the email exist
const checkEmail = async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).send({ message: 'Email exists in the database' });
    } else {
      res.status(404).send({ message: 'Email does not exist in the database' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while checking the email' });
  }
};

const updatePassword = async (req, res) => {
  const { email, newPassword, hash } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(user.resetPasswordCode !== req.params.code) {
      return res.status(401).json({ message: 'Incorrect code' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the password' });
  }
};


const sendEmail = async (req, res) => {
  const { recipient_email } = req.body;
  const user = await User.findOne({ email: recipient_email });
  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const hash = generateUniqueId()

  user.resetPasswordCode = hash;
  await user.save();

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: recipient_email,
    subject: 'PASSWORD RESET',
    html: `<html>
      <body>
        <h2>Password Recovery</h2>
        <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
        <h3>https://homemadearcade.herokuapp.com/reset_password/${hash}</h3>
      </body>
    </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ message: "An error occurred while sending the email" });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send({ message: "Email sent successfully" });
    }
});};

router.get('/check_email', checkEmail);
router.put('/reset_password/:code', updatePassword);
router.post('/send_email', sendEmail);

export default router;
