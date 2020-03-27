import redis from 'redis';

const redisClient = redis.createClient(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);

export default redisClient;
