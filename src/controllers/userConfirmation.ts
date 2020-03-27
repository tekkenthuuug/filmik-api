import Knex from 'knex';
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
    console.log(repl);
    if (!repl) {
      return res.status(200).send({
        errors: {
          details: 'User already verified'
        }
      });
    }

    if (repl !== clientCode) {
      return res.status(200).send({
        errors: {
          details: 'Codes do not match'
        }
      });
    }

    setUserVerified(db, redisClient, userID).then((data) => {
      if (data.id) {
        return res.status(200).send(data);
      }
    });
  });
};
