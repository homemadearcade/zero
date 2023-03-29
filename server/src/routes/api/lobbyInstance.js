import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import User from '../../models/User';

import { ON_LOBBY_INSTANCE_UPDATE, ON_LOBBY_INSTANCE_UNDO, ADMIN_ROOM_PREFIX, LOBBY_INSTANCE_STORE, LOBBY_INSTANCE_ID_PREFIX } from '../../constants';
import LobbyInstance from '../../models/LobbyInstance';
import { generateUniqueId } from '../../utils/utils';

const router = Router();

function requireLobbyInstances(req, res, next) {
  req.lobbyInstances = req.app.get(LOBBY_INSTANCE_STORE);
  next()
}

function requireLobbyInstance(req, res, next) {
  let index

  const lobbyInstances = req.app.get(LOBBY_INSTANCE_STORE);
  req.lobbyInstances = lobbyInstances

  if(!lobbyInstances) {
    res.status(400).json({ message: 'No lobbies found. Looking for lobbyInstance with id: ' + req.params.id });
  }

  const lobbyInstanceFound = lobbyInstances?.filter((l, i) => {
    if(l.id.toString() === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })[0]

  if(!lobbyInstanceFound) {
    res.status(400).json({ message: 'No lobbyInstance found with id: ' + req.params.id });
    return 
  }

  req.lobbyInstance = lobbyInstanceFound
  req.lobbyInstanceIndex = index
  next()
}

router.get('/', requireLobbyInstances, async (req, res) => {
  try {    
    res.json({
      lobbyInstances: req.lobbyInstances
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/:id', requireLobbyInstance, async (req, res) => {
  try {
    res.json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/byEmail/:participantEmail', requireLobbyInstances, async (req, res) => {
  try {

    const lobbyInstanceFound = req.lobbyInstances.filter((l, i) => {
      if(l.participantEmail === req.params.participantEmail) {
        return true
      } else {
        return false
      }
    })[0]

    if(!lobbyInstanceFound) {
      res.status(400).json({ message: 'No lobbyInstance found for: ' + req.params.participantEmail, });
    }
      
    res.json({ lobbyInstance: lobbyInstanceFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/:id/message', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  req.lobbyInstance.messages.push({
    user: {
      id: req.user.id,
      username: req.user.username
    },
    message: req.body.message,
    automated: req.body.automated
  })

  req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
  res.status(200).json({ lobbyInstance: req.lobbyInstance });
})

router.post('/:id/clearMessages', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  req.lobbyInstance.messages = []
  req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
  res.status(200).json({ lobbyInstance: req.lobbyInstance });
})

router.post('/', requireJwtAuth, requireLobbyInstances, async (req, res) => {
  try {
    let lobbyInstance = await LobbyInstance.create({
      invitedUsers: req.body.invitedUsers,
      startTime: req.body.startTime,
      participantId: req.body.participantId,
      guideId: req.body.guideId,
      editingGameId: req.body.editingGameId,
      gameRoomInstanceId: req.body.gameRoomInstanceId,
      experienceInstanceId: req.body.experienceInstanceId,
      lobbyInstanceShortId: LOBBY_INSTANCE_ID_PREFIX + generateUniqueId()
    });

    lobbyInstance = await lobbyInstance.populate('invitedUsers').execPopulate();

    lobbyInstance = lobbyInstance.toJSON()

    lobbyInstance.members = lobbyInstance.invitedUsers.map((user) => {
      return {
        email: user.email,
        id: user.id,
        username: user.username,
        role: user.role,
        joined: false,
        connected: false,
      }
    })

    lobbyInstance.currentStep = 2
    lobbyInstance.currentActivity = 'WAITING_ACTIVITY'
    lobbyInstance.messages = []

    req.lobbyInstances.push(lobbyInstance)

    res.status(200).json({ lobbyInstances: req.lobbyInstances });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to remove user from that lobbyInstance.' });
    }

    // let index;
    const userFound = req.lobbyInstance.members.filter((u, i) => {
      if(u.id === req.body.userId) {
        // index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in lobbyInstance' });
    }

    userFound.joined = false

    req.lobbyInstance.messages.push({
      user: {
        id: userFound.id,
        username: userFound.username
      },
      automated: true,
      message: 'has left the lobbyInstance',
    })

    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    req.socket.leave(req.lobbyInstance.id)
    if(req.user.role === 'ADMIN') req.socket.leave(ADMIN_ROOM_PREFIX+req.lobbyInstance.id);
    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/assign/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  if (!(req.user.role === 'ADMIN' || req.user.id === req.body.userId)) {
    return res.status(400).json({ message: 'You do not have privelages to assign that role.' });
  }

  const userFound = req.lobbyInstance.members.filter((u, i) => {
    if(u.id === req.body.userId) {
      return true
    } else {
      return false
    }
  })[0]

  if(req.body.role === 'participant') {
    if(req.body.userId === 'unassigned') {
      req.lobbyInstance.participantId = null
    } else {
      req.lobbyInstance.participantId = req.body.userId
    }
  }

  if(req.body.role === 'guide') {
    if(req.body.userId === 'unassigned') {
      req.lobbyInstance.guideId = null
    } else {
      const user = await User.findById(req.body.userId)
      if(user.role == 'ADMIN') {
        req.lobbyInstance.guideId = req.body.userId
      } else {
        return res.status(400).json({ message: 'Guide must be admin role' });
      }
    }
  }

  const updatedLobbyInstance = await LobbyInstance.findByIdAndUpdate(
    req.params.id,
    { 
      participantId: req.lobbyInstance.participantId,
      guideId: req.lobbyInstance.guideId,
    },
    { new: true },
  );

  // if(!userFound) {
  //   return res.status(400).json({ message: 'You are not a member of this lobbyInstance' });
  // }

  req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
  return res.status(200).json({ lobbyInstance: req.lobbyInstance });
})

router.post('/join/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    const userFound = req.lobbyInstance.members.filter((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]


    if(userFound) {

      req.lobbyInstance.messages.push({
        user: {
          id: userFound.id,
          username: userFound.username
        },
        message: 'has re-joined the lobbyInstance',
        automated: true
      })
      
      req.socket.join(req.lobbyInstance.id);
      if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.lobbyInstance.id);
      userFound.joined = true;
      req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
      return res.status(200).json({ lobbyInstance: req.lobbyInstance });
    }

    const isParticipant = req.lobbyInstance.invitedUsers.some((user) => {
      return user.id === req.user.id
    })

    if (!(req.user.role === 'ADMIN' || isParticipant)) {
      return res.status(400).json({ message: 'You do not have permission to join that lobbyInstance.' });
    }

    // generate a lobbyInstance formatted user
    const newLobbyInstanceMember = { 
      email: req.user.email,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      connected: true,
      inOverlayView: false
    }

    req.lobbyInstance.messages.push({
      user: {
        id: newLobbyInstanceMember.id,
        username: newLobbyInstanceMember.username
      },
      message: 'has connected',
      automated: true
    })
    req.lobbyInstance.messages.push({
      user: {
        id: newLobbyInstanceMember.id,
        username: newLobbyInstanceMember.username
      },
      message: 'has joined the lobbyInstance',
      automated: true
    })

    req.socket.join(req.lobbyInstance.id);
    if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.lobbyInstance.id);

    req.lobbyInstances.forEach((lobbyInstance) => {
      let index;
      lobbyInstance.members.forEach((user, i) => {
        if(newLobbyInstanceMember.id === user.id) {
          index = i
        }
      })
      if(index >= -1) {
        // lobbyInstance.members.splice(index, 1)
        const member = lobbyInstance.members[index]
        member.joined = false
        lobbyInstance.messages.push({
          user: {
            id: member.id,
            username: member.username
          },
          message: 'has joined another lobbyInstance',
          automated: true
        })
        req.socket.leave(lobbyInstance.id);
        req.io.to(lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: lobbyInstance});
      }
    })

    // add to new lobbyInstance
    req.lobbyInstance.members.push(newLobbyInstanceMember)

    // update the lobbies with this information
    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    return res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
});

router.delete('/:id', requireJwtAuth, requireLobbyInstance, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to delete that lobbyInstance.' });
    }

    try {
      const lobbyInstance = await LobbyInstance.findByIdAndRemove(req.params.id).populate('invitedUsers');
      req.lobbyInstances.splice(req.lobbyInstanceIndex, 1);
      if (!lobbyInstance) return res.status(404).json({ lobbyInstance: 'No lobbyInstance found.' });
    } catch (err) {
      res.status(500).json({ lobbyInstance: 'Something went wrong.' });
    }

    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/user/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update that user in that lobbyInstance.' });
    }

    let index;
    const userFound = req.lobbyInstance.members.filter((u, i) => {
      if(u.id === req.body.userId) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in lobbyInstance' });
    }

    req.lobbyInstance.members[index] = { ...req.lobbyInstance.members[index], ...req.body.user}
    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/undo/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  const isParticipant = req.lobbyInstance.invitedUsers.some((user) => {
    return user.id === req.user.id
  })

  if (!(req.user.role === 'ADMIN' || isParticipant)) {
    return res.status(400).json({ message: 'You do not have permission to undo in that lobbyInstance.' });
  }

  req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UNDO);
  
  res.status(200).json({});
})


