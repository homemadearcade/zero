import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import Effect from '../../../models/library/Effect';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const effectLibrary = await Effect.find().sort({ createdAt: 'desc' })

    res.json({
      effectLibrary: effectLibrary.map((m) => {
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
    const effect = await Effect.findById(req.params.id).populate('owner');
    if (!effect) return res.status(404).json({ message: 'No effect found.' });
    res.json({ effect: effect.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/effectId/:effectId', async (req, res) => {
  try {
    const effect = await Effect.findOne({ effectId: req.params.effectId }).populate('owner');
    if (!effect) return res.status(404).json({ message: 'No effect found.' });
    res.json({ effect: effect.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userMongoId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the effect owner or admin.' });
  }

  try {
    let effect = await Effect.create({
      ...req.body,
      owner: req.body.userMongoId,
    });

    effect = await effect.populate('owner').execPopulate();

    res.status(200).json({ effect: effect.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEffect = await Effect.findById(req.params.id).populate('owner');
    if (!(tempEffect.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ effect: 'Not the effect owner or admin.' });

    const effect = await Effect.findByIdAndRemove(req.params.id).populate('owner');
    if (!effect) return res.status(404).json({ message: 'No effect found.' });
    res.status(200).json({ effect });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEffect = await Effect.findById(req.params.id).populate('owner');
    if (!tempEffect) return res.status(404).json({ message: 'No effect found.' });
    if (!(tempEffect.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the effect owner or admin.' });

    const updatedEffect = mergeDeep(tempEffect, req.body)

    await Effect.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedEffect
      },
      { new: true },
    );
    
    res.status(200).json({ effect: updatedEffect });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
