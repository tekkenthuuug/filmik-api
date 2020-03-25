import Knex from 'knex';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Mail from 'nodemailer/lib/mailer';
import generateCode from '../util/generateCode';
import sendEmailWithCode from '../util/sendEmailWithCode';

const updateUserCode = (db: Knex, confirmationCode: string, email: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    return db('codes')
      .update({
        code: confirmationCode
      })
      .where({ email })
      .then(async () => {
        resolve(true);
      })
      .catch(() => resolve(false));
  });
};

/** Handles request with a confirmation code, verifyes account */
export const handleLogin = (db: Knex, transporter: Mail) => (req: Request, res: Response) => {
  const { login, password } = req.body;
  db.select('*')
    .from('login')
    .where({ username: login })
    .orWhere({ email: login })
    .then(([data]) => {
      if (!data) {
        return res.status(400).send({
          error: {
            details: 'Bad credentials'
          }
        });
      }

      const { username, id, verified, hash, email } = data;
      const isValid = bcrypt.compareSync(password, hash);

      if (isValid) {
        res.status(200).send({
          id,
          username,
          email,
          verified
        });

        if (!verified) {
          const confirmationCode = generateCode(6);
          updateUserCode(db, confirmationCode, email).then((isUpdated) => {
            if (isUpdated) {
              sendEmailWithCode(transporter, email, confirmationCode, username);
            }
          });
        }
      } else {
        res.status(400).send({
          error: {
            details: 'Bad credentials'
          }
        });
      }
    });
};
