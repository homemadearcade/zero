import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import Effect from '../../../models/library/Effect';
import Event from '../../../models/library/Event';
import Relation from '../../../models/library/Relation';
import RelationTag from '../../../models/library/RelationTag';
import EntityClass from '../../../models/library/EntityClass';
import InterfacePreset from '../../../models/library/InterfacePreset';

const router = Router();

router.get('/', async (req, res) => {
  try {
    
    const effectLibrary = (await Effect.find().sort({ createdAt: 'desc' }))
      .map((m) => {
        return m.toJSON();
      })
    const eventLibrary = (await Event.find().sort({ createdAt: 'desc' }))
      .map((m) => {
        return m.toJSON();
      })
    const relationLibrary = (await Relation.find().sort({ createdAt: 'desc' }))
      .map((m) => {
        return m.toJSON();
      })
    const relationTagLibrary = (await RelationTag.find().sort({ createdAt: 'desc' }))      
      .map((m) => {
        return m.toJSON();
      })
    const entityClassLibrary = (await EntityClass.find().sort({ createdAt: 'desc' }))
     .map((m) => {
        return m.toJSON();
      })
    const interfacePresetLibrary = (await InterfacePreset.find().sort({ createdAt: 'desc' }))
      .map((m) => {
        return m.toJSON();
      })

    res.json({
      effectLibrary: effectLibrary,
      eventLibrary: eventLibrary,
      relationLibrary: relationLibrary,
      relationTagLibrary: relationTagLibrary,
      entityClassLibrary: entityClassLibrary,
      interfacePresetLibrary: interfacePresetLibrary,
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
