import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import User from '../../models/User';

import { ON_LOBBY_INSTANCE_UPDATE, ADMIN_ROOM_PREFIX, LOBBY_INSTANCE_STORE, LOBBY_INSTANCE_DID } from '../../constants';
import LobbyInstance from '../../models/LobbyInstance';
import { generateUniqueId, mergeDeep } from '../../utils/utils';
import { updateUserAppLocation } from '../../utils/appLocation';
import { APP_ADMIN_ROLE } from "../../constants/index";

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
    res.status(400).json({ message: 'No lobbies found. Looking for lobbyInstance with lobbyInstanceId ' + req.params.id });
  }

  const lobbyInstanceFound = lobbyInstances?.filter((lobbyInstance, i) => {
    if(lobbyInstance.id.toString() === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })[0]

  if(!lobbyInstanceFound) {
    res.status(400).json({ message: 'No lobbyInstance found with  lobbyInstanceId ' + req.params.id });
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

router.get('/lobbyInstanceId/:lobbyInstanceId', async (req, res) => {
  try {
    const lobbyInstance = await LobbyInstance.findOne({ lobbyInstanceId: req.params.lobbyInstanceId }).populate('owner invitedUsers gameRoomInstances');
    if (!lobbyInstance) return res.status(404).json({ message: 'No lobbyInstance found.' });
    res.json({ lobbyInstance: lobbyInstance.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
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
      userMongoId: req.user.id,
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
      name: req.body.name,
      startTime: req.body.startTime,
      activitys: req.body.activitys,
      roleIdToUserMongoIds: req.body.roleIdToUserMongoIds,
      roles: req.body.roles,
      currentActivityId: req.body.currentActivityId,
      cobrowsingUserMongoId: req.body.cobrowsingUserMongoId,
      experienceInstanceId: req.body.experienceInstanceId,
      experienceModelMongoId: req.body.experienceModelMongoId,
      gameRoomInstances: req.body.gameRoomInstances,
      instructionCurrentSteps: req.body.instructionCurrentSteps,
      instructions: req.body.instructions,
      instructionsByRoleId: req.body.instructionsByRoleId,
      usersMustWaitInLine: req.body.usersMustWaitInLine,
      invitedUsers: req.body.invitedUsers,
      memberStorage: req.body.memberStorage,
      hostUserMongoId: req.body.hostUserMongoId,
      lobbyId: req.body.lobbyId,
      lobbyInstanceId: LOBBY_INSTANCE_DID + generateUniqueId()
    });

    lobbyInstance = await lobbyInstance.populate('invitedUsers gameRoomInstances').execPopulate();

    lobbyInstance = lobbyInstance.toJSON()

    lobbyInstance.members = lobbyInstance.invitedUsers.map((user) => {
      return {
        email: user.email,
        userMongoId: user.id,
        username: user.username,
        role: user.role,
      }
    })

    lobbyInstance.usersInLine = []

    lobbyInstance.messages = []

    req.lobbyInstances.push(lobbyInstance)

    res.status(200).json({ lobbyInstances: req.lobbyInstances });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/leave/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userMongoId === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
      return res.status(400).json({ message: 'You do not have privelages to remove user from that lobbyInstance.' });
    }

    // let index;
    const memberFound = req.lobbyInstance.members.filter((member, i) => {
      if(member.userMongoId === req.body.userMongoId) {
        // index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!memberFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userMongoId + ' found in lobbyInstance' });
    }

    memberFound.joined = false

    req.lobbyInstance.messages.push({
      user: {
        userMongoId: memberFound.id,
        username: memberFound.username
      },
      automated: true,
      message: 'has left the lobby',
    })

    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    req.socket.leave(req.lobbyInstance.id)
    if(req.user.roles[APP_ADMIN_ROLE]) req.socket.leave(ADMIN_ROOM_PREFIX+req.lobbyInstance.id);
    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/assign/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  if (!(req.user.roles[APP_ADMIN_ROLE] || req.user.id === req.body.userMongoId)) {
    return res.status(400).json({ message: 'You do not have privelages to assign that role.' });
  }

  if(!req.body.roleIdToUserMongoIds[req.body.roleId]) req.body.roleIdToUserMongoIds[req.body.roleId] = []
  req.body.roleIdToUserMongoIds[req.body.roleId].push(req.body.userMongoId)

  const updatedLobbyInstance = await LobbyInstance.findByIdAndUpdate(
    req.params.id,
    { 
      roleIdToUserMongoIds: req.body.roleIdToUserMongoIds
    },
    { new: true },
  );

  // if(!memberFound) {
  //   return res.status(400).json({ message: 'You are not a member of this lobbyInstance' });
  // }

  req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: updatedLobbyInstance});
  return res.status(200).json({ lobbyInstance: req.lobbyInstance });
})


router.post('/enter_line/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    // generate a lobbyInstance formatted user
    const userInLine = { 
      email: req.user.email,
      userMongoId: req.user.id,
      username: req.user.username,
      role: req.user.role,
      dateEntered: new Date()
    }

    req.lobbyInstance.messages.push({
      user: {
        userMongoId: userInLine.userMongoId,
        username: userInLine.username
      },
      message: 'has entered the line',
      automated: true,
    })

    // add to new lobbyInstance
    req.lobbyInstance.usersInLine.push(userInLine)

    // update the lobbies with this information
    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    return res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
});

router.post('/member_storage/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    res.status(200).json({ lobbyInstance: req.lobbyInstance });
    req.lobbyInstance.memberStorage[req.body.userMongoId] = { ...req.lobbyInstance.memberStorage[index], ...req.body.memberStorage}
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong: ' + err });
  }
})

