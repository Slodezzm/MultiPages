// 客户环境

module.exports = {
  mysql: {
    host: 'a03-prod-web.mysql.rds.aliyuncs.com',
    username: 'wzzb',
    password: 'xHugqABePzTr4Df5',
    port: '3306',
    dialect: 'mysql',
    prefix: 'cmf_',
    db: 'livenew',
    timezone: '+08:00',
  },
  redis: {
    prefix: 'im',
    host: 'a03-prod-im.redis.rds.aliyuncs.com',
    port: '6379',
    expire: 60, // Unit:second,this item can set cache time of redis
    password: '',
  },
  remote: {
    host: 'https://intranet-api.zhibo16.live',
  },
};
