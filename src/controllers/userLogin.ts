import Knex from 'knex';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Mail from 'nodemailer/lib/mailer';
import generateCode from '../util/generateCode';

/** Handles request with a confirmation code, verifyes account */
export const handleLogin = (db: Knex, transporter: Mail) => (req: Request, res: Response) => {
  const { login, password } = req.body;
  db.select('*')
    .from('login')
    .where({ username: login })
    .orWhere({ email: login })
    .then(([data]) => {
      const { username, id, verified, hash, email } = data;
      if (!data) {
        res.status(200).send({
          error: {
            details: 'Bad credentials'
          }
        });
        return;
      }
      if (bcrypt.compareSync(password, hash)) {
        res.status(200).send({
          id,
          username,
          email,
          verified
        });
        if (!verified) {
          const confirmationCode = generateCode(6);
          db('codes')
            .update({
              code: confirmationCode
            })
            .where({ email })
            .then(async () => {
              await transporter.sendMail({
                from: '"FILMIK APP" <filmikWeAre@gmail.com>',
                to: email,
                subject: 'Confirmation code',
                text: `Hello, ${username}! This is your confirmation code for FILMIK APP! ${confirmationCode}`,
                html: `Hello, ${username}! This is your confirmation code for FILMIK APP! <h1>${confirmationCode}</h1>`
              });
            });
        }
      } else {
        res.status(200).send({
          error: {
            details: 'Bad credentials'
          }
        });
      }
    });
};
