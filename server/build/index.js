"use strict";

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _https = _interopRequireDefault(require("https"));

var _fs = require("fs");

var _path = require("path");

var _passport = _interopRequireDefault(require("passport"));

var _http = _interopRequireDefault(require("http"));

var _morgan = _interopRequireDefault(require("morgan"));

var _socket = require("socket.io");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _routes = _interopRequireDefault(require("./routes"));

var _User = _interopRequireDefault(require("./models/User"));

var _sessionStore = require("./utils/sessionStore");

var _constants = require("./constants");

var _Lobby = _interopRequireDefault(require("./models/Lobby"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import all_routes from 'express-list-endpoints';
// import { seedDb } from './utils/seed';
const app = (0, _express.default)();
app.post('/uploadtest', (req, res) => {
  let startTime = new Date().getTime();
  let dataSize = 0; // Each time data is received, report the number of bits each second

  req.on('data', data => {
    dataSize += data.length;
  }); // When all data is received, log it and close the connection;

  req.on('end', () => {
    let currentTime = new Date().getTime();
    let duration = (currentTime - startTime) / 1000;
    var bitsLoaded = dataSize * 8;
    var speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
    res.status(200).send({});
  });
}); // function saveSpriteSheet(id, json) {
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

app.get('/spriteSheets', (req, res) => {
  const {
    spriteSheetIds
  } = req.query;
  const sss = [];
  spriteSheetIds.forEach(id => {
    const data = (0, _fs.readFileSync)((0, _path.resolve)(__dirname, '../../data/sprite/' + id + '.json'), 'utf8');
    const parsedData = JSON.parse(data);
    sss.push(parsedData);
  });
  res.send({
    spriteSheets: sss
  });
}); // Bodyparser Middleware

app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
})); // app.use(morgan('combined'))

app.use(_passport.default.initialize());

require('./services/jwtStrategy');

require('./services/googleStrategy');

require('./services/localStrategy');

const isProduction = process.env.NODE_ENV === 'production'; // DB Config

const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV; // Connect to Mongo

_mongoose.default.connect(dbConnection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(async () => {
  console.log('MongoDB Connected...');

  try {
    onMongoDBConnected();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}).catch(err => console.log(err)); // Use Routes


app.use('/', _routes.default);
app.use('/public', _express.default.static((0, _path.join)(__dirname, '../public')));
let server;
let port; // Serve static assets if in production

if (isProduction) {
  // Set static folder
  app.use(_express.default.static((0, _path.join)(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    res.sendFile((0, _path.resolve)(__dirname, '../..', 'client', 'build', 'index.html')); // index is in /server/src so 2 folders up
  });
  port = process.env.PORT || 80;
  server = _http.default.Server(app);
} else {
  port = process.env.PORT || 5000;
  const httpsOptions = {
    key: (0, _fs.readFileSync)((0, _path.resolve)(__dirname, '../security/cert.key')),
    cert: (0, _fs.readFileSync)((0, _path.resolve)(__dirname, '../security/cert.pem'))
  };
  server = _https.default.createServer(httpsOptions, app);
} // Listen for requests


const io = new _socket.Server(server, {
  /* options */
});
const socketSessions = new _sessionStore.InMemorySessionStore();
app.set('socketio', io);
app.set('socketSessions', socketSessions);
server.listen(port, () => console.log(`Server started on port ${port}`));
io.on("connection", socket => {
  // this event is called after a user is logged in and also after a socket is reconnected
  socket.on('authenticate', async ({
    token
  }) => {
    if (token) {
      const isProduction = process.env.NODE_ENV === 'production';
      const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

      const decoded = _jsonwebtoken.default.verify(token, secretOrKey);

      const email = decoded.email;
      const user = await _User.default.findOne({
        email: email.trim()
      });

      if (user) {
        socket.user = {
          email: user.email,
          id: user.id,
          username: user.username
        };
        const lobbys = app.get('lobbys');
        lobbys.forEach(lobby => {
          lobby.users.forEach(user => {
            if (user.id === socket.user.id) {
              user.connected = true;
              socket.join(lobby.id);
              io.to(lobby.id).emit(_constants.ON_LOBBY_UPDATE, {
                lobby
              });
            }
          });
        });
        socket.emit(_constants.ON_AUTHENTICATE_SOCKET_SUCCESS);
        socketSessions.saveSession(user.id, socket);
      } else {
        socket.emit(_constants.ON_AUTHENTICATE_SOCKET_FAIL, {
          error: 'no such user'
        });
      }
    } else {
      socket.emit(_constants.ON_AUTHENTICATE_SOCKET_FAIL, {
        error: 'no token for socket'
      });
    }
  });
  socket.on(_constants.ON_COBROWSING_STATUS_UPDATE, payload => {
    io.to('admins@' + payload.lobbyId).emit(_constants.ON_COBROWSING_STATUS_UPDATE, payload);
  });
  socket.on(_constants.ON_LOBBY_USER_STATUS_UPDATE, payload => {
    io.to(payload.lobbyId).emit(_constants.ON_LOBBY_USER_STATUS_UPDATE, payload);
  });
  socket.on(_constants.ON_GAME_INSTANCE_UPDATE, payload => {
    io.to(payload.lobbyId).emit(_constants.ON_GAME_INSTANCE_UPDATE, payload);
  });
  socket.on("disconnect", async () => {
    var _socket$user;

    if ((_socket$user = socket.user) !== null && _socket$user !== void 0 && _socket$user.id) {
      const lobbys = app.get('lobbys');
      lobbys.forEach(lobby => {
        lobby.users.forEach(user => {
          if (user.id === socket.user.id) {
            user.connected = false;
            io.to(lobby.id).emit(_constants.ON_LOBBY_UPDATE, {
              lobby
            });
          }
        });
      });
    }
  });
});

async function onMongoDBConnected() {
  let lobbys = await _Lobby.default.find().populate('participants game').populate({
    path: 'game',
    populate: {
      path: 'user',
      model: 'User'
    }
  });

  if (lobbys) {
    lobbys = lobbys.map(lob => {
      const lobby = lob.toJSON();
      return { ...lobby,
        users: lobby.participants.map(user => {
          return {
            email: user.email,
            id: user.id,
            username: user.username,
            role: user.role,
            joined: false,
            connected: false
          };
        })
      };
    });
    app.set('lobbys', lobbys);
  } else {
    app.set('lobbys', []);
  }
}
//# sourceMappingURL=index.js.map