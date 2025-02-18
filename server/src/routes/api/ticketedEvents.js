import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import TicketedEvent from '../../models/TicketedEvent';
import { generateUniqueId } from '../../utils/utils';
import { TICKETED_EVENT_DID } from '../../constants';
import { APP_ADMIN_ROLE } from "../../constants/index";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const ticketedEvents = await TicketedEvent.find().sort({ createdAt: 'desc' }).select('user title subtitle dates tickets').populate('user');

    res.json({
      ticketedEvents: ticketedEvents.map((m) => {
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
    const ticketedEvent = await TicketedEvent.findById(req.params.id).populate('user');
    if (!ticketedEvent) return res.status(404).json({ message: 'No ticketed event found.' });
    res.json({ ticketedEvent: ticketedEvent.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/ticketedEventId/:ticketedEventId', async (req, res) => {
  try {
    const ticketedEvent = await TicketedEvent.findOne({ ticketedEventId: req.params.ticketedEventId }).populate('owner');
    if (!ticketedEvent) return res.status(404).json({ message: 'No ticketedEvent found.' });
    res.json({ ticketedEvent: ticketedEvent.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  if (!(req.body.userMongoId === req.user.id || req.user.roles[APP_ADMIN_ROLE])) {
    return res.status(400).json({ message: 'Not created by the ticketed event owner or admin.' });
  }

  try {
    let ticketedEvent = await TicketedEvent.create({
      ...req.body,
      user: req.body.userMongoId,
      ticketedEventId: TICKETED_EVENT_DID + generateUniqueId(),
    });

    ticketedEvent = await ticketedEvent.populate('user').execPopulate();

    res.status(200).json({ ticketedEvent: ticketedEvent.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempTicketedEvent = await TicketedEvent.findById(req.params.id).populate('user');
    if (!(tempTicketedEvent.user.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ ticketedEvent: 'Not the ticketed event owner or admin.' });

    const ticketedEvent = await TicketedEvent.findByIdAndRemove(req.params.id).populate('user');
    if (!ticketedEvent) return res.status(404).json({ message: 'No ticketed event found.' });
    res.status(200).json({ ticketedEvent });
  } catch (err) {
    res.status(500).json({ messsage: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempTicketedEvent = await TicketedEvent.findById(req.params.id).populate('user');
    if (!tempTicketedEvent) return res.status(404).json({ message: 'No ticketed event found.' });
    if (!(tempTicketedEvent.user.id === req.user.id || req.user.roles[APP_ADMIN_ROLE]))
      return res.status(400).json({ message: 'Not updated by the ticketed event owner or admin.' });

    const updatedTicketedEvent = mergeDeep(tempTicketedEvent, req.body)

    await TicketedEvent.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedTicketedEvent
      },
      { new: true },
    );
    
    res.status(200).json({ ticketedEvent: updatedTicketedEvent });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
