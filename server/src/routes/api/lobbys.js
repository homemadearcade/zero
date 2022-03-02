import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { v4 as uuidv4 } from 'uuid';


// Ok so requires roles within the experience include

// Host, Participant, Guide

// If you aren’t a required role, then you are a witness role

// var room = io.sockets.adapter.rooms['my_room’]

// If a required role has disconnected, throw an alarm on the front end

// remove user array

// If you navigate away, you automatically forget your role and the alarm sounds. 
// Disconnect is different than leave. Disconnect means internet went out or computer crashed. Technical difficulty
// Leave room is done by an action

// Disconnect doesnt throw an alarm, it just something you can check

const ON_LOBBY_UPDATE = 'ON_LOBBY_UPDATE'


const router = Router();

function requireSocketAuth(req, res, next) {

  const socketSessions= req.app.get('socketSessions');
  const socket = socketSessions.findSession(req.user.id);
  req.socket = socket;
  req.io = req.app.get('socketio');

  next()
}

function requireSocket(req, res, next) {
  req.io = req.app.get('socketio');
  next()
}

function requireLobbys(req, res, next) {
  req.lobbys = req.app.get('lobbys');
  next()
}

function requireLobby(req, res, next) {
  let index

  const lobbys = req.app.get('lobbys');
  req.lobbys = lobbys

  const lobbyFound = lobbys.filter((l, i) => {
    if(l.id === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })[0]

  if(!lobbyFound) {
    res.status(400).json({ message: 'No lobby found with id: ' + req.params.id });
    return 
  }

  req.lobby = lobbyFound
  req.lobbyIndex = index
  // req.lobbySockets = req.app.get('socketio').sockets.adapter.rooms[req.params.id];

  next()
}

router.get('/', requireLobbys, async (req, res) => {
  try {    
    res.json({
      lobbys: req.lobbys
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', requireLobby, async (req, res) => {
  try {
    res.json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byEmail/:participantEmail', requireLobbys, async (req, res) => {
  try {

    const lobbyFound = lobbys.filter((l, i) => {
      if(l.participantEmail === req.params.participantEmail) {
        return true
      } else {
        return false
      }
    })[0]

    if(!lobbyFound) {
      res.status(400).json({ message: 'No lobby found for: ' + req.params.participantEmail, });
    }
      
    res.json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, requireLobbys, async (req, res) => {
  try {
    let lobby = {
      participantEmail: req.body.participantEmail,
      startTime: req.body.startTime,
      id: uuidv4(),
      users: [],
    };

    lobbys.push(lobby)

    res.status(200).json({ lobbys: lobbys });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/leave/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privileges to remove user from that lobby.' });
    }

    // let index;

    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.user.id) {
        // index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.params.id + ' found' });
    }

    userFound.joined = false

    // req.lobby.users.splice(index, 1)
    req.io.to(req.params.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    req.socket.leave(req.params.id)
    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/join/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {

    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]
    
    if(userFound) {
      req.socket.join(req.params.id);
      userFound.joined = true;
      req.io.to(req.params.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
      return res.status(200).json({ lobby: req.lobby });
    }

    if (!(req.user.role === 'ADMIN' || req.lobby.participantEmail === req.user.email)) {
      return res.status(400).json({ message: 'You do not have permission to join that lobby.' });
    }

    const newLobbyUser = { 
      email: req.user.email,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      connected: true
    }

    req.socket.join(req.params.id);
    req.lobby.users.push(newLobbyUser)
    req.io.to(req.params.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    return res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.delete('/:id', requireJwtAuth, requireLobby, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to delete that lobby.' });
    }

    lobbys.splice(req.lobbyIndex, 1);

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, requireLobby, async (req, res) => {
  try {

    req.lobby.participantEmail = req.body.participantEmail
    req.lobby.startTime = req.body.startTime

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
