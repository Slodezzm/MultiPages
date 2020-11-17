
const { Sequelize, Model } = require('sequelize');
const { mysql } = require(`../config`);
const Logger = require("../logger.js");
const logger = new Logger("Mysql");

class MysqlModel extends Model {
  /**
   * 查询单条记录
   * @param {*} where 查询条件
   * @param {*} attributes 需要返回的字段
   * @param {*} include[] 如果存在联表操作可以传入
   * @param {*} include[].model Model 对象
   * @param {*} include[].attributes 需要返回的字段
   * @param {*} include[].where 查询条件
   */
  static async findOne2(where = null, attributes = null, include = null){
    return await this.findOne({
      raw: true,
      attributes,
      where,
      include
    })
  }
}

class Mysql extends Sequelize {
  constructor(...args) {
    super(...args)
  }
  
  define(modelName, attributes, options = {}) {
    options.modelName = modelName;
    options.sequelize = this;

    const model = class extends MysqlModel {};

    model.init(attributes, options);

    return model;
  }
}

const sequelize = new Mysql(mysql.db, mysql.username, mysql.password, {
  host: mysql.host,
  dialect: mysql.dialect,
  port: mysql.port,
  timezone: mysql.timezone,
  // eslint-disable-next-line no-console
  logging: process.env.NODE_ENV === 'develop' ? console.log : false,
  define: {
    timestamps: false
  },
  hooks: {
    beforeDefine(columns, model) {
      model.tableName = `${mysql.prefix}${model.modelName}`;
    }
  },
});

sequelize.authenticate()
  .then(() => logger.info('Mysql : Connection has been established successfully.', {
    data: {
      dialect: mysql.dialect
    }
  }))
  .catch((err) => logger.error(err));

module.exports = sequelize;