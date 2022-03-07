import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import { v4 as uuidv4 } from 'uuid';

import User from '../../models/User';

const ON_LOBBY_UPDATE = 'ON_LOBBY_UPDATE'

const router = Router();

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

    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    req.socket.leave(req.lobby.id)
    if(req.user.role === 'ADMIN') req.socket.leave('admins@'+req.lobby.id);
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
      if(req.user.role === 'ADMIN') req.socket.join('admins@'+req.lobby.id);
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
    if(req.user.role === 'ADMIN') req.socket.join('admins@'+req.lobby.id);

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


router.put('/user/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privileges to update that user in that lobby.' });
    }

    let index;
    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.body.userId) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in lobby' });
    }

    req.lobby.users[index] = { ...req.lobby.users[index], ...req.body.user}
    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

// router.put('/:id', requireJwtAuth, requireLobby, async (req, res) => {
//   try {

//     req.lobby.participantEmail = req.body.participantEmail
//     req.lobby.startTime = req.body.startTime

//     res.status(200).json({ lobby: req.lobby });
//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong. ' + err });
//   }
// });

export default router;
