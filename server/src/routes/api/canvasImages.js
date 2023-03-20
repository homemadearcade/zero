import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import CanvasImage from '../../models/CanvasImage';
import User from '../../models/User';

const router = Router();

router.get('/textureId/:textureId', async (req, res) => {
  try {
    const canvasImage = await CanvasImage.findOne({ textureId: req.params.textureId }).populate('owner');
    if (!canvasImage) return res.status(404).json({ message: 'No canvasImage found.' });
    res.json({ canvasImage: canvasImage.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const canvasImage = await CanvasImage.findById(req.params.id).populate('owner');
    if (!canvasImage) return res.status(404).json({ message: 'No canvasImage found.' });
    res.json({ canvasImage: canvasImage.toJSON() });
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
    
    let canvasImage = await CanvasImage.create({
      ...req.body,
      owner: req.body.userId
    });

    res.status(200).json({ canvasImage: canvasImage.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempImage = await CanvasImage.findById(req.params.id);
    if (!tempImage) return res.status(404).json({ message: 'No canvasImage found.' });
    if (!(req.user.role === 'ADMIN'))
      return res.status(400).json({ canvasImage: 'Not admin' });

    const canvasImage = await CanvasImage.findByIdAndRemove(req.params.id);
    if (!canvasImage) return res.status(404).json({ message: 'No canvasImage found.' });
    res.status(200).json({ canvasImage });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempImage = await CanvasImage.findById(req.params.id).populate('owner');
    if (!tempImage) return res.status(404).json({ message: 'No canvasImage found.' });
    if (!(tempImage.owner?.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the canvasImage owner or admin.' });
    const updatedImage = mergeDeep(tempImage, req.body)

    await CanvasImage.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedImage
      },
      { new: true },
    );
    
    res.status(200).json({ canvasImage: updatedImage });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
