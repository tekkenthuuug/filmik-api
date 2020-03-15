import { Request, Response } from 'express';

/** Registers new user */
export const register = (req: Request, res: Response) => {
  console.log(req.body);
};
