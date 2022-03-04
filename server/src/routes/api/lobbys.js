import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { v4 as uuidv4 } from 'uuid';

import User from '../../models/User';

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
const ON_LOBBY_COBROWSING_UPDATE = 'ON_LOBBY_COBROWSING_UPDATE'
const ON_LOBBY_COBROWSING_REGISTERED = 'ON_LOBBY_COBROWSING_REGISTERED'

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
  next()
}

router.get('/', requireLobbys, async (req, res) => {
  try {    
    res.json({
      lobbys: req.lobbys
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/:id', requireLobby, async (req, res) => {
  try {
    res.json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/byEmail/:participantEmail', requireLobbys, async (req, res) => {
  try {

    const lobbyFound = req.lobbys.filter((l, i) => {
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
    res.status(500).json({ message: 'Something went wrong. ' + err });
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

    req.lobbys.push(lobby)

    res.status(200).json({ lobbys: req.lobbys });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/cobrowse/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if(req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to register cobrowse.' });
    }

    req.socket.join('lobby://'+req.body.userId);
    req.app.get('socketSessions').findById(req.body.userId).emit(ON_LOBBY_COBROWSING_REGISTERED);
    
    const user = await User.findById(req.body.userId)
    res.status(200).json({ cobrowsingUser: user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.delete('/cobrowse/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if(req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to unregister this cobrowse.' });
    }

    req.socket.leave('lobby://'+req.body.userId);    
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/cobrowse/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id)) {
      return res.status(400).json({ message: 'You do not have privileges to update this users cobrowse state.' });
    }

    req.io.to('lobby://'+req.body.userId).emit(ON_LOBBY_COBROWSING_UPDATE, {
      userId: req.body.userId,
      cobrowsingState: req.body.cobrowsingState
    });

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privileges to remove user from that lobby.' });
    }

    // let index;
    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.body.userId) {
        // index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in lobby' });
    }

    userFound.joined = false

    // req.lobby.users.splice(index, 1)
    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    req.socket.leave(req.lobby.id)
    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/assign/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  if (!(req.user.role === 'ADMIN' || req.user.id === req.body.userId)) {
    return res.status(400).json({ message: 'You do not have privileges to assign that role.' });
  }

  if(req.body.role === 'gameHost') {
    if(req.body.userId === 'unassigned') {
      req.lobby.gameHostId = null
    } else {
      req.lobby.gameHostId = req.body.userId
    }

  }

  if(req.body.role === 'participant') {
    if(req.body.userId === 'unassigned') {
      req.lobby.participantId = null
    } else {
      req.lobby.participantId = req.body.userId
    }
  }

  if(req.body.role === 'guide') {
    if(req.body.userId === 'unassigned') {
      req.lobby.guideId = null
    } else {
      const user = await User.findById(req.body.userId)
      if(user.role == 'ADMIN') {
        req.lobby.guideId = req.body.userId
      } else {
        return res.status(400).json({ message: 'Guide must be admin role' });
      }
    }
  }

  req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
  return res.status(200).json({ lobby: req.lobby });
})

router.post('/join/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]
    
    if(userFound) {
      req.socket.join(req.lobby.id);
      userFound.joined = true;
      req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
      return res.status(200).json({ lobby: req.lobby });
    }

    if (!(req.user.role === 'ADMIN' || req.lobby.participantEmail === req.user.email)) {
      return res.status(400).json({ message: 'You do not have permission to join that lobby.' });
    }

    // generate a lobby formatted user
    const newLobbyUser = { 
      email: req.user.email,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      connected: true
    }

    // listen for all of this lobbies events
    req.socket.join(req.lobby.id);

    // remove from all other lobbies
    req.lobbys.forEach((lobby) => {
      let index;
      lobby.users.forEach((user, i) => {
        if(newLobbyUser.id === user.id) {
          index = i
        }
      })
      if(index >= -1) {
        lobby.users.splice(index, 1)
        req.socket.leave(lobby.id);
        req.io.to(lobby.id).emit(ON_LOBBY_UPDATE, {lobby: lobby});
      }
    })

    // add to new lobby
    req.lobby.users.push(newLobbyUser)

    // update the lobbies with this information
    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    return res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
});

router.delete('/:id', requireJwtAuth, requireLobby, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to delete that lobby.' });
    }

    req.lobbys.splice(req.lobbyIndex, 1);

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/:id', requireJwtAuth, requireLobby, async (req, res) => {
  try {

    req.lobby.participantEmail = req.body.participantEmail
    req.lobby.startTime = req.body.startTime

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
