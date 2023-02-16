import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import User from '../../models/User';

import { ON_GAME_SESSION_UPDATE, ADMIN_ROOM_PREFIX, GAME_SESSIONS_STORE } from '../../constants';
import GameSession from '../../models/GameSession';

const router = Router();

function requireGameSessions(req, res, next) {
  req.gameSessions = req.app.get(GAME_SESSIONS_STORE);
  next()
}

function requireGameSession(req, res, next) {
  let index

  const gameSessions = req.app.get(GAME_SESSIONS_STORE);
  req.gameSessions = gameSessions

  if(!gameSessions) {
    res.status(400).json({ message: 'No game sessions found. Looking for gameSession with id: ' + req.params.id });
  }

  const gameSessionFound = gameSessions?.filter((l, i) => {
    if(l.id.toString() === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })[0]

  if(!gameSessionFound) {
    res.status(400).json({ message: 'No gameSession found with id: ' + req.params.id });
    return 
  }

  req.gameSession = gameSessionFound
  req.gameSessionIndex = index
  next()
}

router.get('/', requireGameSessions, async (req, res) => {
  try {    
    res.json({
      gameSessions: req.gameSessions
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.get('/:id', requireGameSession, async (req, res) => {
  try {
    res.json({ gameSession: req.gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});;

router.post('/:id/message', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
  req.gameSession.messages.push({
    user: {
      id: req.user.id,
      username: req.user.username
    },
    message: req.body.message,
    automated: req.body.automated
  })

  req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
  res.status(200).json({ gameSession: req.gameSession });
})

router.post('/:id/clearMessages', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
  req.gameSession.messages = []
  req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
  res.status(200).json({ gameSession: req.gameSession });
})

router.post('/', requireJwtAuth, requireGameSessions, async (req, res) => {
  try {
    let gameSession = await GameSession.create({
      players: req.body.players,
      hostUserId: req.body.hostUserId,
      gameId: req.body.gameId,

      isSaveDisabled: req.body.isSaveDisabled,
      isEdit: req.body.isEdit,
      isNetworked: req.body.isNetworked,
    });

    gameSession = await gameSession.populate('players').execPopulate();

    gameSession = gameSession.toJSON()

    gameSession.players = gameSession.players.map((user) => {
      return {
        email: user.email,
        id: user.id,
        username: user.username,
        role: user.role,
        joined: false,
        connected: false,
      }
    })

    gameSession.resetDate = Date.now()
    gameSession.messages = []
    gameSession.gameState = 'PLAY_STATE'

    req.gameSessions.push(gameSession)

    res.status(200).json({ gameSession: gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to remove user from that gameSession.' });
    }

    // let index;
    const userFound = req.gameSession.players.filter((u, i) => {
      if(u.id === req.body.userId) {
        // index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in gameSession' });
    }

    userFound.joined = false

    req.gameSession.messages.push({
      user: {
        id: userFound.id,
        username: userFound.username
      },
      automated: true,
      message: 'has left the gameSession',
    })

    req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
    req.socket.leave(req.gameSession.id)
    if(req.user.role === 'ADMIN') req.socket.leave(ADMIN_ROOM_PREFIX + req.gameSession.id);
    res.status(200).json({ gameSession: req.gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


// Assign userId to playerId?
// a Player should be assigned perhaps an object Instance Id? 
// this is how you assign yourself to another object instance?

// router.post('/assign/:id', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
//   if (!(req.user.role === 'ADMIN' || req.user.id === req.body.userId)) {
//     return res.status(400).json({ message: 'You do not have privelages to assign that role.' });
//   }

//   const userFound = req.gameSession.players.filter((u, i) => {
//     if(u.id === req.body.userId) {
//       return true
//     } else {
//       return false
//     }
//   })[0]

//   if(req.gameSession.isPoweredOn) {
//     return res.status(400).json({ message: 'You cannot assign a role when the gameSession game is powered on' });
//   }

//   if(req.body.role === 'gameHost') {
//     if(req.body.userId === 'unassigned') {
//       req.gameSession.hostUserId = null
//     } else {
//       req.gameSession.hostUserId = req.body.userId
//     }

//   }

//   if(req.body.role === 'player') {
//     if(req.body.userId === 'unassigned') {
//       req.gameSession.playerId = null
//     } else {
//       req.gameSession.playerId = req.body.userId
//     }
//   }

//   if(req.body.role === 'guide') {
//     if(req.body.userId === 'unassigned') {
//       req.gameSession.guideId = null
//     } else {
//       const user = await User.findById(req.body.userId)
//       if(user.role == 'ADMIN') {
//         req.gameSession.guideId = req.body.userId
//       } else {
//         return res.status(400).json({ message: 'Guide must be admin role' });
//       }
//     }
//   }

//   const updatedGameSession = await GameSession.findByIdAndUpdate(
//     req.params.id,
//     { 
//       hostUserId: req.gameSession.hostUserId,
//       playerId: req.gameSession.playerId,
//       guideId: req.gameSession.guideId,
//     },
//     { new: true },
//   );

//   // if(!userFound) {
//   //   return res.status(400).json({ message: 'You are not a member of this gameSession' });
//   // }

//   req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
//   return res.status(200).json({ gameSession: req.gameSession });
// })

router.post('/join/:id', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
  try {
    const userFound = req.gameSession.players.filter((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]


    if(userFound) {

      req.gameSession.messages.push({
        user: {
          id: userFound.id,
          username: userFound.username
        },
        message: 'has re-joined the gameSession',
        automated: true
      })
      
      req.socket.join(req.gameSession.id);
      if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX + req.gameSession.id);
      userFound.joined = true;
      req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
      return res.status(200).json({ gameSession: req.gameSession });
    }


    // security... lobby can set the game session stuff

    // const isParticipant = req.gameSession.players.some((user) => {
    //   return user.id === req.user.id
    // })

    // if (!(req.user.role === 'ADMIN' || isParticipant)) {
    //   return res.status(400).json({ message: 'You do not have permission to join that gameSession.' });
    // }

    // generate a gameSession formatted user
    const newGameSessionPlayer = { 
      email: req.user.email,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      connected: true
    }

    req.gameSession.messages.push({
      user: {
        id: newGameSessionPlayer.id,
        username: newGameSessionPlayer.username
      },
      message: 'has connected',
      automated: true
    })
    req.gameSession.messages.push({
      user: {
        id: newGameSessionPlayer.id,
        username: newGameSessionPlayer.username
      },
      message: 'has joined the gameSession',
      automated: true
    })
      

    // listen for all of this game sessions events
    req.socket.join(req.gameSession.id);
    if(req.user.role === 'ADMIN') req.socket.join(ADMIN_ROOM_PREFIX+req.gameSession.id);

    // remove from all other game sessions
    req.gameSessions.forEach((gameSession) => {
      let index;
      gameSession.players.forEach((user, i) => {
        if(newGameSessionPlayer.id === user.id) {
          index = i
        }
      })
      if(index >= -1) {
        gameSession.players.splice(index, 1)
        req.socket.leave(gameSession.id);
        req.io.to(gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: gameSession});
      }
    })

    // add to new gameSession
    req.gameSession.players.push(newGameSessionPlayer)

    // update the game sessions with this information
    req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
    return res.status(200).json({ gameSession: req.gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
});

router.delete('/:id', requireJwtAuth, requireGameSession, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to delete that gameSession.' });
    }

    try {
      const gameSession = await GameSession.findByIdAndRemove(req.params.id).populate('players');
      req.gameSessions.splice(req.gameSessionIndex, 1);
      if (!gameSession) return res.status(404).json({ game: 'No game found.' });
    } catch (err) {
      res.status(500).json({ game: 'Something went wrong.' });
    }

    res.status(200).json({ gameSession: req.gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


router.put('/user/:id', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update that user in that gameSession.' });
    }

    let index;
    const userFound = req.gameSession.players.filter((u, i) => {
      if(u.id === req.body.userId) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userId + ' found in gameSession' });
    }

    req.gameSession.players[index] = { ...req.gameSession.players[index], ...req.body.user}
    req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
    res.status(200).json({ gameSession: req.gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

// router.post('/undo/:id', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
//   const isParticipant = req.gameSession.players.some((user) => {
//     return user.id === req.user.id
//   })

//   if (!(req.user.role === 'ADMIN' || isParticipant)) {
//     return res.status(400).json({ message: 'You do not have permission to undo in that gameSession.' });
//   }

//   req.io.to(req.gameSession.id).emit(ON_LOBBY_UNDO);
  
//   res.status(200).json({});
// })

router.put('/:id', requireJwtAuth, requireGameSession, requireSocketAuth, async (req, res) => {
  try {
    if(req.body.isPoweredOn && req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to power on this game.' });
    }

    Object.assign(req.gameSession,req.body)

    const updatedGameSession = await GameSession.findByIdAndUpdate(
      req.params.id,
      { 
        players: req.gameSession.players.map(({id}) => {
          return id
        }),
        gameState: req.gameSession.gameState,
        hostUserId: req.gameSession.hostUserId,
      },
      { new: true },
    );

    req.io.to(req.gameSession.id).emit(ON_GAME_SESSION_UPDATE, {gameSession: req.gameSession});
    res.status(200).json({ gameSession: req.gameSession });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
