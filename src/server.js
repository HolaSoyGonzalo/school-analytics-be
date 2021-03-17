const express = require("express");
const cors = require("cors");
const motherRouter = require("./routes/motherRouter");
const dotenv = require("dotenv");
dotenv.config();

const DB = require("./db/index");

const port = process.env.app_port || 4420;

const server = express();

const whitelist = ["http://localhost:3000", "http://localhost:4200"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS issues"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));

server.use(express.json());

server.use("/home", motherRouter);

DB.sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("The App is", port, "blazing it");
  });
});
