// 灰度测试环境

module.exports = {
  mysql: {
    host: 'a03-pre-web.mysql.rds.aliyuncs.com',
    username: 'liveread',
    password: 'sRk9LT0TTBIIWON2',
    port: '3306',
    dialect: 'mysql',
    prefix: 'cmf_',
    db: 'livenew',
    timezone: '+08:00',
  },
  
  redis: {
    prefix: 'im',
    host: 'a03-pre-im.redis.rds.aliyuncs.com',
    port: '6379',
    expire: 60, // Unit:second,this item can set cache time of redis
    password: '',
  },
  remote: {
    host: 'https://a02-pre-web.we-pj.com',
  },
  jumpUrl: "https://a02-pre-www.we-pj.com/",
};
