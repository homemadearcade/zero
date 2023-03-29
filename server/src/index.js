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
import { ON_AUTHENTICATE_SOCKET_FAIL, ON_LOBBY_UPDATE, ON_AUTHENTICATE_SOCKET_SUCCESS, ON_COBROWSING_STATUS_UPDATE, ON_GAME_INSTANCE_UPDATE, ON_LOBBY_USER_STATUS_UPDATE, ON_GAME_INSTANCE_EVENT, ON_GAME_CHARACTER_UPDATE, ON_SOCKET_DISCONNECT, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_CODRAWING_STROKE_ACKNOWLEDGED, ON_CODRAWING_INITIALIZE, ON_GAME_ROOM_UPDATE, SOCKET_IO_STORE, SOCKET_SESSIONS_STORE, LOBBYS_STORE, CODRAWING_ROOM_PREFIX, GAME_ROOMS_STORE, ON_GAME_ROOM_USER_STATUS_UPDATE } from './constants';
import Lobby from './models/Lobby';
import TicketedEvent from './models/TicketedEvent';
import TicketPurchase from './models/TicketPurchase';
import GameRoom from './models/GameRoom';

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

        const lobbys = app.get(LOBBYS_STORE)
        lobbys?.forEach((lobby) => {
          lobby.members.forEach((user) => {
            if(user.id === socket.user.id) {
              user.connected = true
              lobby.messages.push({
                user: {
                  id: user.id,
                  username: user.username
                },
                message: 'has connected',
                automated: true
              })
              if(user.joined) socket.join(lobby.id);
              io.to(lobby.id).emit(ON_LOBBY_UPDATE, {lobby});
            }
          })
        })

        const gameRooms = app.get(GAME_ROOMS_STORE)
        gameRooms?.forEach((gameRoom) => {
          gameRoom.members.forEach((user) => {
            if(user.id === socket.user.id) {
              user.connected = true
              gameRoom.messages.push({
                user: {
                  id: user.id,
                  username: user.username
                },
                message: 'has connected',
                automated: true
              })
              if(user.joined) socket.join(gameRoom.id);
              io.to(gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom});
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

  socket.on(ON_LOBBY_USER_STATUS_UPDATE, (payload) => {
    io.to(payload.lobbyInstanceId).emit(ON_LOBBY_USER_STATUS_UPDATE, payload)
  })

  socket.on(ON_GAME_ROOM_USER_STATUS_UPDATE, (payload) => {
    io.to(payload.gameRoomId).emit(ON_GAME_ROOM_USER_STATUS_UPDATE, payload)
  })

  socket.on(ON_GAME_INSTANCE_EVENT, (payload) => {
    io.to(payload.gameRoomId).emit(ON_GAME_INSTANCE_EVENT, payload)
  })

  let upsServer = {}
  let lastUpsServerCounts = {}
  let upsServerUpdates = {}

  socket.on(ON_GAME_INSTANCE_UPDATE, (payload) => {

    const gameRoomId = payload.gameRoomId
    const time = Date.now();
    
    if(!lastUpsServerCounts[gameRoomId]) lastUpsServerCounts[gameRoomId] = 0
    if(!upsServerUpdates[gameRoomId]) upsServerUpdates[gameRoomId] = 0

    upsServerUpdates[gameRoomId]++;

    if (time > lastUpsServerCounts[gameRoomId] + 1000) {
      upsServer[gameRoomId] = Math.round( ( upsServerUpdates[gameRoomId] * 1000 ) / ( time - lastUpsServerCounts[gameRoomId] ) );
      lastUpsServerCounts[gameRoomId] = time;
      upsServerUpdates[gameRoomId] = 0;
    }

    payload.upsServer = upsServer[gameRoomId]
      
    io.to(payload.gameRoomId).emit(ON_GAME_INSTANCE_UPDATE, payload)
  })

  socket.on(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, (payload) => {
    payload.upsServer = upsServer[payload.gameRoomId]

    io.to(payload.gameRoomId).emit(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, payload)
  })

  socket.on(ON_GAME_CHARACTER_UPDATE, (payload) => {
    io.to(payload.gameRoomId).emit(ON_GAME_CHARACTER_UPDATE, payload)
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
      const lobbys = app.get(LOBBYS_STORE)
      lobbys.forEach((lobby) => {
        lobby.members.forEach((user) => {
          if(user.id === socket.user.id) {
            user.connected = false
            socket.emit(ON_SOCKET_DISCONNECT)
            lobby.messages.push({
              user: {
                id: user.id,
                username: user.username
              },
              message: 'has disconnected',
              automated: true
            })
            io.to(lobby.id).emit(ON_LOBBY_UPDATE, {lobby});
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
  //  lobby: '63af254fe01d446c03c80f56',
  //  ticketId: 'genadmin',
  //  dateId: 'a9f14b3e-90d3-423d-a3bf-b0682960ffc0'
  // }
  
  // await TicketPurchase.create(ticketPurchase)

  let lobbys = await Lobby.find().populate('invitedUsers')
  
  if(lobbys) {
    lobbys =  lobbys.map((lob) => {
      const lobby = lob.toJSON()
      return {
        ...lobby,
        currentActivity: 'WAITING_ACTIVITY',
        currentStep: 2,
        messages: [],
        members: lobby.invitedUsers.map((user) => {
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

    app.set(LOBBYS_STORE, lobbys);  
  } else {
    app.set(LOBBYS_STORE, []);  

  }

  let gameRooms = await GameRoom.find().populate('invitedUsers').populate()

  if(gameRooms) {
    gameRooms =  gameRooms.map((gam) => {
      const gameRoom = gam.toJSON()
      return {
        ...gameRoom,
        gameState: 'PLAY_STATE',
        messages: [],
        resetDate: Date.now(),
        members: gameRoom.invitedUsers.map((user) => {
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
    

    app.set(GAME_ROOMS_STORE, gameRooms);  
  } else {
    app.set(GAME_ROOMS_STORE, []);  

  }
}