import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';
import ArcadeGame, { validateArcadeGame } from '../../models/ArcadeGame';
import { mergeDeep } from '../../utils/utils';
import { ON_GAME_CHARACTER_UPDATE, ON_GAME_MODEL_UPDATE, GAME_MODEL_DID, ON_CODRAWING_IMAGE_UPDATE, CODRAWING_ROOM_PREFIX } from '../../constants';
import User from '../../models/User';
import { generateUniqueId } from '../../utils/utils';
import { generatePutUrl, recordS3Upload, s3Multer } from '../../services/aws';
import { APP_ADMIN_ROLE } from "../../constants/index";

const router = Router();

async function requireArcadeGameEditPermissions(req, res, next) {
  const tempGame = await ArcadeGame.findById(req.params.id).populate('owner')
  if (!tempGame) return res.status(404).json({ message: 'No such Game.' });
  const tempUser = await User.findById(req.user.id);
  const inSameAppLocation = tempGame.appLocation?.experienceInstanceId && tempUser.appLocation?.experienceInstanceId && tempGame.appLocation?.experienceInstanceId === tempUser.appLocation?.experienceInstanceId
  if (!(tempGame.owner.id === req.user.id || req.user.roles[APP_ADMIN_ROLE] || inSameAppLocation))
    return res.status(400).json({ message: 'You do not have privelages to edit this Game.' });

  req.tempGame = tempGame
  
  next()
}

