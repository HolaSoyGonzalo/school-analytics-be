const User = require("../db").User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const { authenticate, refreshToken } = require("../auth");
const router = require("express").Router();

router.route("/ping").get(async (req, res, next) => {
  console.log("Ping recieved");
  res.send("pong");
});

router.route("/register").post(async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(12);
    if (req.body.role === "student" && !req.body.classroomId) {
      res.status(400).send("A student must specify classroom");
    }
    const userRequest = await mapToRequest(req.body, salt);
    const newUser = await User.create({
      ...userRequest
    });
    res.send(mapToResponse(newUser));
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/login").post(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isMatch = user.validPassword(password);
      if (isMatch) {
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
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true, //set to true when deploy
          sameSite: "none", //set to none when deploy,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true, //set to true when deploy
          sameSite: "none", //set to none when deploy,
        });
        res.send(user);
      } else {
        res.status(401).send("Incorret Username or Password");
      }
    } else {
      res.status(401).send("Incorret Username or Password");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const singleUser = await User.findByPk(req.user.dataValues.id, {
      //   include: [
      //   ],
    });
    res.send(singleUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
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
      path: "/insta/users/refresh/token",
    });
    res.send("Tokens Regenrated!");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const mapToRequest = async (body, salt) => {
  return {
      firstname: body.firstname,
      lastname: body.lastname,
      birthday: body.birthday,
      gender: body.gender,
      email: body.email,
      role: body.role,
      password: await bcrypt.hash(body.password, salt),
      salt: salt,
      is_registered: true,
      registration_uuid: uuidv4()
  }
}

const mapToResponse = (user) => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    birthday: user.birthday,
    gender: user.gender,
    role: user.role,
    createdAt: user.createdAt,
  };
};

module.exports = router;
