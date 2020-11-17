const Redis = require('ioredis');
const  config = require('../config');
const Logger = require("../logger.js");
const logger = new Logger("Redis");
const client = new Redis(config.redis);
const subRedis = new Redis(config.redis);
const pubRedis = new Redis(config.redis);

if (config.redis.password) {
  client.auth(config.redis.password)
    .then(() => logger.logInfo('client auth successfully'))
    .catch(err => logger.error(err));
  subRedis.auth(config.redis.password)
    .then(() => logger.logInfo('subRedis auth successfully'))
    .catch(err => logger.error(err));
  pubRedis.auth(config.redis.password)
    .then(() => logger.logInfo('pubRedis auth successfully'))
    .catch(err => logger.error(err));
}

module.exports = {
    client,
    subRedis, 
    pubRedis
};

/**123456 */
client.asd = e => {}