import { Request, Response } from 'express';
import generateCode from '../util/generateCode';
import Knex from 'knex';
import Mail from 'nodemailer/lib/mailer';

/** Send code if user hasn't varified yet */
export const handleSendCode = (db: Knex, transporter: Mail) => (req: Request, res: Response) => {
  // Checking if user verified
  db.select('verified')
    .from('login')
    .where('id', '=', req.params.id)
    .then(([data]) => {
      if (data.verified) {
        res.status(200).send({
          error: {
            details: 'User already verified'
          }
        });
        // If not varified, sending verification code
      } else {
        db('users')
          .select('username', 'email')
          .where('id', '=', req.params.id)
          .then(([data]) => {
            const confirmationCode = generateCode(6);
            // Send mail with defined transport object
            db('users')
              .update({ code: confirmationCode })
              .where('id', '=', req.params.id)
              .then(async () => {
                const info = await transporter.sendMail({
                  from: '"FILMIK APP" <filmikWeAre@gmail.com>',
                  to: data.email,
                  subject: 'Confirmation code',
                  text: `Hello, ${data.username}! This is your confirmation code for FILMIK APP! ${confirmationCode}`,
                  html: `Hello, ${data.username}! This is your confirmation code for FILMIK APP! <h1>${confirmationCode}</h1>`
                });
                res.status(200).json('Mail sent');
              });
          });
      }
    });
};
