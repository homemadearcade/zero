import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import EntityModel from '../../../models/library/EntityModel';
import { APP_ADMIN_ROLE } from '../../../constants/index';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const entityModelLibrary = await EntityModel.find().sort({ createdAt: 'desc' })

    res.json({
      entityModelLibrary: entityModelLibrary.map((m) => {
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
    const entityModel = await EntityModel.findById(req.params.id).populate('owner');
    if (!entityModel) return res.status(404).json({ message: 'No entityModel found.' });
    res.json({ entityModel: entityModel.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/entityModelId/:entityModelId', async (req, res) => {
  try {
    const entityModel = await EntityModel.findOne({ entityModelId: req.params.entityModelId }).populate('owner');
    if (!entityModel) return res.status(404).json({ message: 'No entityModel found.' });
    res.json({ entityModel: entityModel.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userMongoId === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
    return res.status(400).json({ message: 'Not created by the entityModel owner or admin.' });
  }

  try {
    let entityModel = await EntityModel.create({
      ...req.body,
      owner: req.body.userMongoId,
    });

    entityModel = await entityModel.populate('owner').execPopulate();

    res.status(200).json({ entityModel: entityModel.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEntityModel = await EntityModel.findById(req.params.id).populate('owner');
    if (!(tempEntityModel.owner.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ entityModel: 'Not the entityModel owner or admin.' });

    const entityModel = await EntityModel.findByIdAndRemove(req.params.id).populate('owner');
    if (!entityModel) return res.status(404).json({ message: 'No entityModel found.' });
    res.status(200).json({ entityModel });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEntityModel = await EntityModel.findById(req.params.id).populate('owner');
    if (!tempEntityModel) return res.status(404).json({ message: 'No entityModel found.' });
    if (!(tempEntityModel.owner.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ message: 'Not updated by the entityModel owner or admin.' });

    const updatedEntityModel = mergeDeep(tempEntityModel, req.body)

    await EntityModel.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedEntityModel
      },
      { new: true },
    );
    
    res.status(200).json({ entityModel: updatedEntityModel });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
