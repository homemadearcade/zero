import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import https from 'https';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import http from 'http';
import { Server } from "socket.io"
// import all_routes from 'express-list-endpoints';
import jsonwebtoken from 'jsonwebtoken';

import routes from './routes';
// import { seedDb } from './utils/seed';

import User from './models/User';
import { InMemorySessionStore } from './utils/sessionStore';

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

const socketSessions = new InMemorySessionStore()

app.set('socketio', io);
app.set('socketSessions', socketSessions);

const ON_LOBBY_UPDATE = 'ON_LOBBY_UPDATE'
const ON_LOBBY_MOUSE_UPDATE = 'ON_LOBBY_MOUSE_UPDATE'

const lobbys = [
  {
    participantEmail: 'email0@email.com',
    startTime: '8:00 PM',
    id: 'c5ee5f1e-fe16-4296-9f26-162e21e922eb',
    users: [],
    gameHostId: null,
    participantId: null,
    guideId: null
  }
];
app.set('lobbys', lobbys);

io.on("connection", (socket) => {  

  // this event is called after a user is logged in and also after a socket is reconnected
  socket.on('authenticate', async ({token}) => {
    if (token) {
      const isProduction = process.env.NODE_ENV === 'production';
      const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
  
      const decoded = jsonwebtoken.verify(token, secretOrKey)
      const email = decoded.email
      const user = await User.findOne({ email: email.trim() });
  
      if (user) {
        socket.user = {
          email: user.email,
          id: user.id,
          username: user.username,
        }

        const lobbys = app.get('lobbys')
        lobbys.forEach((lobby) => {
          lobby.users.forEach((user) => {
            if(user.id === socket.user.id) {
              user.connected = true
              socket.join(lobby.id);
              io.to(lobby.id).emit(ON_LOBBY_UPDATE, {lobby});
            }
          })
        })
  
        socket.emit('authenticate_success')
        socketSessions.saveSession(user.id, socket);
      } else {
        socket.emit('authenticate_fail', { error: 'no such user'})
      }
    } else {
      socket.emit('authenticate_fail', { error: 'no token for socket'})
    }
  })

  // this server will recieve mouse updates regularly, it will emit these updates to anyone who has registered cobrowsing for this user
  socket.on(ON_LOBBY_MOUSE_UPDATE, ({ cobrowsingMouse }) => {
    io.to('lobby://'+socket.user.id).emit(ON_LOBBY_MOUSE_UPDATE, { userId: socket.user.id, cobrowsingMouse })
  })

  socket.on("disconnect", async () => {
    if(socket.user?.id) {
      const lobbys = app.get('lobbys')
      lobbys.forEach((lobby) => {
        lobby.users.forEach((user) => {
          if(user.id === socket.user.id) {
            user.connected = false
            io.to(lobby.id).emit(ON_LOBBY_UPDATE, {lobby});
          }
        })
      })
    }
  });
});

server.listen(port, () => console.log(`Server started on port ${port}`));