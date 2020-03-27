import Knex from 'knex';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Mail from 'nodemailer/lib/mailer';
import generateCode from '../util/generateCode';
import sendEmailWithCode from '../util/sendEmailWithCode';
import setRedisUserCode from '../util/setRedisUserCode';
import { RedisClient } from 'redis';

/** Handles request with a confirmation code, verifyes account */
export const handleLogin = (db: Knex, transporter: Mail, redisClient: RedisClient) => (req: Request, res: Response) => {
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
          setRedisUserCode(redisClient, id, confirmationCode).then((isUpdated) => {
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
