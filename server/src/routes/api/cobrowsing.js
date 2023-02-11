import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import User from '../../models/User';

import { ON_COBROWSING_UPDATE, ON_COBROWSING_SUBSCRIBED, ON_COBROWSING_REMOTE_DISPATCH, SOCKET_SESSIONS_STORE, COBROWSING_ROOM_PREFIX } from '../../constants';

const router = Router();

router.post('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if(req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to register cobrowse.' });
    }

    req.socket.join(COBROWSING_ROOM_PREFIX+req.params.id);

    const socketSession = req.app.get(SOCKET_SESSIONS_STORE).findSession(req.params.id)
    if(socketSession) {
      socketSession.emit(ON_COBROWSING_SUBSCRIBED);
    }
    
    const user = await User.findById(req.params.id)
    res.status(200).json({ cobrowsingUser: user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/stop/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if(req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privelages to unregister this cobrowse.' });
    }

    req.socket.leave(COBROWSING_ROOM_PREFIX+req.params.id);    
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update this users cobrowse state.' });
    }

    req.io.to(COBROWSING_ROOM_PREFIX+req.params.id).emit(ON_COBROWSING_UPDATE, {
      userId: req.params.id,
      remoteState: req.body.remoteState
    });

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/dispatch/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privelages to update this users cobrowse state.' });
    }
    
    const socketSession = req.app.get(SOCKET_SESSIONS_STORE).findSession(req.params.id)
    if(!socketSession) {
      res.status(400).json({ message: 'User not connected to socket, cannot dispatch: ' + req.body.dispatchData.type });
      return
    }

    socketSession.emit(ON_COBROWSING_REMOTE_DISPATCH, {
      dispatchData: req.body.dispatchData,
      action: req.body.action
    });

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

export default router;
