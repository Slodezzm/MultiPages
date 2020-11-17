

const _ = require('lodash');
const local = require("./default.js")
const dev = require("./dev.js")
const prod = require("./prod.js")
const test = require("./test.js")
const grey = require("./grey.js")
const Logger = require('../logger');
const logger = new Logger("Config");
const config = _.merge(local, { local, dev, prod, test, grey }[process.env.NODE_ENV] || {});

logger.logInfo('load', { data: { config } });

module.exports = config;