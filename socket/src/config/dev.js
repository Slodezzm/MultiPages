// 开发环境

module.exports = {
  mysql: {
    host: 'a05-dev-web.mysql.singapore.rds.aliyuncs.com',
    username: 'live',
    password: 'wi9A1e4hJvfBopUm',
    db: 'live',
    prefix: 'cmf_',
    port: '3306',
    dialect: 'mysql',
    timezone: '+08:00',
  },
  redis: {
    prefix: 'im',
    host: 'a05-dev-im.redis.singapore.rds.aliyuncs.com',
    port: '6379',
  },
  jumpUrl: "https://a05-dev-www.we-pj.com/",
};
