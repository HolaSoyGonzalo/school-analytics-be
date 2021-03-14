//HERE WE HAVE ALL THE ROUTES
const express = require("express");
const { authenticate } = require("../auth");

//Routes
const motherRouter = express.Router();
const userRoute = require("./user");

motherRouter.use("/user", userRoute);

module.exports = motherRouter;
