const jwt = require("jsonwebtoken");
const UsersFacade = require("../db/transactionalUsersFacade").Facade;
const Exam = require("../db").Exam;

const { authenticate, refreshToken } = require("../auth");
const router = require("express").Router();

router.route("/ping").get(async (req, res, next) => {
  console.log("Ping recieved");
  res.send("pong");
});

router.route("/login").post(async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.status(400).send("Missing email");
    }
    if (!req.body.password) {
      res.status(400).send("Missing password");
    }
    const user = await UsersFacade.login(req.body.email, req.body.password);
    const accessToken = await jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.jwt_key,
      { expiresIn: "30m" }
    );
    const refreshToken = await jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.jwt_refresh_key,
      { expiresIn: "1w" }
    );
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    res.send(user);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.get("/register/student/:token/", async (req, res) => {
  try {
    res.status(200).send(await UsersFacade.getStudentByToken(req.params.token));
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.post("/register/student/:token/", async (req, res) => {
  try {
    let registeredStudent = await UsersFacade.registerStudentWithToken(
      req.body,
      req.params.token
    );
    res.status(201).send(registeredStudent);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});
router.get("/exams", authenticate, async (req, res, next) => {
  try {
    const allExams = await Exam.findAll({
      where: {
        studentId: req.user.dataValues.id,
      },
    });
    res.send(
      allExams.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      })
    );
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    }
    res.status(500).send(error.message);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const singleUser = await UsersFacade.findByPk(req.user.dataValues.id);
    res.send(singleUser);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    }
    res.status(500).send(error.message);
  }
});

router.route("/refresh/token").post(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const newTokens = await refreshToken(refreshToken);
    console.log(newTokens);
    res.cookie("accessToken", newTokens.accessToken, {
      httpOnly: true,
    });
    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      path: "/home/user/refresh/token",
    });
    res.send("Tokens Regenrated!");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
