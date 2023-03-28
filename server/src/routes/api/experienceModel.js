import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { generateUniqueId, mergeDeep } from '../../utils/utils';
import ExperienceModel from '../../models/ExperienceModel';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const experienceModels = await ExperienceModel.find().sort({ createdAt: 'desc' }).select('owner metadata isRemoved').populate('owner');

    res.json({
      experienceModels: experienceModels.map((m) => {
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
    const experienceModel = await ExperienceModel.findById(req.params.id).populate('owner');
    if (!experienceModel) return res.status(404).json({ message: 'No experienceModel found.' });
    res.json({ experienceModel: experienceModel.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the experienceModel owner or admin.' });
  }

  try {
    let experienceModel = await ExperienceModel.create({
      ...req.body,
      experienceModelShortId: generateUniqueId(),
      owner: req.body.userId,
    });

    experienceModel = await experienceModel.populate('owner').execPopulate();

    res.status(200).json({ experienceModel: experienceModel.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempExperienceModel = await ExperienceModel.findById(req.params.id).populate('owner');
    if (!(tempExperienceModel.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ experienceModel: 'Not the experienceModel owner or admin.' });

    const experienceModel = await ExperienceModel.findByIdAndRemove(req.params.id).populate('owner');
    if (!experienceModel) return res.status(404).json({ message: 'No experienceModel found.' });
    res.status(200).json({ experienceModel });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempExperienceModel = await ExperienceModel.findById(req.params.id).populate('owner');
    if (!tempExperienceModel) return res.status(404).json({ message: 'No experienceModel found.' });
    if (!(tempExperienceModel.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the experienceModel owner or admin.' });

    const updatedExperienceModel = mergeDeep(tempExperienceModel, req.body)

    await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedExperienceModel
      },
      { new: true },
    );
    
    res.status(200).json({ experienceModel: updatedExperienceModel });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
