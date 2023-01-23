import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import Experience from '../../models/Experience';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: 'desc' }).select('user metadata').populate('user');

    res.json({
      experiences: experiences.map((m) => {
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
    const experience = await Experience.findById(req.params.id).populate('user');
    if (!experience) return res.status(404).json({ message: 'No experience found.' });
    res.json({ experience: experience.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the experience owner or admin.' });
  }

  try {
    let experience = await Experience.create({
      ...req.body,
      user: req.body.userId,
    });

    experience = await experience.populate('user').execPopulate();

    res.status(200).json({ experience: experience.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempExperience = await Experience.findById(req.params.id).populate('user');
    if (!(tempExperience.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ experience: 'Not the experience owner or admin.' });

    const experience = await Experience.findByIdAndRemove(req.params.id).populate('user');
    if (!experience) return res.status(404).json({ message: 'No experience found.' });
    res.status(200).json({ experience });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempExperience = await Experience.findById(req.params.id).populate('user');
    if (!tempExperience) return res.status(404).json({ message: 'No experience found.' });
    if (!(tempExperience.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the experience owner or admin.' });

    const updatedExperience = mergeDeep(tempExperience, req.body)

    await Experience.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedExperience
      },
      { new: true },
    );
    
    res.status(200).json({ experience: updatedExperience });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