router.put('/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {

    // if(req.lobbyInstance.isGamePoweredOn && req.body.game?.id) {
    //   return res.status(400).json({ message: 'You cannot change the editing game id of a lobbyInstance when game is powered on' });
    // }

    // actually currently needed to be able to switch while game is on to function
    // if(req.lobbyInstance.isGamePoweredOn && req.body.currentGameId) {
    //   return res.status(400).json({ message: 'You cannot change the current game id of a lobbyInstance when game is powered on' });
    // }

    // if(req.body.isGamePoweredOn && req.user.role !== 'ADMIN') {
    //   return res.status(400).json({ message: 'You do not have privelages to power on this game.' });
    // }

    Object.assign(req.lobbyInstance,req.body)

    const updatedLobbyInstance = await LobbyInstance.findByIdAndUpdate(
      req.params.id,
      { 
        invitedUsers: req.lobbyInstance.invitedUsers.map(({id}) => {
          return id
        }),
        startTime: req.lobbyInstance.startTime,
        participantId: req.lobbyInstance.participantId,
        guideId: req.lobbyInstance.guideId,
        editingGameId: req.lobbyInstance.editingGameId,
        gameRoomInstanceId: req.lobbyInstance.gameRoomInstanceId
      },
      { new: true },
    );

    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
