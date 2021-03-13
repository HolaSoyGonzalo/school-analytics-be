const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const motherRouter = require("./routes");

dotenv.config();

const DB = require("./db");

const port = process.env.PORT || 4420;

const server = express();

const whitelist = ["http://localhost:3000", "http://localhost:4420"];

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

server.use("/potd", mainRouter);

database.sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("The App is ", port, "blazing it");
  });
});
