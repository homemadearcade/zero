import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import CanvasImage from '../../models/CanvasImage';
import User from '../../models/User';
import { generateUniqueId } from '../../utils/utils';
import { APP_ADMIN_ROLE } from "../../constants/index";

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
    const tempUser = await User.findById(req.body.userMongoId);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(
        tempUser.id === req.user.id
        || req.user.roles[APP_ADMIN_ROLE]
        || tempUser.appLocation?.experienceInstanceId === req.user.appLocation?.experienceInstanceId
      )) {
      return res.status(400).json({ message: 'Not updated by the user themself or an admin or someone in the same experience.' });
    }
    
    let canvasImage = await CanvasImage.create({
      ...req.body,
      owner: req.body.userMongoId
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
    if (!(req.user.roles[APP_ADMIN_ROLE]))
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
    if (!(
        tempImage.owner.id === req.user.id
        || req.user.roles[APP_ADMIN_ROLE]
        || tempImage.owner.appLocation?.experienceInstanceId === req.user.appLocation?.experienceInstanceId
      )) {
      return res.status(400).json({ message: 'Not updated by the user themself or an admin or someone in the same experience.' });
    }
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
