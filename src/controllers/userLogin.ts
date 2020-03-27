import Knex from 'knex';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import generateCode from '../util/generateCode';
import sendEmailWithCode from '../util/sendEmailWithCode';
import setRedisUserCode from '../util/setRedisUserCode';

import Mail from 'nodemailer/lib/mailer';
import { Request, Response } from 'express';
import { RedisClient } from 'redis';

/** Handles request with a confirmation code, verifyes account */
export const handleLogin = (db: Knex, transporter: Mail, redisClient: RedisClient) => (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400);
  }

  // Getting user from DB
  db.select('*')
    .from('login')
    .where({ username: login })
    .orWhere({ email: login })
    .then(([data]) => {
      // In case there is no user with such username or email
      if (!data) {
        return res.status(400).send({
          error: {
            details: 'Bad credentials'
          }
        });
      }

      const { username, id, verified, hash, email } = data;
      const isValid = bcrypt.compareSync(password, hash);

      // If password from client and DB do not match
      if (!isValid) {
        return res.status(400).send({
          error: {
            details: 'Bad credentials'
          }
        });
      }

      const token = jwt.sign({ id: id }, process.env.JWT_SECRET || 'exists', {
        expiresIn: '12h'
      });

      if (!verified) {
        res.status(200).send({
          id,
          email,
          username
        });
        const confirmationCode = generateCode(6);
        setRedisUserCode(redisClient, id, confirmationCode).then((isUpdated) => {
          if (isUpdated) {
            sendEmailWithCode(transporter, email, confirmationCode, username);
          }
        });
        return;
      }

      redisClient.set(token, id, (err, reply) => {
        // In case there is an error setting token
        if (err && !reply) {
          return res.status(500).send({
            error: {
              details: 'Unable to login'
            }
          });
        }

        res.status(200).send({
          id,
          username,
          token
        });
      });
    });
};
