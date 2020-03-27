import { Request, Response } from 'express';
import Knex from 'knex';
import bcrypt from 'bcryptjs';
import Mail from 'nodemailer/lib/mailer';
import generateCode from '../util/generateCode';
import sendEmailWithCode from '../util/sendEmailWithCode';
import { RedisClient } from 'redis';
import setUserCode from '../util/setRedisUserCode';

/** Registers new user */
export const handleRegister = (db: Knex, transporter: Mail, redisClient: RedisClient) => (
  req: Request,
  res: Response
) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400);
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({ hash, username, email })
      .into('login')
      .returning('id')
      .then(async ([id]) => {
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
            setUserCode(redisClient, id, confirmationCode).then((isSet) => {
              if (isSet) {
                sendEmailWithCode(transporter, email, confirmationCode, username);
              }
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).send({
      error: {
        details: 'Username or email already exists'
      }
    });
  });
};
