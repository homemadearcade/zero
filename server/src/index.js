import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import https from 'https';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import http from 'http';
import { Server } from "socket.io"
import all_routes from 'express-list-endpoints';

import routes from './routes';
import { seedDb } from './utils/seed';

const app = express();

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/googleStrategy');
require('./services/localStrategy');

const isProduction = process.env.NODE_ENV === 'production';

// DB Config
const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

// Connect to Mongo
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
    // isProduction ? null : seedDb();
  })
  .catch((err) => console.log(err));

// Use Routes
app.use('/', routes);
app.use('/public', express.static(join(__dirname, '../public')));

let server;
let port;
// Serve static assets if in production
if (isProduction) {
  // Set static folder
  app.use(express.static(join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../..', 'client', 'build', 'index.html')); // index is in /server/src so 2 folders up
  });

  port = process.env.PORT || 80;

  server = http.Server(app)
} else {
  port = process.env.PORT || 5000;

  const httpsOptions = {
    key: readFileSync(resolve(__dirname, '../security/cert.key')),
    cert: readFileSync(resolve(__dirname, '../security/cert.pem')),
  };

  server = https.createServer(httpsOptions, app)
}

// Listen for requests
const io = new Server(server, { /* options */ });
io.on("connection", (socket) => {
  socket.on('login', (values) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return socket.emit('login_error', err)
      }
      if (!user) {
        return socket.emit('login_error', err)
      }

      socket.emit('login_success')
      socket.user = user
    })({body: values}, {})
  })

  socket.on("connect", () => {

  });
  
  socket.on("disconnect", () => {

  });
});
server.listen(port, () => console.log(`Server started on port ${port}`));

app.set('socketio', io);


// var io = req.app.get('socketio')