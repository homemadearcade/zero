import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';
import { generateUniqueId } from '../../utils/utils';

import User from '../../models/User';

import { ON_GAME_ROOM_UPDATE, ADMIN_ROOM_PREFIX, GAME_ROOMS_STORE, GAME_ROOM_INSTANCE_ID_PREFIX } from '../../constants';
import GameRoom from '../../models/GameRoom';

const router = Router();

function requireGameRooms(req, res, next) {
  req.gameRooms = req.app.get(GAME_ROOMS_STORE);
  next()
}

function requireGameRoom(req, res, next) {
  let index

  const gameRooms = req.app.get(GAME_ROOMS_STORE);
  req.gameRooms = gameRooms

  if(!gameRooms) {
    res.status(400).json({ message: 'No game sessions found. Looking for gameRoom with id: ' + req.params.id });
  }

  const gameRoomFound = gameRooms?.find((l, i) => {
    if(l.id.toString() === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })

  if(!gameRoomFound) {
    res.status(400).json({ message: 'No gameRoom found with id: ' + req.params.id });
    return 
  }

  req.gameRoom = gameRoomFound
  req.gameRoomIndex = index
  next()
}

router.get('/', requireGameRooms, async (req, res) => {
  try {    
    res.json({
      gameRooms: req.gameRooms
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/:id', requireGameRoom, async (req, res) => {
  try {
    res.json({ gameRoom: req.gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});;

router.post('/:id/message', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
  req.gameRoom.messages.push({
    user: {
      id: req.user.id,
      username: req.user.username
    },
    message: req.body.message,
    automated: req.body.automated
  })

  req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
  res.status(200).json({ gameRoom: req.gameRoom });
})

router.post('/:id/clearMessages', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
  req.gameRoom.messages = []
  req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
  res.status(200).json({ gameRoom: req.gameRoom });
})

router.post('/', requireJwtAuth, requireGameRooms, async (req, res) => {
  try {
    let gameRoom = await GameRoom.create({
      invitedUsers: req.body.invitedUsers,
      hostUserId: req.body.hostUserId,
      gameId: req.body.gameId,

      isAutosaveDisabled: req.body.isAutosaveDisabled,
      isEdit: req.body.isEdit,
      isNetworked: req.body.isNetworked,
      gameRoomInstanceShortId: GAME_ROOM_INSTANCE_ID_PREFIX + generateUniqueId(),
    });

    gameRoom = await gameRoom.populate('invitedUsers').execPopulate();

    gameRoom = gameRoom.toJSON()

    gameRoom.members = gameRoom.invitedUsers.map((user) => {
      return {
        email: user.email,
        id: user.id,
        username: user.username,
        role: user.role,
        joined: false,
        connected: false,
      }
    })

    gameRoom.resetDate = Date.now()
    gameRoom.messages = []
    gameRoom.gameState = 'PLAY_STATE'

    req.gameRooms.push(gameRoom)

    res.status(200).json({ gameRoom: gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to remove user from that gameRoom.' });
    }

    // let index;
    const userFound = req.gameRoom.members.find((u, i) => {
      if(u.id === req.body.userId) {
        // index = i
        return true
      } else {
        return false
      }
    })

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in gameRoom' });
    }

    userFound.joined = false

    req.gameRoom.messages.push({
      user: {
        id: userFound.id,
        username: userFound.username
      },
      automated: true,
      message: 'has left the gameRoom',
    })

    req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
    req.socket.leave(req.gameRoom.id)
    if(req.user.role === 'ADMIN') req.socket.leave(ADMIN_ROOM_PREFIX + req.gameRoom.id);
    res.status(200).json({ gameRoom: req.gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


// Assign userId to playerId?
// a Player should be assigned perhaps an object Instance Id? 
// this is how you assign yourself to another object instance?

// router.post('/assign/:id', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
//   if (!(req.user.role === 'ADMIN' || req.user.id === req.body.userId)) {
//     return res.status(400).json({ message: 'You do not have privelages to assign that role.' });
//   }

//   const userFound = req.gameRoom.invitedUsers.find((u, i) => {
//     if(u.id === req.body.userId) {
//       return true
//     } else {
//       return false
//     }
//   })

//   if(req.gameRoom.isPoweredOn) {
//     return res.status(400).json({ message: 'You cannot assign a role when the gameRoom game is powered on' });
//   }

//   if(req.body.role === 'gameHost') {
//     if(req.body.userId === 'unassigned') {
//       req.gameRoom.hostUserId = null
//     } else {
//       req.gameRoom.hostUserId = req.body.userId
//     }

//   }

//   if(req.body.role === 'player') {
//     if(req.body.userId === 'unassigned') {
//       req.gameRoom.playerId = null
//     } else {
//       req.gameRoom.playerId = req.body.userId
//     }
//   }

//   if(req.body.role === 'guide') {
//     if(req.body.userId === 'unassigned') {
//       req.gameRoom.guideId = null
//     } else {
//       const user = await User.findById(req.body.userId)
//       if(user.role == 'ADMIN') {
//         req.gameRoom.guideId = req.body.userId
//       } else {
//         return res.status(400).json({ message: 'Guide must be admin role' });
//       }
//     }
//   }

//   const updatedGameRoom = await GameRoom.findByIdAndUpdate(
//     req.params.id,
//     { 
//       hostUserId: req.gameRoom.hostUserId,
//       playerId: req.gameRoom.playerId,
//       guideId: req.gameRoom.guideId,
//     },
//     { new: true },
//   );

//   // if(!userFound) {
//   //   return res.status(400).json({ message: 'You are not a member of this gameRoom' });
//   // }

//   req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
//   return res.status(200).json({ gameRoom: req.gameRoom });
// })

router.post('/join/:id', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
  try {
    const userFound = req.gameRoom.members.find((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })


    if(userFound) {

      req.gameRoom.messages.push({
        user: {
          id: userFound.id,
          username: userFound.username
        },
        message: 'has re-joined the gameRoom',
        automated: true
      })
      
      req.socket.join(req.gameRoom.id);
      if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX + req.gameRoom.id);
      userFound.joined = true;
      req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
      return res.status(200).json({ gameRoom: req.gameRoom });
    }


    // security... lobby can set the game session stuff

    // const isParticipant = req.gameRoom.members.some((user) => {
    //   return user.id === req.user.id
    // })

    // if (!(req.user.role === 'ADMIN' || isParticipant)) {
    //   return res.status(400).json({ message: 'You do not have permission to join that gameRoom.' });
    // }

    // generate a gameRoom formatted user
    const newGameRoomMember = { 
      email: req.user.email,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      connected: true
    }

    req.gameRoom.messages.push({
      user: {
        id: newGameRoomMember.id,
        username: newGameRoomMember.username
      },
      message: 'has connected',
      automated: true
    })
    req.gameRoom.messages.push({
      user: {
        id: newGameRoomMember.id,
        username: newGameRoomMember.username
      },
      message: 'has joined the gameRoom',
      automated: true
    })
      

    // listen for all of this game sessions events
    req.socket.join(req.gameRoom.id);
    if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.gameRoom.id);

    // remove for now
    // remove from all other game sessions
    req.gameRooms.forEach((gameRoom) => {
      let index;
      gameRoom.members.forEach((user, i) => {
        if(newGameRoomMember.id === user.id) {
          index = i
        }
      })
      if(index >= -1) {
        // gameRoom.members.splice(index, 1)
        const member = gameRoom.members[index]
        member.joined = false
        gameRoom.messages.push({
          user: {
            id: member.id,
            username: member.username
          },
          message: 'has joined another gameRoom',
          automated: true
        })
        req.socket.leave(gameRoom.id);
        req.io.to(gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: gameRoom});
      }
    })

    // add to new gameRoom
    req.gameRoom.members.push(newGameRoomMember)

    // update the game sessions with this information
    req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
    return res.status(200).json({ gameRoom: req.gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
});

router.delete('/:id', requireJwtAuth, requireGameRoom, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to delete that gameRoom.' });
    }

    try {
      const gameRoom = await GameRoom.findByIdAndRemove(req.params.id).populate('invitedUsers');
      req.gameRooms.splice(req.gameRoomIndex, 1);
      if (!gameRoom) return res.status(404).json({ game: 'No game found.' });
    } catch (err) {
      res.status(500).json({ game: 'Something went wrong.' });
    }

    res.status(200).json({ gameRoom: req.gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


router.put('/user/:id', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update that user in that gameRoom.' });
    }

    let index;
    const userFound = req.gameRoom.members.find((u, i) => {
      if(u.id === req.body.userId) {
        index = i
        return true
      } else {
        return false
      }
    })

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in gameRoom' });
    }

    req.gameRoom.members[index] = { ...req.gameRoom.members[index], ...req.body.user}
    req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
    res.status(200).json({ gameRoom: req.gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

// router.post('/undo/:id', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
//   const isParticipant = req.gameRoom.invitedUsers.some((user) => {
//     return user.id === req.user.id
//   })

//   if (!(req.user.role === 'ADMIN' || isParticipant)) {
//     return res.status(400).json({ message: 'You do not have permission to undo in that gameRoom.' });
//   }

//   req.io.to(req.gameRoom.id).emit(ON_LOBBY_UNDO);
  
//   res.status(200).json({});
// })

router.put('/:id', requireJwtAuth, requireGameRoom, requireSocketAuth, async (req, res) => {
  try {
    if(req.body.isPoweredOn && req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to power on this game.' });
    }

    Object.assign(req.gameRoom,req.body)

    const updatedGameRoom = await GameRoom.findByIdAndUpdate(
      req.params.id,
      { 
        invitedUsers: req.gameRoom.invitedUsers.map(({id}) => {
          return id
        }),
        gameState: req.gameRoom.gameState,
        hostUserId: req.gameRoom.hostUserId,
      },
      { new: true },
    );

    req.io.to(req.gameRoom.id).emit(ON_GAME_ROOM_UPDATE, {gameRoom: req.gameRoom});
    res.status(200).json({ gameRoom: req.gameRoom });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
