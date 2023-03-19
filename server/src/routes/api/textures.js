import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import Texture from '../../models/Texture';
import User from '../../models/User';

const router = Router();

router.get('/:textureId', async (req, res) => {
  try {
    const texture = await Texture.findOne({ textureId: req.params.textureId }).populate('owner');
    if (!texture) return res.status(404).json({ message: 'No texture found.' });
    res.json({ texture: texture.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  try {
    const tempUser = await User.findById(req.body.userId);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'Not updated by the user themself or an admin.' });
    }
    
    let texture = await Texture.create({
      ...req.body,
      owner: req.body.userId
    });

    res.status(200).json({ texture: texture.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempTexture = await Texture.findById(req.params.id);
    if (!tempTexture) return res.status(404).json({ message: 'No texture found.' });
    if (!(req.user.role === 'ADMIN'))
      return res.status(400).json({ texture: 'Not admin' });

    const texture = await Texture.findByIdAndRemove(req.params.id);
    if (!texture) return res.status(404).json({ message: 'No texture found.' });
    res.status(200).json({ texture });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempTexture = await Texture.findById(req.params.id).populate('owner');
    if (!tempTexture) return res.status(404).json({ message: 'No texture found.' });
    if (!(tempTexture.owner?.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the texture owner or admin.' });
    const updatedTexture = mergeDeep(tempTexture, req.body)

    console.log(req.params.id, updatedTexture)
    await Texture.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedTexture
      },
      { new: true },
    );
    
    res.status(200).json({ texture: updatedTexture });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
