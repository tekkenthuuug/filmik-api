import Knex from 'knex';
import { Request, Response } from 'express';

export const handleConfirm = (db: Knex) => (req: Request, res: Response) => {
  const { code } = req.body;
  console.log(code);
  // Varifying if client code matches with code from DB
  db.select('id')
    .from('users')
    .where('code', '=', code)
    .then(([data]) => {
      if (data.id) {
        db('login')
          .where('id', '=', data.id)
          .update({ verified: true })
          .returning('id')
          .then(([data]) => {
            res.status(200).send({ id: data });
          });
      } else {
        res.status(500).send({
          error: {
            details: 'Codes do not match!'
          }
        });
      }
    });
};
