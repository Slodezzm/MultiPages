// 测试环境

module.exports = {
  mysql: {
    host: 'a03-test-web.mysql.rds.aliyuncs.com',
    username: 'livenew',
    password: 'ncdCv6i9fsBeC5vR',
    port: '3306',
    dialect: 'mysql',
    prefix: 'cmf_',
    db: 'livenew',
  },
  redis: {
    host: 'a03-test-im.redis.rds.aliyuncs.com',
    port: '6379',
    expire: 60, // Unit:second,this item can set cache time of redis
    password: ''
  },
  remote: {
    host: 'https://a03-test-web.we-pj.com',
  },
  jumpUrl: "https://a03-test-web.we-pj.com",
};

