module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm",
      args: "run preview",
      cwd: "./",
      watch: false,
      autorestart: true,
    },
    {
      name: "backend",
      script: "node",
      args: "backend/server.js",
      cwd: "./",
      watch: true,
      autorestart: true,
      env: {
        PORT: 8001,
      },
    },
  ],
};
