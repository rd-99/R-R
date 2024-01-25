module.exports = {
  apps : [{
    name: "R&R FRONTEND UI - v1.0.0",
    script: "deploy/index.js",

    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
