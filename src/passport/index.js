const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const UserSchema = require("../db/users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      return UserSchema.findOne({ where: { email } })
        .then(async (user) => {
          if (!user || !user.validPassword(password)) {
            return cb(null, false, { message: "incorrect email or password" });
          } else {
            return cb(null, user, { message: "Log In Success" });
          }
        })
        .catch((err) => cb(err));
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: function (req) {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies["accessToken"];
        }
        return token;
      },
      secretOrKey: process.env.JWT_KEY,
    },
    async function (jwtPayload, cb) {
      console.log("jwtPayload", jwtPayload);
      const expirationDate = new Date(jwtPayload.exp * 1000);

      const user = await UserSchema.findOne({ where: { _id: jwtPayload._id } });
      if (user) {
        return cb(null, user.dataValues);
      } else {
        return cb(null, false, { message: "unauthorized" });
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = passport;
