import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import InterfacePreset from '../../models/InterfacePreset';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const interfacePresets = await InterfacePreset.find().sort({ createdAt: 'desc' }).select('name interfaceIds isRemoved description');

    res.json({
      interfacePresets: interfacePresets.map((m) => {
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

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by admin' });
  }

  try {
    let interfacePreset = await InterfacePreset.create({
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
    const tempinterfacePresets = await InterfacePreset.findById(req.params.id);
    if (!tempinterfacePresets) return res.status(404).json({ message: 'No ticketed event found.' });
    if (!(req.user.role === 'ADMIN'))
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
    const tempinterfacePresets = await InterfacePreset.findById(req.params.id);
    if (!tempinterfacePresets) return res.status(404).json({ message: 'No ticketed event found.' });
    if (!(req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not updated by admin.' });

    const updatedinterfacePresets = mergeDeep(tempinterfacePresets, req.body)

    await interfacePresets.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedinterfacePresets
      },
      { new: true },
    );
    
    res.status(200).json({ interfacePreset: updatedinterfacePresets });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
