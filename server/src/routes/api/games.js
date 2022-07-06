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
    res.status(500).json({ game: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('user');
    if (!game) return res.status(404).json({ game: 'No game found.' });
    res.json({ game: game.toJSON() });
  } catch (err) {
    res.status(500).json({ game: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateGame(req.body);
  if (error) return res.status(400).json({ game: error.details[0].message });

  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ game: 'Not created by the game owner or admin.' });
  }

  try {
    let game = await Game.create({
      objects: req.body.objects, 
      metadata: req.body.metadata, 
      hero: req.body.hero, 
      classes: req.body.classes,
      world: req.body.world, 
      user: req.body.userId,
    });

    game = await game.populate('user').execPopulate();

    res.status(200).json({ game: game.toJSON() });
  } catch (err) {
    res.status(500).json({ game: 'Something went wrong.' });
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
//     res.status(500).json({ game: 'Something went wrong.' });
//   }

// });

router.put('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    const tempGame = await Game.findById(req.params.id).populate('user');
    if (!(tempGame.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ game: 'Not updated by the game owner or admin.' });

    const updatedGame = mergeDeep(tempGame, req.body.gameUpdate)

    const { error } = validateGame(updatedGame);
    if (error) return res.status(400).json({ game: error.details[0].message });
  
    let game = await Game.findByIdAndUpdate(
      req.params.id,
      { 
        objects: updatedGame.objects, 
        metadata: updatedGame.metadata, 
        hero: updatedGame.hero, 
        classes: updatedGame.classes,
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
    
    if (!game) return res.status(404).json({ game: 'No game found.' });
    game = await game.populate('user').execPopulate();

    res.status(200).json({ game });
  } catch (err) {
    res.status(500).json({ game: 'Something went wrong.' });
  }
});

export default router;
