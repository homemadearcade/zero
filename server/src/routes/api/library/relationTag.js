import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import RelationTag from '../../../models/library/RelationTag';
import { RELATION_TAG_LIBRARY_ID_PREFIX } from '../../../constants';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const relationTagLibrary = await RelationTag.find().sort({ createdAt: 'desc' })

    res.json({
      relationTagLibrary: relationTagLibrary.map((m) => {
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
    const relationTag = await RelationTag.findById(req.params.id).populate('owner');
    if (!relationTag) return res.status(404).json({ message: 'No relationTag found.' });
    res.json({ relationTag: relationTag.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/relationTagId/:relationTagId', async (req, res) => {
  try {
    const relationTag = await RelationTag.findOne({ relationTagId: req.params.relationTagId }).populate('owner');
    if (!relationTag) return res.status(404).json({ message: 'No relationTag found.' });
    res.json({ relationTag: relationTag.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userMongoId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the relationTag owner or admin.' });
  }

  try {
    let relationTag = await RelationTag.create({
      ...req.body,
      // relationTagId: RELATION_TAG_LIBRARY_ID_PREFIX + generateUniqueId(),
      owner: req.body.userMongoId,
    });

    relationTag = await relationTag.populate('owner').execPopulate();

    res.status(200).json({ relationTag: relationTag.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempRelationTag = await RelationTag.findById(req.params.id).populate('owner');
    if (!(tempRelationTag.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ relationTag: 'Not the relationTag owner or admin.' });

    const relationTag = await RelationTag.findByIdAndRemove(req.params.id).populate('owner');
    if (!relationTag) return res.status(404).json({ message: 'No relationTag found.' });
    res.status(200).json({ relationTag });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempRelationTag = await RelationTag.findById(req.params.id).populate('owner');
    if (!tempRelationTag) return res.status(404).json({ message: 'No relationTag found.' });
    if (!(tempRelationTag.owner.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by the relationTag owner or admin.' });

    const updatedRelationTag = mergeDeep(tempRelationTag, req.body)

    await RelationTag.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedRelationTag
      },
      { new: true },
    );
    
    res.status(200).json({ relationTag: updatedRelationTag });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
