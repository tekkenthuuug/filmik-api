import { RedisClient } from 'redis';

const setUserCode = (redisClient: RedisClient, id: any, confirmationCode: string) => {
  return new Promise<boolean>((resolve, reject) => {
    redisClient.set(id, confirmationCode, (err, replay) => {
      if (!err && replay) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export default setUserCode;
