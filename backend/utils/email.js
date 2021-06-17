import nodemailer from 'nodemailer';

// when working local we use a mock smtp server from Ethereal
let options = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true,
    logger: true
}
console.log(options);
const emailService = nodemailer.createTransport(options);

export default emailService;
