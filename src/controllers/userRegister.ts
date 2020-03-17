import { Request, Response } from 'express';
import Knex from 'knex';
import bcrypt from 'bcryptjs';

/** Registers new user */
export const handleRegister = (db: Knex) => async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    res.sendStatus(500);
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({ hash, username, verified: false })
      .into('login')
      .returning('id')
      .then((id) => {
        return trx('users')
          .returning('*')
          .insert({
            username,
            email,
            joined: new Date()
          })
          .then((data) => {
            res.status(200).send({
              id: id[0]
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).send({
      error: {
        details: 'Username is taken'
      }
    });
  });
};
