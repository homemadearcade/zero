import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import InterfacePreset from '../../../models/library/InterfacePreset';
import { generateUniqueId } from '../../../utils/utils';
import { INTERFACE_PRESET_DID } from '../../../constants';
import { APP_ADMIN_ROLE } from '../../../constants/index';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const interfacePresetLibrary = await InterfacePreset.find().sort({ createdAt: 'desc' }).select('name interfaceIds isRemoved description');

    res.json({
      interfacePresetLibrary: interfacePresetLibrary.map((m) => {
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
    const interfacePreset = await InterfacePreset.findById(req.params.id);
    if (!interfacePreset) return res.status(404).json({ message: 'No ticketed event found.' });
    res.json({ interfacePreset: interfacePreset.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/interfacePresetId/:interfacePresetId', async (req, res) => {
  try {
    const interfacePreset = await InterfacePreset.findOne({ interfacePresetId: req.params.interfacePresetId }).populate('owner');
    if (!interfacePreset) return res.status(404).json({ message: 'No interfacePreset found.' });
    res.json({ interfacePreset: interfacePreset.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.user.roles[APP_ADMIN_ROLE])) {
    return res.status(400).json({ message: 'Not created by admin' });
  }

  try {
    let interfacePreset = await InterfacePreset.create({
      interfacePresetId: INTERFACE_PRESET_DID + generateUniqueId(),
      ...req.body,
    });

    res.status(200).json({ interfacePreset: interfacePreset.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempinterfacePreset = await InterfacePreset.findById(req.params.id);
    if (!tempinterfacePreset) return res.status(404).json({ message: 'No ticketed event found.' });
    if (!(req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ interfacePreset: 'Not admin' });

    const interfacePreset = await InterfacePreset.findByIdAndRemove(req.params.id);
    if (!interfacePreset) return res.status(404).json({ message: 'No ticketed event found.' });
    res.status(200).json({ interfacePreset });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempinterfacePreset = await InterfacePreset.findById(req.params.id);
    if (!tempinterfacePreset) return res.status(404).json({ message: 'No ticketed event found.' });
    if (!(req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ message: 'Not updated by admin.' });

    const updatedinterfacePreset = mergeDeep(tempinterfacePreset, req.body)

    await interfacePreset.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedinterfacePreset
      },
      { new: true },
    );
    
    res.status(200).json({ interfacePreset: updatedinterfacePreset });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
