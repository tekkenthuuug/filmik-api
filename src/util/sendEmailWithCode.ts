import Mail from 'nodemailer/lib/mailer';

const sendEmailWithCode = async (transporter: Mail, email: string, confirmationCode: string, username: string) => {
  await transporter.sendMail({
    from: '"FILMIK APP" <filmikWeAre@gmail.com>',
    to: email,
    subject: 'Confirmation code',
    text: `Hello, ${username}! This is your confirmation code for FILMIK APP! ${confirmationCode}`,
    html: `Hello, ${username}! This is your confirmation code for FILMIK APP! <h1>${confirmationCode}</h1>`
  });
};

export default sendEmailWithCode;
