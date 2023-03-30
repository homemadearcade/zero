import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import Relation from '../../../models/library/Relation';
import { RELATION_LIBRARY_ID_PREFIX } from '../../../constants';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const relationLibrary = await Relation.find().sort({ createdAt: 'desc' })

    res.json({
      relationLibrary: relationLibrary.map((m) => {
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
    const relation = await Relation.findById(req.params.id).populate('owner');
    if (!relation) return res.status(404).json({ message: 'No relation found.' });
    res.json({ relation: relation.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the relation owner or admin.' });
  }

  try {
    let relation = await Relation.create({
      ...req.body,
      // relationShortId: RELATION_LIBRARY_ID_PREFIX + generateUniqueId(),
      owner: req.body.userId,
    });

    relation = await relation.populate('owner').execPopulate();

    res.status(200).json({ relation: relation.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempRelation = await Relation.findById(req.params.id).populate('owner');
    if (!(tempRelation.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ relation: 'Not the relation owner or admin.' });

    const relation = await Relation.findByIdAndRemove(req.params.id).populate('owner');
    if (!relation) return res.status(404).json({ message: 'No relation found.' });
    res.status(200).json({ relation });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempRelation = await Relation.findById(req.params.id).populate('owner');
    if (!tempRelation) return res.status(404).json({ message: 'No relation found.' });
    if (!(tempRelation.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the relation owner or admin.' });

    const updatedRelation = mergeDeep(tempRelation, req.body)

    await Relation.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedRelation
      },
      { new: true },
    );
    
    res.status(200).json({ relation: updatedRelation });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
