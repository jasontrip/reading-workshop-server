const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('./models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  const loginError = {
    reason: 'LoginError',
    username: 'Incorrect username or password',
  };
  User.findOne({ username }).populate({path: 'workshops.students'}).exec()
    .then((_user) => {
      console.log(_user.workshops[0].students);
      user = _user;
      if (!user) {
        throw loginError;
      }
      return user.validatePassword(password);
    })
    .then((isValid) => {
      if (!isValid) {
        throw loginError;
      }
      return done(null, user.serialize());
    })
    .catch((err) => {
      if (err.reason === 'LoginError') {
        return done(null, false, err);
      }
      return done(err, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256'],
  },
  (payload, done) => {
    done(null, payload.user);
  },
);

module.exports = { localStrategy, jwtStrategy };
