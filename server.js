require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
mongoose.Promise = global.Promise;

const studentsRouter = require('./routers/students.router');
const usersRouter = require('./routers/users.router');
const authRouter = require('./routers/auth.router');
const workshopsRouter = require('./routers/workshops.router');
const { CLIENT_ORIGIN, PORT, DATABASE_URL } = require('./config');
const { localStrategy, jwtStrategy } = require('./strategies');

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(bodyParser.json());

app.options('*', cors());
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/workshops', workshopsRouter);

app.get('/api/*', (req, res) => {
  res.json({ ok: true });
});

let server;
function runServer(databaseUrl, port = PORT) {
  return mongoose.connect(databaseUrl)
    .then(() => {
      server = app.listen(port, () => console.log(`listening on port ${port}`));
      // server.on('error', err => throw Error());
    })
    .catch((err) => {
      mongoose.disconnect();
      console.log(err);
      return err;
    });
}

function closeServer() {
  return mongoose.disconnect()
    .then(() => server.close())
    .catch((err) => {
      console.error(err);
      return err;
    });
}

if (require.main === module) {
  runServer(DATABASE_URL);
}


module.exports = { runServer, app, closeServer };
