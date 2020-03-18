import Knex from 'knex';
import { Request, Response } from 'express';

/** Handles request with a confirmation code, verifyes account */
export const handleConfirm = (db: Knex) => (req: Request, res: Response) => {
  const { userID, code: clientCode } = req.body;
  db.select('*')
    .from('codes')
    .where('id', '=', userID)
    .then(([data]) => {
      if (!data.code) {
        res.status(200).send({
          errors: {
            details: 'User already verified'
          }
        });
      }
      if (data.code === clientCode) {
        db('login')
          .update({ verified: true })
          .where('id', '=', userID)
          .then(() => {
            db('codes')
              .where({ id: userID })
              .del()
              .then(() => {
                res.status(200).send({
                  id: userID
                });
              });
          });
      } else {
        res.status(200).send({
          errors: {
            details: 'Codes do not match'
          }
        });
      }
    });
};
