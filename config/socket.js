const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

server.listen(process.env.SOCKET_IO_PORT, () => {
  console.log(`Socket Server is running on Port ${process.env.SOCKET_IO_PORT}`);
});

module.exports = server;