router.get('/', async (req, res) => {
  try {
    const games = await ArcadeGame.find().sort({ createdAt: 'desc' }).select('owner createdAt isRemoved updatedAt metadata playScope editScope').populate('owner');

    res.json({
      games: games.map((m) => {
        return m.toJSON();
      }),
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await ArcadeGame.findById(req.params.id).populate('owner');
    if (!game) return res.status(404).json({ message: 'No game found.' });
    res.json({ game: game.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/character', requireJwtAuth, requireSocketAuth, async (req, res) => {
  const tempUser = await User.findById(req.body.userMongoId);
  if (!tempUser) return res.status(404).json({ message: 'No such user.' });
  if (!(tempUser.id === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
    return res.status(400).json({ message: 'Not updated by the user themself or an admin.' });
  }

  try {
    const updatedUser = {
      unlockedInterfaceIds: {
        ...tempUser.unlockedInterfaceIds
      }
    };
    if(req.body.merge) {
      updatedUser.unlockedInterfaceIds[req.body.experienceModelMongoId] = { ...tempUser.unlockedInterfaceIds[req.body.experienceModelMongoId], ...req.body.unlockedInterfaceIds }
    } else {
      updatedUser.unlockedInterfaceIds[req.body.experienceModelMongoId]= req.body.unlockedInterfaceIds
    }

    const user = await User.findByIdAndUpdate(req.body.userMongoId, { $set: updatedUser }, { new: true });

    if(req.body.gameRoomInstanceMongoId) {
      req.io.to(req.body.gameRoomInstanceMongoId).emit(ON_GAME_CHARACTER_UPDATE, {
        userMongoId: req.body.userMongoId,
        unlockedInterfaceIds: user.unlockedInterfaceIds[req.body.experienceModelMongoId]
      })
    }

    res.status(200).json({ user: user.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/gameModelId/:gameModelId', async (req, res) => {
  try {
    const gameModel = await ArcadeGame.findOne({ gameModelId: req.params.gameModelId }).populate('owner');
    if (!gameModel) return res.status(404).json({ message: 'No arcade game found.' });
    res.json({ gameModel: gameModel.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/:id/copy', requireJwtAuth, async (req, res) => {
  try {
    const game = await ArcadeGame.findById(req.params.id).populate('owner');
    if (!game) return res.status(404).json({ message: 'No game found.' });

    let copiedGame = await ArcadeGame.create(game)

    copiedGame = await copiedGame.populate('owner').execPopulate();

    res.status(200).json({ game: copiedGame.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
})

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateArcadeGame(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!(req.body.userMongoId === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
    return res.status(400).json({ message: 'Not created by the game owner or admin.' });
  }

  try {
    let game = await ArcadeGame.create({
      stages: req.body.stages, 
      layers: req.body.layers,
      metadata: req.body.metadata, 
      theme: req.body.theme, 
      player: req.body.player, 
      entityModels: req.body.entityModels,
      brushes: req.body.brushes,
      colors: req.body.colors,
      relationTags: req.body.relationTags,
      cutscenes: req.body.cutscenes,
      relations: req.body.relations,
      collisions: req.body.collisions,
      interfacePresets: req.body.interfacePresets,
      events: req.body.events,
      effects: req.body.effects,
      textures: req.body.textures,
      size: req.body.size, 
      owner: req.body.userMongoId,
      appLocation: req.body.appLocation,
      playScope: req.body.playScope,
      editScope: req.body.editScope,
      stageClasses: req.body.stageClasses,
      starterPackIID: req.body.starterPackIID,
      gameModelId: GAME_MODEL_DID + generateUniqueId()
    });

    game = await game.populate('owner').execPopulate();

    res.status(200).json({ game: game.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// router.delete('/:id', requireJwtAuth, async (req, res) => {
//   try {
//     const tempGame = await ArcadeGame.findById(req.params.id).populate('owner');
//     if (!(tempGame.owner.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
//       return res.status(400).json({ game: 'Not the game owner or admin.' });

//     const game = await ArcadeGame.findByIdAndRemove(req.params.id).populate('owner');
//     if (!game) return res.status(404).json({ game: 'No game found.' });
//     res.status(200).json({ game });
//   } catch (err) {
  // console.error(err)
//     res.status(500).json({ game: 'Something went wrong.' });
//   }
// });
router.post('/:id/importArcadeGame', requireJwtAuth, requireSocketAuth, requireArcadeGameEditPermissions, async (req, res) => {
  try{
    const tempGame = req.tempGame

    const importedGame = await ArcadeGame.findById(req.body.arcadeGameMongoId)
    if (!importedGame) return res.status(404).json({ message: 'No such Game.' });

    if(importedGame.entityModels) {
      Object.keys(importedGame.entityModels).forEach((entityModelId) => {
        const importedEntityModel = importedGame.entityModels[entityModelId]
        if(tempGame.entityModels[entityModelId]) {
          return 
          // tempGame.entityModels[entityModelId] = mergeDeep(importedEntityModel), tempGame.entityModels[entityModelId]
        } else {
          tempGame.entityModels[entityModelId] = importedEntityModel
        }
      })
    }

    if(importedGame.relations) {
      Object.keys(importedGame.relations).forEach((relationId) => {
        const importedRelation = importedGame.relations[relationId]
        tempGame.relations[relationId] = importedRelation
      })
    }

    if(importedGame.textures) {
      Object.keys(importedGame.textures).forEach((textureId) => {
        const importedTexture = importedGame.textures[textureId]
        tempGame.textures[textureId] = importedTexture
      })
    }

    if(importedGame.effects) {
      Object.keys(importedGame.effects).forEach((effectId) => {
        const importedEffect = importedGame.effects[effectId]
        tempGame.effects[effectId] = importedEffect
      })
    }

    if(importedGame.events) {
      Object.keys(importedGame.events).forEach((effectId) => {
        const importedEffect = importedGame.events[effectId]
        tempGame.events[effectId] = importedEffect
      })
    }

    if(importedGame.cutscenes) {
      Object.keys(importedGame.cutscenes).forEach((cutsceneId) => {
        if(tempGame.cutscenes[cutsceneId]) {
          return 
        }
        const importedCutscene = importedGame.cutscenes[cutsceneId]
        tempGame.cutscenes[cutsceneId] = importedCutscene
      })
    }

    if(importedGame.relationTags) {
      Object.keys(importedGame.relationTags).forEach((relationTagId) => {
        const importedTag = importedGame.relationTags[relationTagId]
        tempGame.relationTags[relationTagId] = importedTag
      })
    }

    console.log(Object.keys(tempGame.entityModels))
    const game = await ArcadeGame.findByIdAndUpdate(tempGame.id, tempGame, { new: true }).populate('owner');

    res.status(200).json({ game });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/texture/:id', requireJwtAuth, requireSocketAuth, requireArcadeGameEditPermissions, async (req, res) => {
  const { url, fields } = await generatePutUrl(req.query.Key)
  .catch(err => {
    console.log('error', err)
    res.send(err);
  });
  
  res.status(200).json({ url, fields});
})

router.put('/:id', requireJwtAuth, requireSocketAuth, requireArcadeGameEditPermissions, async (req, res) => {
  try {

    const tempGame = await ArcadeGame.findById(req.params.id).populate('owner')
    if (!tempGame) return res.status(404).json({ message: 'No such Game.' });
    
    const updatedGame = mergeDeep(tempGame, req.body.gameUpdate)
    
    console.log('updating', req.body.gameUpdate)

    Object.keys(updatedGame.stages).forEach((stageId) => {
      const stage = updatedGame.stages[stageId]
      if (updatedGame.stages[stageId] === null || updatedGame.stages[stageId] === undefined) {
        console.log('deleting stage', stageId)
        delete updatedGame.stages[stageId];
      }

      // the default stage doesnt start with entityInstance because its virtual so gotta check
      if(stage.entityInstances) Object.keys(stage.entityInstances).forEach(key => {
        if (stage.entityInstances[key] === null || stage.entityInstances[key] === undefined) {
          console.log('deleting object', key)
          delete stage.entityInstances[key];
        }
      });
    })

    Object.keys(updatedGame.cutscenes).forEach(key => {
      if (updatedGame.cutscenes[key] === null || updatedGame.cutscenes[key] === undefined) {
        console.log('deleting cutscene', key)
        delete updatedGame.cutscenes[key];
      }
    });

    Object.keys(updatedGame.entityModels).forEach(key => {
      if (updatedGame.entityModels[key] === null || updatedGame.entityModels[key] === undefined) {
        console.log('deleting class', key)
        delete updatedGame.entityModels[key];
        return
      }
    });

    Object.keys(updatedGame.relations).forEach(key => {
      if (updatedGame.relations[key] === null || updatedGame.relations[key] === undefined) {
        console.log('deleting relation', key)
        delete updatedGame.relations[key];
      }
    });

    Object.keys(updatedGame.collisions).forEach(key => {
      if (updatedGame.collisions[key] === null || updatedGame.collisions[key] === undefined) {
        console.log('deleting collisions', key)
        delete updatedGame.collisions[key];
      }
    });

    Object.keys(updatedGame.events).forEach(key => {
      if (updatedGame.events[key] === null || updatedGame.events[key] === undefined) {
        console.log('deleting event', key)
        delete updatedGame.events[key];
      }
    });

    Object.keys(updatedGame.effects).forEach(key => {
      if (updatedGame.effects[key] === null || updatedGame.effects[key] === undefined) {
        console.log('deleting effect', key)
        delete updatedGame.effects[key];
      }
    });

    Object.keys(updatedGame.relationTags).forEach(key => {
      if (updatedGame.relationTags[key] === null || updatedGame.relationTags[key] === undefined) {
        console.log('deleting effect', key)
        delete updatedGame.relationTags[key];
      }
    });


    const { error } = validateArcadeGame(updatedGame);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const update = { 
      metadata: updatedGame.metadata, 
      theme: updatedGame.theme, 
      player: updatedGame.player, 
      entityModels: updatedGame.entityModels,
      brushes: updatedGame.brushes,
      colors: updatedGame.colors,
      relationTags: updatedGame.relationTags,
      cutscenes: updatedGame.cutscenes,
      textures: updatedGame.textures,
      size: updatedGame.size, 
      relations: updatedGame.relations, 
      events: updatedGame.events, 
      collisions: updatedGame.collisions, 
      interfacePresets: updatedGame.interfacePresets,
      effects: updatedGame.effects, 
      isRemoved: updatedGame.isRemoved,
      stages: updatedGame.stages,
      layers: updatedGame.layers,
      version: updatedGame.version,
      appLocation: updatedGame.appLocation,
      playScope: updatedGame.playScope,
      editScope: updatedGame.editScope,
      stageClasses: updatedGame.stageClasses,
      starterPackIID: updatedGame.starterPackIID,
      // user: tempGame.owner ? tempGame.owner.id : Math.random()
    }

    if(!req.body.isAutosaveDisabled) {
      console.log('updating game', update.cutscenes)
      await ArcadeGame.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true },
      )
    }

    if(req.body.gameRoomInstanceMongoId) {
      req.io.to(req.body.gameRoomInstanceMongoId).emit(ON_GAME_MODEL_UPDATE, req.body.gameUpdate)
    }
    
    res.status(200).json({ game: updatedGame });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
