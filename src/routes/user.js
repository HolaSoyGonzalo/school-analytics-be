const User = require("../db").User;
const jwt = require("jsonwebtoken");

const { authenticate, refreshToken } = require("../auth");
const router = require("express").Router();

router.route("/register").post(async (req, res, next) => {
  try {
    const newUser = await User.create({
      ...req.body,
    });
    res.send(newUser);
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
          { id: user.id },
          process.env.JWT_KEY,
          { expiresIn: "30m" }
        );
        const refreshToken = await jwt.sign(
          { id: user.id },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "1w" }
        );
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
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

router.get("/", authenticate, async (req, res) => {
  try {
    const allUser = await User.findAll({
      //   include: [
      //   ],
    });
    res.send(allUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.dataValues.id.toString() === req.params.id) {
      const singleUser = await User.findByPk(req.params.id, {
        //   include: [
        //   ],
      });
      res.send(singleUser);
    } else {
      const singleUser = await User.findByPk(req.params.id, {
        //   include: [
        //   ],
      });
      if (singleUser) {
        res.send(singleUser);
      } else {
        res.status(404).send("User not found within database");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.dataValues.id.toString() === req.params.id) {
      const alteredUser = await User.update(req.body, {
        where: { id: req.params.id },
        //   include: [
        //   ],
        returning: true,
      });
      res.send(alteredUser);
    } else {
      res.status(401).send("Unauthorized: This is not your account!");
    }
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

module.exports = router;
