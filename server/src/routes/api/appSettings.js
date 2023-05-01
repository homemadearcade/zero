import { Router } from "express";
import requireJwtAuth from "../../middleware/requireJwtAuth";
import AppSettings from "../../models/AppSettings";
import { mergeDeep } from "../../utils/utils";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const appSettings = await AppSettings.findOne();
    if (!appSettings) return res.status(404).json({ message: 'No appSettings found.' });
    res.json({ appSettings: appSettings.toJSON() });

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/', requireJwtAuth, async (req, res) => {
  try {
    const tempAppSettings = await AppSettings.findOne()
    if (!tempAppSettings) return res.status(404).json({ message: 'No appSettings found.' });
    if (req.user.role !== 'ADMIN') return res.status(400).json({ message: 'Not updated by admin.' });
    
    const updatedAppSettings = mergeDeep(tempAppSettings, req.body)

    await AppSettings.findByIdAndUpdate(
      tempAppSettings.id,
      { 
        ...updatedAppSettings
      },
    );
    
    res.status(200).json({ appSettings: updatedAppSettings });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
