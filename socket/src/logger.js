const moment = require('moment');
const _ = require('lodash');


/**
 * 日志对象
 */
module.exports = class Loggin {
  constructor(CLASS_NAME = null) {
    /**类名称 */
    this.CLASS_NAME = CLASS_NAME || "Loggin";
  }

  log(level, name, args) {
    if ("Info" == level)
      console.log(`[Info][${moment().format('YYYY-MM-DD HH:mm:ss SSS')}][${this.CLASS_NAME}][${name}]`, JSON.stringify(args))
    else if(args instanceof Error) {
      console.error(`[Error][${moment().format('YYYY-MM-DD HH:mm:ss SSS')}][${this.CLASS_NAME}][${name}]`, args.message, args.stack)
    }
    else if(level instanceof Error){
      console.error(`[Error][${moment().format('YYYY-MM-DD HH:mm:ss SSS')}][${this.CLASS_NAME}][Error]`, level.message, level.stack)
    }
  }

  logInfo(name, ...args) {
    this.log("Info", name, args)
    // logger.info(`[${this.CLASS_NAME}][${name}]`, { data: args });
  }

  logError(name, ...args) {
    this.log("Error", name, args[0])
    // logger.error(`[${this.CLASS_NAME}][${name}]`, { data: args })
  }

  static logInfo(className, name, ...args) {
    console.log(`[Info][${moment().format('YYYY-MM-DD HH:mm:ss SSS')}][${className}][${name}]`, JSON.stringify(args))
    // logger.info(`[${className}][${name}]`, { data: args });
  }

  info(...args) {
    console.log(`[Info][${moment().format('YYYY-MM-DD HH:mm:ss SSS')}][${this.CLASS_NAME}][Info]`, JSON.stringify(args))
  }

  error(...args) {
    console.error(`[Error][${moment().format('YYYY-MM-DD HH:mm:ss SSS')}][${this.CLASS_NAME}][Error]`, JSON.stringify(args))
  }
}