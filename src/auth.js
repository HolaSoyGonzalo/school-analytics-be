const jwt = require("jsonwebtoken");
const UserDB = require("./db").User;

const authenticate = async (req, res, next) => {
  console.log(req.headers);
  const accessToken = req.headers.authorization.split(" ")[1];

  if (accessToken) {
    jwt.verify(accessToken, process.env.jwt_key, async (err, decodedToken) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log("user", decodedToken);
        const user = await UserDB.findByPk(decodedToken.id);
        console.log(user);
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};

const verifyRefresh = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.jwt_refresh_key, (err, decodedToken) => {
      if (err) rej(err);
      res(decodedToken);
    })
  );

const refreshToken = async (oldToken) => {
  const decodedToken = await verifyRefresh(oldToken);

  const accessToken = await jwt.sign(
    { id: decodedToken.id },
    process.env.jwt_key,
    { expiresIn: "15m" }
  );
  const refreshToken = await jwt.sign(
    { id: decodedToken.id },
    process.env.jwt_refresh_key,
    { expiresIn: "1w" }
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user.dataValues.role === "admin") next();
  else {
    const err = new Error("Only for admins!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authenticate, refreshToken, adminOnlyMiddleware };
