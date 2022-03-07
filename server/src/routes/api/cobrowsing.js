import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import User from '../../models/User';

const ON_COBROWSING_UPDATE = 'ON_COBROWSING_UPDATE'
const ON_COBROWSING_SUBSCRIBED = 'ON_COBROWSING_SUBSCRIBED'

const router = Router();

router.post('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if(req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to register cobrowse.' });
    }

    req.socket.join('cobrowsing@'+req.params.id);
    req.app.get('socketSessions').findSession(req.params.id).emit(ON_COBROWSING_SUBSCRIBED);
    
    const user = await User.findById(req.params.id)
    res.status(200).json({ cobrowsingUser: user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/stop/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if(req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to unregister this cobrowse.' });
    }

    req.socket.leave('cobrowsing@'+req.params.id);    
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privileges to update this users cobrowse state.' });
    }

    req.io.to('cobrowsing@'+req.params.id).emit(ON_COBROWSING_UPDATE, {
      userId: req.params.id,
      cobrowsingState: req.body.cobrowsingState
    });

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
