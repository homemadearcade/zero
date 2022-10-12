import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';
import Game, { validateGame } from '../../models/Game';
import { mergeDeep } from '../../utils/utils';
import { ON_GAME_MODEL_UPDATE} from '../../constants';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: 'desc' }).select('user createdAt updatedAt metadata').populate('user');

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
    const game = await Game.findById(req.params.id).populate('user');
    if (!game) return res.status(404).json({ message: 'No game found.' });
    res.json({ game: game.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateGame(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the game owner or admin.' });
  }

  try {
    let game = await Game.create({
      objects: req.body.objects, 
      metadata: req.body.metadata, 
      hero: req.body.hero, 
      classes: req.body.classes,
      brushes: req.body.brushes,
      colors: req.body.colors,
      cutscenes: req.body.cutscenes,
      awsImages: req.body.awsImages,
      world: req.body.world, 
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
//     const tempGame = await Game.findById(req.params.id).populate('user');
//     if (!(tempGame.user.id === req.user.id || req.user.role === 'ADMIN'))
//       return res.status(400).json({ game: 'Not the game owner or admin.' });

//     const game = await Game.findByIdAndRemove(req.params.id).populate('user');
//     if (!game) return res.status(404).json({ game: 'No game found.' });
//     res.status(200).json({ game });
//   } catch (err) {
  // console.error(err)
//     res.status(500).json({ game: 'Something went wrong.' });
//   }
// });

router.put('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    const tempGame = await Game.findById(req.params.id).populate('user');
    if (!tempGame) return res.status(404).json({ message: 'No game found.' });
    if (!(tempGame.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the game owner or admin.' });

    const updatedGame = mergeDeep(tempGame, req.body.gameUpdate)

    Object.keys(updatedGame.objects).forEach(key => {
      if (updatedGame.objects[key] === null || updatedGame.objects[key] === undefined) {
        console.log('deleting object', key)
        delete updatedGame.objects[key];
      }
    });

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

      const objectClass = updatedGame.classes[key]
      Object.keys(objectClass.relations).forEach(key => {
        if (objectClass.relations[key] === null || objectClass.relations[key] === undefined) {
          console.log('deleting relation', key)
          delete objectClass.relations[key];
        }
      });
    });

    const { error } = validateGame(updatedGame);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    await Game.findByIdAndUpdate(
      req.params.id,
      { 
        objects: updatedGame.objects, 
        metadata: updatedGame.metadata, 
        hero: updatedGame.hero, 
        classes: updatedGame.classes,
        brushes: updatedGame.brushes,
        colors: updatedGame.colors,
        cutscenes: updatedGame.cutscenes,
        awsImages: updatedGame.awsImages,
        world: updatedGame.world, 
        user: tempGame.user.id 
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
