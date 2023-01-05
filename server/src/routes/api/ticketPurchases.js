import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { mergeDeep } from '../../utils/utils';
import TicketPurchase from '../../models/TicketPurchase';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const ticketPurchases = await TicketPurchase.find().sort({ createdAt: 'desc' }).select('ticketPurchase user lobby ticketId dateId').populate('user ticketedEvent lobby');

    res.json({
      ticketPurchases: ticketPurchases.map((m) => {
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
    const ticketPurchase = await TicketPurchase.findById(req.params.id).populate('user ticketedEvent lobby');
    if (!ticketPurchase) return res.status(404).json({ message: 'No ticket purchase found.' });
    res.json({ ticketPurchase: ticketPurchase.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byEvent/:eventId', async (req, res) => {
  try {
    const ticketPurchases = await TicketPurchase.find({ ticketedEvent: req.params.eventId }).populate('user ticketedEvent lobby');
    if (!ticketPurchases) return res.status(404).json({ message: 'No ticket purchase found.' });
    res.json({ ticketPurchases: ticketPurchases.map((tp) => tp.toJSON() )});
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateGame(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({ message: 'Not created by the ticket purchase owner or admin.' });
  }

  try {
    let ticketPurchase = await TicketPurchase.create({
      ...req.body
    });

    ticketPurchase = await ticketPurchase.populate('user').execPopulate();

    res.status(200).json({ ticketPurchase: ticketPurchase.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// router.delete('/:id', requireJwtAuth, async (req, res) => {
//   try {
//     const tempTicketPurchase = await TicketPurchase.findById(req.params.id).populate('user');
//     if (!(tempTicketPurchase.user.id === req.user.id || req.user.role === 'ADMIN'))
//       return res.status(400).json({ ticketPurchase: 'Not the ticket purchase owner or admin.' });

//     const ticketPurchase = await TicketPurchase.findByIdAndRemove(req.params.id);
//     if (!ticketPurchase) return res.status(404).json({ message: 'No ticket purchase found.' });
//     res.status(200).json({ ticketPurchase });
//   } catch (err) {
//     res.status(500).json({ messsage: 'Something went wrong.' });
//   }
// });

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempTicketPurchase = await TicketPurchase.findById(req.params.id).populate('user');
    if (!tempTicketPurchase) return res.status(404).json({ message: 'No ticket purchase found.' });
    if (!(tempTicketPurchase.user.id === req.user.id || req.user.role === 'ADMIN')) return res.status(400).json({ message: 'Not updated by the ticketed purchase owner or admin.' });

    const updatedTicketPurchase = mergeDeep(tempTicketPurchase, req.body)

    await TicketPurchase.findByIdAndUpdate(
      req.params.id,
      { 
        ...updatedTicketPurchase
      },
      { new: true },
    );
    
    res.status(200).json({ ticketPurchase: updatedTicketPurchase });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
