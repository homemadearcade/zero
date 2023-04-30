import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import https from 'https';
import { readFileSync, writeFile } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import http from 'http';
import morgan from 'morgan'
import { Server } from "socket.io"
// import all_routes from 'express-list-endpoints';

import routes from './routes';

import { InMemorySessionStore } from './utils/sessionStore';
import { ON_COBROWSING_STATUS_UPDATE, 
  ON_GAME_INSTANCE_UPDATE, ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE,
   ON_GAME_INSTANCE_EVENT, ON_GAME_CHARACTER_UPDATE,
    ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_CODRAWING_STROKE_ACKNOWLEDGED, 
    ON_CODRAWING_INITIALIZE, SOCKET_IO_STORE, 
    SOCKET_SESSIONS_STORE, LOBBY_INSTANCE_STORE, CODRAWING_ROOM_PREFIX, 
    GAME_ROOMS_STORE, ON_GAME_ROOM_INSTANCE_MEMBER_STATUS_UPDATE, 
    ON_LOBBY_INSTANCE_EVENT } from './constants';
import { onSocketAuthenticate, onSocketDisconnect } from './socket';
import { onMongoDBConnected } from './onMongoDBConnected';

const app = express();

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('combined'))

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
  .then(async () => {
    console.log('MongoDB Connected...');
    try {
      onMongoDBConnected(app)
    } catch(e) {
      console.log(e) 
      process.exit()
    } 
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

    const rawHtml = resolve(__dirname, '../..', 'client', 'build', 'index.html')

    res.sendFile(rawHtml); // index is in /server/src so 2 folders up
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

app.set(SOCKET_IO_STORE, io);
app.set(SOCKET_SESSIONS_STORE, socketSessions);

server.listen(port, () => console.log(`Server started on port ${port}`));

io.on("connection", (socket) => {  
  console.log('socket connected: ' + socket.id)
  // this event is called after a user is logged in and also after a socket is reconnected
  socket.on('authenticate', onSocketAuthenticate(io, socket, app))

  socket.on(ON_COBROWSING_STATUS_UPDATE, (payload) => {
    io.to('cobrowsing@'+payload.userMongoId).emit(ON_COBROWSING_STATUS_UPDATE, payload)
  })

  socket.on(ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE, (payload) => {
    io.to(payload.lobbyInstanceMongoId).emit(ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE, payload)
  })

  socket.on(ON_LOBBY_INSTANCE_EVENT, (payload) => {
    if(payload.hostOnly) {
      const lobbyInstances = app.get(LOBBY_INSTANCE_STORE)
      const lobbyInstanceFound = lobbyInstances?.filter((lobbyInstance, i) => {
        return lobbyInstance.id.toString() === payload.lobbyInstanceMongoId
      })[0]
      if(lobbyInstanceFound) {
        const hostSocket = socketSessions.findSession(lobbyInstanceFound.hostUserMongoId);
        if(!hostSocket) return console.log('host socket not found')
        hostSocket.emit(ON_LOBBY_INSTANCE_EVENT, payload)
      }
      return
    }
    io.to(payload.lobbyInstanceMongoId).emit(ON_LOBBY_INSTANCE_EVENT, payload)
  })

  socket.on(ON_GAME_ROOM_INSTANCE_MEMBER_STATUS_UPDATE, (payload) => {
    io.to(payload.gameRoomInstanceMongoId).emit(ON_GAME_ROOM_INSTANCE_MEMBER_STATUS_UPDATE, payload)
  })

  socket.on(ON_GAME_INSTANCE_EVENT, (payload) => {
    if(payload.hostOnly) {
      const gameRoomInstances = app.get(GAME_ROOMS_STORE)
      
      const gameRoomInstanceFound = gameRoomInstances?.filter((gameRoomInstance, i) => {
        return gameRoomInstance.id.toString() === payload.gameRoomInstanceMongoId
      })[0]
      if(gameRoomInstanceFound) {
        const hostSocket = socketSessions.findSession(gameRoomInstanceFound.hostUserMongoId);
        if(!hostSocket) return console.log('host socket not found')
        hostSocket.emit(ON_GAME_INSTANCE_EVENT, payload)
      }
      return
    }

    io.to(payload.gameRoomInstanceMongoId).emit(ON_GAME_INSTANCE_EVENT, payload)
  })

  let upsServer = {}
  let lastUpsServerCounts = {}
  let upsServerUpdates = {}

  socket.on(ON_GAME_INSTANCE_UPDATE, (payload) => {

    const gameRoomInstanceMongoId = payload.gameRoomInstanceMongoId
    const time = Date.now();
    
    if(!lastUpsServerCounts[gameRoomInstanceMongoId]) lastUpsServerCounts[gameRoomInstanceMongoId] = 0
    if(!upsServerUpdates[gameRoomInstanceMongoId]) upsServerUpdates[gameRoomInstanceMongoId] = 0

    upsServerUpdates[gameRoomInstanceMongoId]++;

    if (time > lastUpsServerCounts[gameRoomInstanceMongoId] + 1000) {
      upsServer[gameRoomInstanceMongoId] = Math.round( ( upsServerUpdates[gameRoomInstanceMongoId] * 1000 ) / ( time - lastUpsServerCounts[gameRoomInstanceMongoId] ) );
      lastUpsServerCounts[gameRoomInstanceMongoId] = time;
      upsServerUpdates[gameRoomInstanceMongoId] = 0;
    }

    payload.upsServer = upsServer[gameRoomInstanceMongoId]
      
    io.to(payload.gameRoomInstanceMongoId).emit(ON_GAME_INSTANCE_UPDATE, payload)
  })

  socket.on(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, (payload) => {
    payload.upsServer = upsServer[payload.gameRoomInstanceMongoId]

    io.to(payload.gameRoomInstanceMongoId).emit(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, payload)
  })

  socket.on(ON_GAME_CHARACTER_UPDATE, (payload) => {
    io.to(payload.gameRoomInstanceMongoId).emit(ON_GAME_CHARACTER_UPDATE, payload)
  })

  socket.on(ON_CODRAWING_STROKE_ACKNOWLEDGED, (payload) => {
    io.to(CODRAWING_ROOM_PREFIX + payload.textureId).emit(ON_CODRAWING_STROKE_ACKNOWLEDGED, payload)
  })

  socket.on(ON_CODRAWING_INITIALIZE, (payload) => {
    const socketSession = app.get(SOCKET_SESSIONS_STORE).findSession(payload.userMongoId)
    if(!socketSession) {
      return
    }
    socketSession.emit(ON_CODRAWING_INITIALIZE, payload);
  })

  socket.on("disconnect", (reason) => {
    console.log('disconnecting', socket.id, socket.user, reason)
  });

  socket.on('disconnect', onSocketDisconnect(io, socket, app))
});