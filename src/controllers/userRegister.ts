import { Request, Response } from 'express';
import Knex from 'knex';
import bcrypt from 'bcryptjs';
import Mail from 'nodemailer/lib/mailer';
import generateCode from '../util/generateCode';

/** Registers new user */
export const handleRegister = (db: Knex, transporter: Mail) => (req: Request, res: Response): void => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.sendStatus(500);
    return;
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({ hash, username, email })
      .into('login')
      .returning('id')
      .then(([id]) => {
        return trx('users')
          .returning('id')
          .insert({
            id,
            username,
            email,
            joined: new Date()
          })
          .then(([data]) => {
            res.status(200).send({ id: data });
            const confirmationCode = generateCode(6);
            db.insert({
              id,
              email,
              code: confirmationCode
            })
              .into('codes')
              .then(async () => {
                await transporter.sendMail({
                  from: '"FILMIK APP" <filmikWeAre@gmail.com>',
                  to: email,
                  subject: 'Confirmation code',
                  text: `Hello, ${username}! This is your confirmation code for FILMIK APP! ${confirmationCode}`,
                  html: `Hello, ${username}! This is your confirmation code for FILMIK APP! <h1>${confirmationCode}</h1>`
                });
              });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    // @todo recognize type of error (username or email?)
    res.status(400).send({
      error: {
        details: 'Username is taken'
      }
    });
  });
};