router.post('/leave_line/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    let index;
    const userInLineFound = req.lobbyInstance.usersInLines.filter((userInLine, i) => {
      if(userInLine.userMongoId === req.body.userMongoId) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userInLineFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userMongoId + ' found in lobbyInstance' });
    }

    lobbyInstance.usersInLine.splice(index, 1)

    req.lobbyInstance.messages.push({
      user: {
        userMongoId: userInLineFound.id,
        username: userInLineFound.username
      },
      automated: true,
      message: 'has left the line',
    })

    req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


router.post('/join/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    const memberFound = req.lobbyInstance.members.filter((member, i) => {
      if(member.userMongoId === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]


    if(memberFound) {
      memberFound.joined = true
      req.lobbyInstance.messages.push({
        user: {
          userMongoId: memberFound.userMongoId,
          username: memberFound.username
        },
        message: 'has re-joined the lobby',
        automated: true
      })
      
      req.socket.join(req.lobbyInstance.id);
      if(req.user.roles[APP_ADMIN_ROLE]) req.socket.join(ADMIN_ROOM_PREFIX+req.lobbyInstance.id);
      updateUserAppLocation({
        userMongoId: memberFound.userMongoId,
        authenticatedUser: req.user,
        experienceInstanceId: req.lobbyInstance.experienceInstanceId,
        lobbyInstanceMongoId: req.lobbyInstance.id,
      })

      req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
      return res.status(200).json({ lobbyInstance: req.lobbyInstance });
    }

    const isParticipant = req.lobbyInstance.invitedUsers.some((user) => {
      return user.id === req.user.id
    })

    if (!(req.user.roles[APP_ADMIN_ROLE] || isParticipant)) {
      return res.status(400).json({ message: 'You do not have permission to join that lobbyInstance.' });
    }

    // generate a lobbyInstance formatted user
    const newLobbyInstanceMember = { 
      email: req.user.email,
      userMongoId: req.user.id,
      username: req.user.username,
      role: req.user.role,
      joined: true,
      inTransitionView: false
    }
    updateUserAppLocation({
      userMongoId: newLobbyInstanceMember.userMongoId,
      authenticatedUser: req.user,
      lobbyInstanceMongoId: req.lobbyInstance.id,
    })

    req.lobbyInstance.messages.push({
      user: {
        userMongoId: newLobbyInstanceMember.userMongoId,
        username: newLobbyInstanceMember.username
      },
      message: 'has connected',
      automated: true
    })
    req.lobbyInstance.messages.push({
      user: {
        userMongoId: newLobbyInstanceMember.userMongoId,
        username: newLobbyInstanceMember.username
      },
      message: 'has joined the lobby',
      automated: true
    })

    req.socket.join(req.lobbyInstance.id);
    if(req.user.roles[APP_ADMIN_ROLE]) req.socket.join(ADMIN_ROOM_PREFIX+req.lobbyInstance.id);

    req.lobbyInstances.forEach((lobbyInstance) => {
      let index;
      lobbyInstance.members.forEach((member, i) => {
        if(newLobbyInstanceMember.userMongoId === member.userMongoId) {
          index = i
        }
      })
      if(index >= -1) {
        // lobbyInstance.members.splice(index, 1)
        const member = lobbyInstance.members[index]
        member.joined = false
        lobbyInstance.messages.push({
          user: {
            userMongoId: member.userMongoId,
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
    if (!req.user.roles[APP_ADMIN_ROLE]) {
      return res.status(400).json({ message: 'You do not have privelages to delete that lobbyInstance.' });
    }

    try {
      const lobbyInstance = await LobbyInstance.findByIdAndRemove(req.params.id);
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

router.put('/member/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.body.userMongoId === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
      return res.status(400).json({ message: 'You do not have privelages to update that user in that lobbyInstance.' });
    }

    let index;
    const memberFound = req.lobbyInstance.members.filter((member, i) => {
      if(member.userMongoId === req.body.userMongoId) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!memberFound) {
      return res.status(400).json({ message: 'No user with id ' + req.body.userMongoId + ' found in lobbyInstance' });
    }

    if(req.lobbyInstance) {
      req.lobbyInstance.members[index] = { ...req.lobbyInstance.members[index], ...req.body.member}
      req.io.to(req.lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance: req.lobbyInstance});
    }

    res.status(200).json({ lobbyInstance: req.lobbyInstance });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});


router.put('/:id', requireJwtAuth, requireLobbyInstance, requireSocketAuth, async (req, res) => {
  try {

    // if(req.lobbyInstance.isGamePoweredOn && req.body.game?.id) {
    //   return res.status(400).json({ message: 'You cannot change the editing game id of a lobbyInstance when game is powered on' });
    // }

    // actually currently needed to be able to switch while game is on to function
    // if(req.lobbyInstance.isGamePoweredOn && req.body.currentGameId) {
    //   return res.status(400).json({ message: 'You cannot change the current game id of a lobbyInstance when game is powered on' });
    // }

    // if(req.body.isGamePoweredOn && !req.user.roles[APP_ADMIN_ROLE]) {
    //   return res.status(400).json({ message: 'You do not have privelages to power on this game.' });
    // }

    mergeDeep(req.lobbyInstance,req.body)

    const updatedLobbyInstance = await LobbyInstance.findByIdAndUpdate(
      req.params.id,
      { 
        // invitedUsers: req.lobbyInstance.invitedUsers.map(({id}) => {
        //   return id
        // }),
        hostUserMongoId: req.lobbyInstance.hostUserMongoId,
        startTime: req.lobbyInstance.startTime,
        instructionCurrentSteps: req.lobbyInstance.instructionCurrentSteps,
        currentActivityId: req.lobbyInstance.currentActivityId,
        // gameRoomInstances: req.lobbyInstance.gameRoomInstances,
        roleIdToUserMongoIds: req.lobbyInstance.roleIdToUserMongoIds,
        activitys: req.lobbyInstance.activitys,
        usersMustWaitInLine: req.lobbyInstance.usersMustWaitInLine,
        memberStorage: req.lobbyInstance.memberStorage,
        lobbyId: req.lobbyInstance.lobbyId
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
