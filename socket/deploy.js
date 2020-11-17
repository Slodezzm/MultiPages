module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   * 多个服务，依次放到apps对应的数组里
   */
  apps: [
    // First application
    {
      name: "IM1-page",
      max_memory_restart: "1806M", // 1.5G
      script: "./app.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "ENV_VALUE",
        NODE_PORT: 9080
      }
    }
    // ,
    
    // {
    //   name: "IM1-page",
    //   max_memory_restart: "1806M", // 1.5G
    //   script: "./app.js",
    //   instances: 1,
    //   exec_mode: "cluster",
    //   env: {
    //     NODE_ENV: "ENV_VALUE",
    //     NODE_PORT: 9081
    //   }
    // },
    
    // {
    //   name: "IM1-page",
    //   max_memory_restart: "1806M", // 1.5G
    //   script: "./app.js",
    //   instances: 1,
    //   exec_mode: "cluster",
    //   env: {
    //     NODE_ENV: "ENV_VALUE",
    //     NODE_PORT: 9082
    //   }
    // },
    
    // {
    //   name: "IM1-page",
    //   max_memory_restart: "1806M", // 1.5G
    //   script: "./app.js",
    //   instances: 1,
    //   exec_mode: "cluster",
    //   env: {
    //     NODE_ENV: "ENV_VALUE",
    //     NODE_PORT: 9083
    //   }
    // }
  ]
};