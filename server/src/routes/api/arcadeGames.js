import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';
import ArcadeGame, { validateArcadeGame } from '../../models/ArcadeGame';
import { mergeDeep } from '../../utils/utils';
import { ON_GAME_CHARACTER_UPDATE, ON_GAME_MODEL_UPDATE, ARCADE_EXPERIENCE_ID } from '../../constants';
import User from '../../models/User';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const games = await ArcadeGame.find().sort({ createdAt: 'desc' }).select('user createdAt updatedAt metadata').populate('user');

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
    const game = await ArcadeGame.findById(req.params.id).populate('user');
    if (!game) return res.status(404).json({ message: 'No game found.' });
    res.json({ game: game.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/character', requireJwtAuth, requireSocketAuth, async (req, res) => {
  const tempUser = await User.findById(req.body.userId);
  if (!tempUser) return res.status(404).json({ message: 'No such user.' });
  if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not updated by the user themself or an admin.' });
  }

  try {
    const updatedUser = {
      unlockableInterfaceIds: {
        ...tempUser.unlockableInterfaceIds
      }
    };
    if(req.body.merge) {
      updatedUser.unlockableInterfaceIds[ARCADE_EXPERIENCE_ID] = {...req.body.unlockableInterfaceIds, ...tempUser.unlockableInterfaceIds[ARCADE_EXPERIENCE_ID] }
    } else {
      updatedUser.unlockableInterfaceIds[ARCADE_EXPERIENCE_ID]= req.body.unlockableInterfaceIds
    }

    const user = await User.findByIdAndUpdate(req.body.userId, { $set: updatedUser }, { new: true });

    if(req.body.lobbyId) {
      req.io.to(req.body.lobbyId).emit(ON_GAME_CHARACTER_UPDATE, {
        id: req.body.userId,
        data: {
          unlockableInterfaceIds: user.unlockableInterfaceIds[ARCADE_EXPERIENCE_ID]
        }
      })
    }

    res.status(200).json({ user: user.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateArcadeGame(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the game owner or admin.' });
  }

  try {
    let game = await ArcadeGame.create({
      stages: req.body.stages, 
      metadata: req.body.metadata, 
      defaults: req.body.defaults, 
      player: req.body.player, 
      classes: req.body.classes,
      brushes: req.body.brushes,
      colors: req.body.colors,
      cutscenes: req.body.cutscenes,
      relations: req.body.relations,
      awsImages: req.body.awsImages,
      nodeSize: req.body.nodeSize, 
      user: req.body.userId,
    });

    game = await game.populate('user').execPopulate();

    res.status(200).json({ game: game.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// router.delete('/:id', requireJwtAuth, async (req, res) => {
//   try {
//     const tempGame = await ArcadeGame.findById(req.params.id).populate('user');
//     if (!(tempGame.user.id === req.user.id || req.user.role === 'ADMIN'))
//       return res.status(400).json({ game: 'Not the game owner or admin.' });

//     const game = await ArcadeGame.findByIdAndRemove(req.params.id).populate('user');
//     if (!game) return res.status(404).json({ game: 'No game found.' });
//     res.status(200).json({ game });
//   } catch (err) {
  // console.error(err)
//     res.status(500).json({ game: 'Something went wrong.' });
//   }
// });

router.put('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    const tempGame = await ArcadeGame.findById(req.params.id).populate('user');
    if (!tempGame) return res.status(404).json({ message: 'No game found.' });
    if (!(tempGame.user?.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the game owner or admin.' });

    const updatedGame = mergeDeep(tempGame, req.body.gameUpdate)

    Object.keys(updatedGame.stages).forEach((stageId) => {
      const stage = updatedGame.stages[stageId]
      if (updatedGame.stages[stageId] === null || updatedGame.stages[stageId] === undefined) {
        console.log('deleting stage', stageId)
        delete updatedGame.stages[stageId];
      }

      // the default stage doesnt start with objects because its virtual so gotta check
      if(stage.objects) Object.keys(stage.objects).forEach(key => {
        if (stage.objects[key] === null || stage.objects[key] === undefined) {
          console.log('deleting object', key)
          delete stage.objects[key];
        }
      });
    })

    Object.keys(updatedGame.cutscenes).forEach(key => {
      if (updatedGame.cutscenes[key] === null || updatedGame.cutscenes[key] === undefined) {
        console.log('deleting cutscene', key)
        delete updatedGame.cutscenes[key];
      }
    });

    Object.keys(updatedGame.classes).forEach(key => {
      if (updatedGame.classes[key] === null || updatedGame.classes[key] === undefined) {
        console.log('deleting class', key)
        delete updatedGame.classes[key];
        return
      }
    });

    Object.keys(updatedGame.relations).forEach(key => {
      if (updatedGame.relations[key] === null || updatedGame.relations[key] === undefined) {
        console.log('deleting relation', key)
        delete updatedGame.relations[key];
      }
    });

    const { error } = validateArcadeGame(updatedGame);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    await ArcadeGame.findByIdAndUpdate(
      req.params.id,
      { 
        stages: updatedGame.stages, 
        metadata: updatedGame.metadata, 
        defaults: updatedGame.defaults, 
        player: updatedGame.player, 
        classes: updatedGame.classes,
        brushes: updatedGame.brushes,
        colors: updatedGame.colors,
        cutscenes: updatedGame.cutscenes,
        awsImages: updatedGame.awsImages,
        nodeSize: updatedGame.nodeSize, 
        relations: updatedGame.relations, 
        // user: tempGame.user ? tempGame.user.id : Math.random()
     },
      { new: true },
    );

    if(req.body.lobbyId) {
      req.io.to(req.body.lobbyId).emit(ON_GAME_MODEL_UPDATE, req.body.gameUpdate)
    } else {
      //local edit mode
      req.socket.emit(ON_GAME_MODEL_UPDATE, req.body.gameUpdate)
    }
    
    res.status(200).json({ game: updatedGame });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
