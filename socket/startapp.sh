#!/bin/bash -xeu


declare -A map=(
    ["local"]="本地" 
    ["dev"]="开发" 
    ["prod"]="客户" 
    ["test"]="测试" 
    ["grey"]="灰度测试"
)

if [ "${map[$1]}" == "" ] 
then
    echo "未存在【$1】环境应用"
    echo '
    目前的环境配置是：

    ["local"]="本地" 
    ["dev"]="开发" 
    ["prod"]="客户" 
    ["test"]="测试" 
    ["grey"]="灰度测试"
'
else
    echo "开始启动${map[$1]}环境应用"
    pm2 kill && sleep 1 && npm i && npx gulp $1 && NODE_LOG_DIR=./log ENABLE_NODE_LOG=YES pm2 startOrReload ecosystem.config.js --update-env
    echo "启动完毕！。。。"
fi
