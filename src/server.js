const http = require('http');
const express = require('express');
const RED = require('node-red');
const path = require('path');

const app = express();

const server = http.createServer(app);

const settings = require(path.resolve(__dirname, "../.nodered/settings.js"));

app.use("/uploads", express.static(path.join(__dirname, "../.nodered/uploads")));

RED.init(server, settings);

app.use(settings.httpAdminRoot, RED.httpAdmin);

app.use(settings.httpNodeRoot, RED.httpNode);

const port = process.env.PORT || 1880;
server.listen(port);

RED.start().then(() => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Node-RED editor em http://localhost:${port}/red`);
});