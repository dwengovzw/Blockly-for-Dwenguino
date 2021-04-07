import nodemailer from 'nodemailer';

// when working local we use a mock smtp server from Ethereal
const emailService = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    logger: true
});

export default emailService;