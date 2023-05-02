import { Router } from 'express';
import requireJwtAuth from '../../../middleware/requireJwtAuth';
import { mergeDeep } from '../../../utils/utils';
import Event from '../../../models/library/Event';
import { APP_ADMIN_ROLE } from '../../../constants/index';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const eventLibrary = await Event.find().sort({ createdAt: 'desc' })

    res.json({
      eventLibrary: eventLibrary.map((m) => {
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
    const event = await Event.findById(req.params.id).populate('owner');
    if (!event) return res.status(404).json({ message: 'No event found.' });
    res.json({ event: event.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/eventId/:eventId', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId }).populate('owner');
    if (!event) return res.status(404).json({ message: 'No event found.' });
    res.json({ event: event.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userMongoId === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
    return res.status(400).json({ message: 'Not created by the event owner or admin.' });
  }

  try {
    let event = await Event.create({
      ...req.body,
      owner: req.body.userMongoId,
    });

    event = await event.populate('owner').execPopulate();

    res.status(200).json({ event: event.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEvent = await Event.findById(req.params.id).populate('owner');
    if (!(tempEvent.owner.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ event: 'Not the event owner or admin.' });

    const event = await Event.findByIdAndRemove(req.params.id).populate('owner');
    if (!event) return res.status(404).json({ message: 'No event found.' });
    res.status(200).json({ event });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEvent = await Event.findById(req.params.id).populate('owner');
    if (!tempEvent) return res.status(404).json({ message: 'No event found.' });
    if (!(tempEvent.owner.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ message: 'Not updated by the event owner or admin.' });

    const updatedEvent = mergeDeep(tempEvent, req.body)

    await Event.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedEvent
      },
      { new: true },
    );
    
    res.status(200).json({ event: updatedEvent });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
