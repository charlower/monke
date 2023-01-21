const dbo = require('./db/conn');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const usePassport = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const dbConnect = dbo.getDb();
      dbConnect
        .collection('users')
        .findOne({ walletAddress: jwt_payload.address })
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};

module.exports = usePassport;
