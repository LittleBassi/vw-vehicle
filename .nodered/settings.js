const path = require("path");
const fs = require("fs");
require("dotenv").config();

const baseDir = __dirname;

module.exports = {
    flowFile: path.join(baseDir, "flows.json"),
    userDir: baseDir,
    httpAdminRoot: "/red",
    httpNodeRoot: "/api",
    functionGlobalContext: {
        fs: fs,
        path: path,
        uploadsDir: path.resolve(__dirname, "uploads"),
        jwt: require("jsonwebtoken"),
        jwtSecret: process.env.JWT_SECRET || "vw-secret",
        bcrypt: require("bcryptjs"),
        uuidv4: require("uuid").v4,
        BASE_URL: process.env.BASE_URL || "http://localhost:1880"
    },
    contextStorage: {
        default: {
            module: "localfilesystem",
        },
    },
    logging: { console: { level: "debug" } },
};
