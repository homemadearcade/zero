import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import EntityClass from '../../../models/library/EntityClass';
import { ENTITY_CLASS_LIBRARY_ID_PREFIX } from '../../../constants';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const entityClassLibrary = await EntityClass.find().sort({ createdAt: 'desc' })

    res.json({
      entityClassLibrary: entityClassLibrary.map((m) => {
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
    const entityClass = await EntityClass.findById(req.params.id).populate('owner');
    if (!entityClass) return res.status(404).json({ message: 'No entityClass found.' });
    res.json({ entityClass: entityClass.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/entityClassId/:entityClassId', async (req, res) => {
  try {
    const entityClass = await EntityClass.findOne({ entityClassId: req.params.entityClassId }).populate('owner');
    if (!entityClass) return res.status(404).json({ message: 'No entityClass found.' });
    res.json({ entityClass: entityClass.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userMongoId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the entityClass owner or admin.' });
  }

  try {
    let entityClass = await EntityClass.create({
      ...req.body,
      // entityClassId: ENTITY_CLASS_LIBRARY_ID_PREFIX + generateUniqueId(),
      owner: req.body.userMongoId,
    });

    entityClass = await entityClass.populate('owner').execPopulate();

    res.status(200).json({ entityClass: entityClass.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEntityClass = await EntityClass.findById(req.params.id).populate('owner');
    if (!(tempEntityClass.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ entityClass: 'Not the entityClass owner or admin.' });

    const entityClass = await EntityClass.findByIdAndRemove(req.params.id).populate('owner');
    if (!entityClass) return res.status(404).json({ message: 'No entityClass found.' });
    res.status(200).json({ entityClass });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEntityClass = await EntityClass.findById(req.params.id).populate('owner');
    if (!tempEntityClass) return res.status(404).json({ message: 'No entityClass found.' });
    if (!(tempEntityClass.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the entityClass owner or admin.' });

    const updatedEntityClass = mergeDeep(tempEntityClass, req.body)

    await EntityClass.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedEntityClass
      },
      { new: true },
    );
    
    res.status(200).json({ entityClass: updatedEntityClass });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
