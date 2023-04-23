import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';
import { generateUniqueId } from '../../utils/utils';

import { ON_GAME_ROOM_INSTANCE_UPDATE, ADMIN_ROOM_PREFIX, GAME_ROOMS_STORE, GAME_ROOM_INSTANCE_DID } from '../../constants';
import GameRoomInstance from '../../models/GameRoomInstance';
import { mergeDeep } from '../../utils/utils';

const router = Router();

function requireGameRoomInstances(req, res, next) {
  req.gameRoomInstances = req.app.get(GAME_ROOMS_STORE);
  next()
}

function requireGameRoomInstance(req, res, next) {
  let index

  const gameRoomInstances = req.app.get(GAME_ROOMS_STORE);
  req.gameRoomInstances = gameRoomInstances

  if(!gameRoomInstances) {
    res.status(400).json({ message: 'No game sessions found. Looking for gameRoomInstance with gameRoomInstanceId ' + req.params.id });
  }

  const gameRoomInstanceFound = gameRoomInstances?.find((gameRoomInstance, i) => {
    if(gameRoomInstance.id.toString() === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })

  if(!gameRoomInstanceFound) {
    res.status(400).json({ message: 'No gameRoomInstance found with gameRoomInstanceId ' + req.params.id });
    return 
  }

  req.gameRoomInstance = gameRoomInstanceFound
  req.gameRoomInstanceIndex = index
  next()
}

router.get('/', requireGameRoomInstances, async (req, res) => {
  try {    
    res.json({
      gameRoomInstances: req.gameRoomInstances
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/:id', requireGameRoomInstance, async (req, res) => {
  try {
    res.json({ gameRoomInstance: req.gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});;

router.get('/gameRoomInstanceId/:gameRoomInstanceId', async (req, res) => {
  try {
    const gameRoomInstance = await GameRoomInstance.findOne({ gameRoomInstanceId: req.params.gameRoomInstanceId }).populate('owner');
    if (!gameRoomInstance) return res.status(404).json({ message: 'No gameRoomInstance found.' });
    res.json({ gameRoomInstance: gameRoomInstance.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/:id/message', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  req.gameRoomInstance.messages.push({
    user: {
      userMongoId: req.user.id,
      username: req.user.username
    },
    message: req.body.message,
    automated: req.body.automated
  })

  req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
  res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
})

router.post('/:id/clearMessages', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  req.gameRoomInstance.messages = []
  req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
  res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
})

router.post('/', requireJwtAuth, requireGameRoomInstances, async (req, res) => {
  try {
    let gameRoomInstance = await GameRoomInstance.create({
      invitedUsers: req.body.invitedUsers,
      hostUserMongoId: req.body.hostUserMongoId,
      arcadeGameMongoId: req.body.arcadeGameMongoId,
      isAutosaveDisabled: req.body.isAutosaveDisabled,
      isEdit: req.body.isEdit,
      isOnlineMultiplayer: req.body.isOnlineMultiplayer,
      name: req.body.name,
      gameInstanceIds: req.body.gameInstanceIds,
      experienceInstanceId: req.body.experienceInstanceId,
      gameRoomInstanceId: GAME_ROOM_INSTANCE_DID + generateUniqueId(),
    });

    gameRoomInstance = await gameRoomInstance.populate('invitedUsers').execPopulate();

    gameRoomInstance = gameRoomInstance.toJSON()

    gameRoomInstance.members = gameRoomInstance.invitedUsers.map((user) => {
      return {
        email: user.email,
        userMongoId: user.id,
        username: user.username,
        role: user.role,
        joinedGameRoomInstanceMongoId: null,
        connected: false,
      }
    })

    gameRoomInstance.resetDate = Date.now()
    gameRoomInstance.messages = []
    gameRoomInstance.isPoweredOn = true
    gameRoomInstance.gameState = 'PLAY_STATE'

    req.gameRoomInstances.push(gameRoomInstance)

    res.status(200).json({ gameRoomInstance: gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userMongoId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to remove user from that gameRoomInstance.' });
    }

    // let index;
    const userFound = req.gameRoomInstance.members.find((u, i) => {
      if(u.userMongoId === req.body.userMongoId) {
        // index = i
        return true
      } else {
        return false
      }
    })

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userMongoId + ' found in gameRoomInstance' });
    }

    userFound.joinedGameRoomInstanceMongoId = null
    userFound.loadedGameMongoId = null

    req.gameRoomInstance.messages.push({
      user: {
        userMongoId: userFound.id,
        username: userFound.username
      },
      automated: true,
      message: 'has left the gameRoomInstance',
    })

    req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
    req.socket.leave(req.gameRoomInstance.id)
    if(req.user.role === 'ADMIN') req.socket.leave(ADMIN_ROOM_PREFIX + req.gameRoomInstance.id);
    res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


// Assign userMongoId to playerId?
// a Player should be assigned perhaps an object Instance Id? 
// this is how you assign yourself to another object instance?

// router.post('/assign/:id', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
//   if (!(req.user.role === 'ADMIN' || req.user.id === req.body.userMongoId)) {
//     return res.status(400).json({ message: 'You do not have privelages to assign that role.' });
//   }

//   const userFound = req.gameRoomInstance.invitedUsers.find((u, i) => {
//     if(u.userMongoId === req.body.userMongoId) {
//       return true
//     } else {
//       return false
//     }
//   })

//   if(req.gameRoomInstance.isPoweredOn) {
//     return res.status(400).json({ message: 'You cannot assign a role when the gameRoomInstance game is powered on' });
//   }

//   if(req.body.role === 'gameHost') {
//     if(req.body.userMongoId === 'unassigned') {
//       req.gameRoomInstance.hostUserMongoId = null
//     } else {
//       req.gameRoomInstance.hostUserMongoId = req.body.userMongoId
//     }

//   }

//   if(req.body.role === 'player') {
//     if(req.body.userMongoId === 'unassigned') {
//       req.gameRoomInstance.playerId = null
//     } else {
//       req.gameRoomInstance.playerId = req.body.userMongoId
//     }
//   }

//   if(req.body.role === 'guide') {
//     if(req.body.userMongoId === 'unassigned') {
//       req.gameRoomInstance.guideId = null
//     } else {
//       const user = await User.findById(req.body.userMongoId)
//       if(user.role == 'ADMIN') {
//         req.gameRoomInstance.guideId = req.body.userMongoId
//       } else {
//         return res.status(400).json({ message: 'Guide must be admin role' });
//       }
//     }
//   }

//   const updatedGameRoomInstance = await GameRoomInstance.findByIdAndUpdate(
//     req.params.id,
//     { 
//       hostUserMongoId: req.gameRoomInstance.hostUserMongoId,
//       playerId: req.gameRoomInstance.playerId,
//       guideId: req.gameRoomInstance.guideId,
//     },
//     { new: true },
//   );

//   // if(!userFound) {
//   //   return res.status(400).json({ message: 'You are not a member of this gameRoomInstance' });
//   // }

//   req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
//   return res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
// })

router.post('/join/:id', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  try {
    const userFound = req.gameRoomInstance.members.find((u, i) => {
      if(u.userMongoId === req.user.id) {
        return true
      } else {
        return false
      }
    })


    if(userFound) {

      req.gameRoomInstance.messages.push({
        user: {
          userMongoId: userFound.id,
          username: userFound.username
        },
        message: 'has re-joined the gameRoomInstance',
        automated: true
      })
      
      req.socket.join(req.gameRoomInstance.id);
      if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX + req.gameRoomInstance.id);
      userFound.joinedGameRoomInstanceMongoId = req.gameRoomInstance.id;
      req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
      return res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
    }


    // security... lobby can set the game session stuff

    // const isParticipant = req.gameRoomInstance.members.some((user) => {
    //   return user.id === req.user.id
    // })

    // if (!(req.user.role === 'ADMIN' || isParticipant)) {
    //   return res.status(400).json({ message: 'You do not have permission to join that gameRoomInstance.' });
    // }

    // generate a gameRoomInstance formatted user
    const newGameRoomInstanceMember = { 
      email: req.user.email,
      userMongoId: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joinedGameRoomInstanceMongoId: req.gameRoomInstance.id,
      connected: true
    }

    req.gameRoomInstance.messages.push({
      user: {
        userMongoId: newGameRoomInstanceMember.userMongoId,
        username: newGameRoomInstanceMember.username
      },
      message: 'has connected',
      automated: true
    })
    req.gameRoomInstance.messages.push({
      user: {
        userMongoId: newGameRoomInstanceMember.userMongoId,
        username: newGameRoomInstanceMember.username
      },
      message: 'has joined the gameRoomInstance',
      automated: true
    })
      

    // listen for all of this game sessions events
    req.socket.join(req.gameRoomInstance.id);
    if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.gameRoomInstance.id);

    // remove for now
    // remove from all other game sessions
    req.gameRoomInstances.forEach((gameRoomInstance) => {
      let index;
      gameRoomInstance.members.forEach((user, i) => {
        if(newGameRoomInstanceMember.userMongoId === user.userMongoId) {
          index = i
        }
      })
      if(index >= -1) {
        // gameRoomInstance.members.splice(index, 1)
        const member = gameRoomInstance.members[index]
        member.joinedGameRoomInstanceMongoId = null
        member.loadedGameMongoId = null
        gameRoomInstance.messages.push({
          user: {
            userMongoId: member.userMongoId,
            username: member.username
          },
          message: 'has joined another gameRoomInstance',
          automated: true
        })
        req.socket.leave(gameRoomInstance.id);
        req.io.to(gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: gameRoomInstance});
      }
    })

    // add to new gameRoomInstance
    req.gameRoomInstance.members.push(newGameRoomInstanceMember)

    // update the game sessions with this information
    req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
    return res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
});

router.delete('/:id', requireJwtAuth, requireGameRoomInstance, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to delete that gameRoomInstance.' });
    }

    try {
      const gameRoomInstance = await GameRoomInstance.findByIdAndRemove(req.params.id).populate('invitedUsers');
      req.gameRoomInstances.splice(req.gameRoomInstanceIndex, 1);
      if (!gameRoomInstance) return res.status(404).json({ game: 'No game found.' });
    } catch (err) {
      res.status(500).json({ game: 'Something went wrong.' });
    }

    res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


router.put('/user/:id', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userMongoId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update that user in that gameRoomInstance.' });
    }

    let index;
    const userFound = req.gameRoomInstance.members.find((user, i) => {
      if(user.userMongoId === req.body.userMongoId) {
        index = i
        return true
      } else {
        return false
      }
    })

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userMongoId + ' found in gameRoomInstance' });
    }

    req.gameRoomInstance.members[index] = { ...req.gameRoomInstance.members[index], ...req.body.user}
    req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
    res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/undo/:id', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  const isParticipant = req.gameRoomInstance.invitedUsers.some((user) => {
    return user.id === req.user.id
  })

  if (!(req.user.role === 'ADMIN' || isParticipant)) {
    return res.status(400).json({ message: 'You do not have permission to undo in that gameRoomInstance.' });
  }

  req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UNDO);
  
  res.status(200).json({});
})

router.put('/:id', requireJwtAuth, requireGameRoomInstance, requireSocketAuth, async (req, res) => {
  try {
    if(req.body.isPoweredOn && req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to power on this game.' });
    }

    mergeDeep(req.gameRoomInstance, req.body)

    const updatedGameRoomInstance = await GameRoomInstance.findByIdAndUpdate(
      req.params.id,
      { 
        invitedUsers: req.gameRoomInstance.invitedUsers.map(({id}) => {
          return id
        }),
        gameInstanceIds: req.gameRoomInstance.gameInstanceIds,
        gameState: req.gameRoomInstance.gameState,
        hostUserMongoId: req.gameRoomInstance.hostUserMongoId,
      },
      { new: true },
    );

    req.io.to(req.gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance: req.gameRoomInstance});
    res.status(200).json({ gameRoomInstance: req.gameRoomInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
