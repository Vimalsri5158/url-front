import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kuttachi220105@gmail.com',
    pass: 'wdos oeec wvjz zpho'
  }
});

export const mailOptions = {
  from: 'kuttachi220105@gmail.com',
  to: 'vimalsri2732@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};