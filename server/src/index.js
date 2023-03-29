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
import jsonwebtoken from 'jsonwebtoken';

import routes from './routes';
// import { seedDb } from './utils/seed';

import User from './models/User';
import { InMemorySessionStore } from './utils/sessionStore';
import { ON_AUTHENTICATE_SOCKET_FAIL, ON_LOBBY_INSTANCE_UPDATE, ON_AUTHENTICATE_SOCKET_SUCCESS, ON_COBROWSING_STATUS_UPDATE, ON_GAME_INSTANCE_UPDATE, ON_LOBBY_INSTANCE_USER_STATUS_UPDATE, ON_GAME_INSTANCE_EVENT, ON_GAME_CHARACTER_UPDATE, ON_SOCKET_DISCONNECT, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_CODRAWING_STROKE_ACKNOWLEDGED, ON_CODRAWING_INITIALIZE, ON_GAME_ROOM_INSTANCE_UPDATE, SOCKET_IO_STORE, SOCKET_SESSIONS_STORE, LOBBY_INSTANCE_STORE, CODRAWING_ROOM_PREFIX, GAME_ROOMS_STORE, ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE } from './constants';
import LobbyInstance from './models/LobbyInstance';
import TicketedEvent from './models/TicketedEvent';
import TicketPurchase from './models/TicketPurchase';
import GameRoomInstance from './models/GameRoomInstance';

const app = express();

app.post('/uploadtest', (req, res) => {
  let startTime = new Date().getTime();
  let dataSize = 0;

  // Each time data is received, report the number of bits each second
  req.on('data', (data) => {
    dataSize += data.length;
  });

  // When all data is received, log it and close the connection;
  req.on('end', () => {
    let currentTime = new Date().getTime();
    let duration =  (currentTime - startTime)/1000;
    var bitsLoaded = dataSize * 8;
    var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);
    res.status(200).send({ });
  })
})

// function saveSpriteSheet(id, json) {
//   writeFile(resolve(__dirname, '../../data/sprite/' + id + '.json'), JSON.stringify(json), 'utf8', (e) => {
//     if(e) return console.log(e)
//     else console.log('spritesheet: ' + id + ' saved')
//   });
// }

// parsedData.sprites  = parsedData.sprites.map((sprite, index) => {
//   return {
//     ...sprite,
//     name: null,
//     id: 'sprite'+index,
//     textureId: id + '-' + 'sprite' +index,
//   }
// })

// saveSpriteSheet(id, parsedData)

