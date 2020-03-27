import { Response, Request } from 'express';
import redisClient from '../redis';

const requireAuth = (req: Request, res: Response, next: (err?: any) => void) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    return next();
  });
};

export default requireAuth;
