import Knex from 'knex';
import { Request, Response } from 'express';

const setUserVerified = (db: Knex, userID: number) => {
  return new Promise<{ id: number }>((resolve, reject) => {
    db('login')
      .update({ verified: true })
      .where({ id: userID })
      .then(() => {
        db('codes')
          .where({ id: userID })
          .del();
        resolve({
          id: userID
        });
      });
  });
};

/** Handles request with a confirmation code, verifyes account */
export const handleConfirm = (db: Knex) => (req: Request, res: Response) => {
  const { userID, code: clientCode } = req.body;
  db.select('*')
    .from('codes')
    .where({ id: userID })
    .then(([data]) => {
      if (!data.code) {
        return res.status(200).send({
          errors: {
            details: 'User already verified'
          }
        });
      }

      if (data.code !== clientCode) {
        return res.status(200).send({
          errors: {
            details: 'Codes do not match'
          }
        });
      }

      setUserVerified(db, userID).then((data) => {
        if (data.id) {
          return res.status(200).send(data);
        }
      });
    });
};
