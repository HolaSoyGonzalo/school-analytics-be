//HERE WE HAVE ALL THE ROUTES
const express = require("express");
const motherRouter = express.Router();

//Routes
const userRoute = require("./user");
const adminRoute = require("./admin");

motherRouter.use("/user", userRoute);
motherRouter.use("/admin", adminRoute);

module.exports = motherRouter;
