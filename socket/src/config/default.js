module.exports = {
  mysql: {
    // host: '10.9.16.21',
    // username: 'livenew',
    // password: '123456',
    // port: '3306',
    // dialect: 'mysql',
    // prefix: 'cmf_',
    // db: 'livenew',
    // timezone: '+08:00',
    host: 'a03-dev-web.mysql.singapore.rds.aliyuncs.com',
    username: 'live',
    password: 'wi9A1e4hJvfBopUm',
    port: '3306',
    dialect: 'mysql',
    prefix: 'cmf_',
    db: 'live',
    timezone: '+08:00',
  },
  redis: {
    prefix: 'im',
    // host: 'a03-dev-im.redis.singapore.rds.aliyuncs.com',
    host:"a03-dev-im.redis.rds.aliyuncs.com",
    port: '6379',
    // password: 'ITCmO1ToWiZrS1WJ',
    expire: 60, // Unit:second,this item can set cache time of redis
  },
  socket: {
    binary: false,
  },
  xor_encrypt_key:"summer1u98fn4uivdbuiyd923buibkbucisaa",
  //5Zac77205om85ZGh5oWq5Lu0
};