app.get('/spriteSheets', (req,res)=>{
  const { spriteSheetIds } =  req.query;

  const sss = []
  spriteSheetIds.forEach((id) => {
    const data = readFileSync(resolve(__dirname, '../../data/sprite/' +id+'.json'), 'utf8')
    const parsedData = JSON.parse(data)
    sss.push(parsedData)
  })

  res.send({spriteSheets: sss})
})


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
      onMongoDBConnected()
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

        const lobbyInstances = app.get(LOBBY_INSTANCE_STORE)
        lobbyInstances?.forEach((lobbyInstance) => {
          lobbyInstance.members.forEach((user) => {
            if(user.id === socket.user.id) {
              user.connected = true
              lobbyInstance.messages.push({
                user: {
                  id: user.id,
                  username: user.username
                },
                message: 'has connected',
                automated: true
              })
              if(user.joined) socket.join(lobbyInstance.id);
              io.to(lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance});
            }
          })
        })

        const gameRoomInstances = app.get(GAME_ROOMS_STORE)
        gameRoomInstances?.forEach((gameRoomInstance) => {
          gameRoomInstance.members.forEach((user) => {
            if(user.id === socket.user.id) {
              user.connected = true
              gameRoomInstance.messages.push({
                user: {
                  id: user.id,
                  username: user.username
                },
                message: 'has connected',
                automated: true
              })
              if(user.joined) socket.join(gameRoomInstance.id);
              io.to(gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance});
            }
          })
        })
  
        socket.emit(ON_AUTHENTICATE_SOCKET_SUCCESS)
        socketSessions.saveSession(user.id, socket);

      } else {
        socket.emit(ON_AUTHENTICATE_SOCKET_FAIL, { error: 'no such user'})
      }
    } else {
      socket.emit(ON_AUTHENTICATE_SOCKET_FAIL, { error: 'no token for socket'})
    }
  })

  socket.on(ON_COBROWSING_STATUS_UPDATE, (payload) => {
    io.to('cobrowsing@'+payload.userId).emit(ON_COBROWSING_STATUS_UPDATE, payload)
  })

  socket.on(ON_LOBBY_INSTANCE_USER_STATUS_UPDATE, (payload) => {
    io.to(payload.lobbyInstanceId).emit(ON_LOBBY_INSTANCE_USER_STATUS_UPDATE, payload)
  })

  socket.on(ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE, (payload) => {
    io.to(payload.gameRoomInstanceId).emit(ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE, payload)
  })

  socket.on(ON_GAME_INSTANCE_EVENT, (payload) => {
    io.to(payload.gameRoomInstanceId).emit(ON_GAME_INSTANCE_EVENT, payload)
  })

  let upsServer = {}
  let lastUpsServerCounts = {}
  let upsServerUpdates = {}

  socket.on(ON_GAME_INSTANCE_UPDATE, (payload) => {

    const gameRoomInstanceId = payload.gameRoomInstanceId
    const time = Date.now();
    
    if(!lastUpsServerCounts[gameRoomInstanceId]) lastUpsServerCounts[gameRoomInstanceId] = 0
    if(!upsServerUpdates[gameRoomInstanceId]) upsServerUpdates[gameRoomInstanceId] = 0

    upsServerUpdates[gameRoomInstanceId]++;

    if (time > lastUpsServerCounts[gameRoomInstanceId] + 1000) {
      upsServer[gameRoomInstanceId] = Math.round( ( upsServerUpdates[gameRoomInstanceId] * 1000 ) / ( time - lastUpsServerCounts[gameRoomInstanceId] ) );
      lastUpsServerCounts[gameRoomInstanceId] = time;
      upsServerUpdates[gameRoomInstanceId] = 0;
    }

    payload.upsServer = upsServer[gameRoomInstanceId]
      
    io.to(payload.gameRoomInstanceId).emit(ON_GAME_INSTANCE_UPDATE, payload)
  })

  socket.on(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, (payload) => {
    payload.upsServer = upsServer[payload.gameRoomInstanceId]

    io.to(payload.gameRoomInstanceId).emit(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, payload)
  })

  socket.on(ON_GAME_CHARACTER_UPDATE, (payload) => {
    io.to(payload.gameRoomInstanceId).emit(ON_GAME_CHARACTER_UPDATE, payload)
  })

  socket.on(ON_CODRAWING_STROKE_ACKNOWLEDGED, (payload) => {
    io.to(CODRAWING_ROOM_PREFIX + payload.textureId).emit(ON_CODRAWING_STROKE_ACKNOWLEDGED, payload)
  })

  socket.on(ON_CODRAWING_INITIALIZE, (payload) => {
    const socketSession = app.get(SOCKET_SESSIONS_STORE).findSession(payload.userId)
    if(!socketSession) {
      return
    }
    socketSession.emit(ON_CODRAWING_INITIALIZE, payload);
  })

  socket.on("disconnect", async () => {
    if(socket.user?.id) {
      const lobbyInstances = app.get(LOBBY_INSTANCE_STORE)
      lobbyInstances.forEach((lobbyInstance) => {
        lobbyInstance.members.forEach((user) => {
          if(user.id === socket.user.id) {
            user.connected = false
            socket.emit(ON_SOCKET_DISCONNECT)
            lobbyInstance.messages.push({
              user: {
                id: user.id,
                username: user.username
              },
              message: 'has disconnected',
              automated: true
            })
            io.to(lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance});
          }
        })
      })
    }
  });
});

async function onMongoDBConnected() {

  // const ticketPurchase = {
  //  ticketedEvent: '63af7a7e2196ea6520e100b7',
  //  user: '62143b5618ac51461e5ecf6c',
  //  lobbyInstance: '63af254fe01d446c03c80f56',
  //  ticketId: 'genadmin',
  //  dateId: 'a9f14b3e-90d3-423d-a3bf-b0682960ffc0'
  // }
  
  // await TicketPurchase.create(ticketPurchase)

  let lobbyInstances = await LobbyInstance.find().populate('invitedUsers')
  
  if(lobbyInstances) {
    lobbyInstances =  lobbyInstances.map((lob) => {
      const lobbyInstance = lob.toJSON()
      return {
        ...lobbyInstance,
        currentActivity: 'WAITING_ACTIVITY',
        currentStep: 2,
        messages: [],
        members: lobbyInstance.invitedUsers.map((user) => {
          return {
            email: user.email,
            id: user.id,
            username: user.username,
            role: user.role,
            joined: false,
            connected: false,
            inOverlayView: false,
          }
        })
      }
    })

    app.set(LOBBY_INSTANCE_STORE, lobbyInstances);  
  } else {
    app.set(LOBBY_INSTANCE_STORE, []);  

  }

  let gameRoomInstances = await GameRoomInstance.find().populate('invitedUsers').populate()

  if(gameRoomInstances) {
    gameRoomInstances =  gameRoomInstances.map((gam) => {
      const gameRoomInstance = gam.toJSON()
      return {
        ...gameRoomInstance,
        gameState: 'PLAY_STATE',
        messages: [],
        resetDate: Date.now(),
        members: gameRoomInstance.invitedUsers.map((user) => {
          return {
            email: user.email,
            id: user.id,
            username: user.username,
            role: user.role,
            joined: false,
            connected: false,
          }
        })
      }
    })
    

    app.set(GAME_ROOMS_STORE, gameRoomInstances);  
  } else {
    app.set(GAME_ROOMS_STORE, []);  

  }
}