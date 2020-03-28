import Knex from 'knex';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { RedisClient } from 'redis';

const setUserVerified = (db: Knex, redisClient: RedisClient, userID: number) => {
  return new Promise<{ id: number }>((resolve, reject) => {
    db('login')
      .update({ verified: true })
      .where({ id: userID })
      .then(() => {
        redisClient.del(String(userID));
        resolve({
          id: userID
        });
      });
  });
};

/** Handles request with a confirmation code, verifyes account */
export const handleConfirm = (db: Knex, redisClient: RedisClient) => (req: Request, res: Response) => {
  const { userID, code: clientCode } = req.body;
  redisClient.get(userID, (err, repl) => {
    if (!repl) {
      return res.status(200).send({
        error: {
          details: 'User already verified'
        }
      });
    }

    if (repl !== clientCode) {
      return res.status(200).send({
        error: {
          details: 'Codes do not match'
        }
      });
    }

    setUserVerified(db, redisClient, userID).then((data) => {
      if (data.id) {
        const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET || 'exists', {
          expiresIn: '12h'
        });

        redisClient.set(String(data.id), token, (err, reply) => {
          if (err || !reply) {
            return res.status(500).send({
              error: {
                details: 'Unable to get token'
              }
            });
          }
          res.status(200).send({ id: data.id, token });
        });
      }
    });
  });
};
