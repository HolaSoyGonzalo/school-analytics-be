const express = require("express");
const cors = require("cors");
const motherRouter = require("./routes/motherRouter");
const dotenv = require("dotenv");
const populateAdmin = require("./db/adminPopulationScript");

dotenv.config();

const DB = require("./db/index");

const port = process.env.PORT || 5000;

const server = express();

const whitelist = [
  "http://localhost:3000",
  "https://school-o-fe.vercel.app",
  "https://school-o-fe-git-master-holasoygonzalo.vercel.app",
  "https://school-o-fe-holasoygonzalo.vercel.app",
  "https://school-o-fe-myvfv1cok-holasoygonzalo.vercel.app",
];

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

DB.dbConnection
  .sync({ force: false })
  .then(() => {
    populateAdmin(process.env.users || "[]").catch((error) => {
      console.log(error);
      process.exit(1);
    });
  })
  .then(() => {
    server.listen(port, () => {
      console.log("The App is", port, "blazing it");
    });
  });
