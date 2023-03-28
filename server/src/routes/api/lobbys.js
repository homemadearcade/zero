import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import User from '../../models/User';

import { ON_LOBBY_UPDATE, ON_LOBBY_UNDO, ADMIN_ROOM_PREFIX, LOBBYS_STORE, LOBBY_INSTANCE_ID_PREFIX } from '../../constants';
import Lobby from '../../models/Lobby';
import { generateUniqueId } from '../../utils/utils';

const router = Router();

function requireLobbys(req, res, next) {
  req.lobbys = req.app.get(LOBBYS_STORE);
  next()
}

function requireLobby(req, res, next) {
  let index

  const lobbys = req.app.get(LOBBYS_STORE);
  req.lobbys = lobbys

  if(!lobbys) {
    res.status(400).json({ message: 'No lobbies found. Looking for lobby with id: ' + req.params.id });
  }

  const lobbyFound = lobbys?.filter((l, i) => {
    if(l.id.toString() === req.params.id) {
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

router.post('/:id/message', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  req.lobby.messages.push({
    user: {
      id: req.user.id,
      username: req.user.username
    },
    message: req.body.message,
    automated: req.body.automated
  })

  req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
  res.status(200).json({ lobby: req.lobby });
})

router.post('/:id/clearMessages', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  req.lobby.messages = []
  req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
  res.status(200).json({ lobby: req.lobby });
})

router.post('/', requireJwtAuth, requireLobbys, async (req, res) => {
  try {
    let lobby = await Lobby.create({
      invitedUsers: req.body.invitedUsers,
      startTime: req.body.startTime,
      participantId: req.body.participantId,
      guideId: req.body.guideId,
      editingGameId: req.body.editingGameId,
      gameRoomId: req.body.gameRoomId,
      experienceInstanceId: req.body.experienceInstanceId,
      lobbyInstanceShortId: LOBBY_INSTANCE_ID_PREFIX + generateUniqueId()
    });

    lobby = await lobby.populate('invitedUsers').execPopulate();

    lobby = lobby.toJSON()

    lobby.members = lobby.invitedUsers.map((user) => {
      return {
        email: user.email,
        id: user.id,
        username: user.username,
        role: user.role,
        joined: false,
        connected: false,
      }
    })

    lobby.currentStep = 2
    lobby.currentActivity = 'WAITING_ACTIVITY'
    lobby.messages = []

    req.lobbys.push(lobby)

    res.status(200).json({ lobbys: req.lobbys });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to remove user from that lobby.' });
    }

    // let index;
    const userFound = req.lobby.members.filter((u, i) => {
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

    req.lobby.messages.push({
      user: {
        id: userFound.id,
        username: userFound.username
      },
      automated: true,
      message: 'has left the lobby',
    })

    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    req.socket.leave(req.lobby.id)
    if(req.user.role === 'ADMIN') req.socket.leave(ADMIN_ROOM_PREFIX+req.lobby.id);
    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/assign/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  if (!(req.user.role === 'ADMIN' || req.user.id === req.body.userId)) {
    return res.status(400).json({ message: 'You do not have privelages to assign that role.' });
  }

  const userFound = req.lobby.members.filter((u, i) => {
    if(u.id === req.body.userId) {
      return true
    } else {
      return false
    }
  })[0]

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

  const updatedLobby = await Lobby.findByIdAndUpdate(
    req.params.id,
    { 
      participantId: req.lobby.participantId,
      guideId: req.lobby.guideId,
    },
    { new: true },
  );

  // if(!userFound) {
  //   return res.status(400).json({ message: 'You are not a member of this lobby' });
  // }

  req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
  return res.status(200).json({ lobby: req.lobby });
})

router.post('/join/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    const userFound = req.lobby.members.filter((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]


    if(userFound) {

      req.lobby.messages.push({
        user: {
          id: userFound.id,
          username: userFound.username
        },
        message: 'has re-joined the lobby',
        automated: true
      })
      
      req.socket.join(req.lobby.id);
      if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.lobby.id);
      userFound.joined = true;
      req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
      return res.status(200).json({ lobby: req.lobby });
    }

    const isParticipant = req.lobby.invitedUsers.some((user) => {
      return user.id === req.user.id
    })

    if (!(req.user.role === 'ADMIN' || isParticipant)) {
      return res.status(400).json({ message: 'You do not have permission to join that lobby.' });
    }

    // generate a lobby formatted user
    const newLobbyMember = { 
      email: req.user.email,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      connected: true,
      inOverlayView: false
    }

    req.lobby.messages.push({
      user: {
        id: newLobbyMember.id,
        username: newLobbyMember.username
      },
      message: 'has connected',
      automated: true
    })
    req.lobby.messages.push({
      user: {
        id: newLobbyMember.id,
        username: newLobbyMember.username
      },
      message: 'has joined the lobby',
      automated: true
    })

    req.socket.join(req.lobby.id);
    if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.lobby.id);

    req.lobbys.forEach((lobby) => {
      let index;
      lobby.members.forEach((user, i) => {
        if(newLobbyMember.id === user.id) {
          index = i
        }
      })
      if(index >= -1) {
        // lobby.members.splice(index, 1)
        const member = lobby.members[index]
        member.joined = false
        lobby.messages.push({
          user: {
            id: member.id,
            username: member.username
          },
          message: 'has joined another lobby',
          automated: true
        })
        req.socket.leave(lobby.id);
        req.io.to(lobby.id).emit(ON_LOBBY_UPDATE, {lobby: lobby});
      }
    })

    // add to new lobby
    req.lobby.members.push(newLobbyMember)

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
      return res.status(400).json({ message: 'You do not have privelages to delete that lobby.' });
    }

    try {
      const lobby = await Lobby.findByIdAndRemove(req.params.id).populate('invitedUsers');
      req.lobbys.splice(req.lobbyIndex, 1);
      if (!lobby) return res.status(404).json({ lobby: 'No lobby found.' });
    } catch (err) {
      res.status(500).json({ lobby: 'Something went wrong.' });
    }

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/user/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update that user in that lobby.' });
    }

    let index;
    const userFound = req.lobby.members.filter((u, i) => {
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

    req.lobby.members[index] = { ...req.lobby.members[index], ...req.body.user}
    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/undo/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  const isParticipant = req.lobby.invitedUsers.some((user) => {
    return user.id === req.user.id
  })

  if (!(req.user.role === 'ADMIN' || isParticipant)) {
    return res.status(400).json({ message: 'You do not have permission to undo in that lobby.' });
  }

  req.io.to(req.lobby.id).emit(ON_LOBBY_UNDO);
  
  res.status(200).json({});
})


router.put('/:id', requireJwtAuth, requireLobby, requireSocketAuth, async (req, res) => {
  try {

    // if(req.lobby.isGamePoweredOn && req.body.game?.id) {
    //   return res.status(400).json({ message: 'You cannot change the editing game id of a lobby when game is powered on' });
    // }

    // actually currently needed to be able to switch while game is on to function
    // if(req.lobby.isGamePoweredOn && req.body.currentGameId) {
    //   return res.status(400).json({ message: 'You cannot change the current game id of a lobby when game is powered on' });
    // }

    // if(req.body.isGamePoweredOn && req.user.role !== 'ADMIN') {
    //   return res.status(400).json({ message: 'You do not have privelages to power on this game.' });
    // }

    Object.assign(req.lobby,req.body)

    const updatedLobby = await Lobby.findByIdAndUpdate(
      req.params.id,
      { 
        invitedUsers: req.lobby.invitedUsers.map(({id}) => {
          return id
        }),
        startTime: req.lobby.startTime,
        participantId: req.lobby.participantId,
        guideId: req.lobby.guideId,
        editingGameId: req.lobby.editingGameId,
        gameRoomId: req.lobby.gameRoomId
      },
      { new: true },
    );

    req.io.to(req.lobby.id).emit(ON_LOBBY_UPDATE, {lobby: req.lobby});
    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
