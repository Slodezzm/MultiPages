const gulp = require('gulp');
const fs = require('fs');

const deploy = 'deploy.js';
const target = 'ecosystem.config.js';
const encoding = 'utf8';
const config = fs.readFileSync(deploy, { encoding });

/**生成本地环境的 PM2 启动文件 */
for(let cmd of [ "local", "dev", "prod", "test", "grey" ]){ 
    gulp.task(cmd, async e => fs.writeFileSync(target, config.replace(/ENV_VALUE/g, cmd), { encoding })); 
}
