import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import requireSocketAuth from '../../middleware/requireSocketAuth';

import { CODRAWING_ROOM_PREFIX, ON_CODRAWING_STROKE, ON_CODRAWING_SUBSCRIBED, ON_CODRAWING_UNDO } from '../../constants';

const router = Router();

router.post('/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    req.socket.join(CODRAWING_ROOM_PREFIX+req.params.id);
    req.io.to(CODRAWING_ROOM_PREFIX+req.params.id).emit(ON_CODRAWING_SUBSCRIBED, { userMongoId: req.user.id, textureId: req.params.id });

    res.status(200).json({ });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/stop/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    req.socket.leave(CODRAWING_ROOM_PREFIX+req.params.id);    
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.put('/stroke/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  try {
    req.io.to(CODRAWING_ROOM_PREFIX+req.params.id).emit(ON_CODRAWING_STROKE, {
      userMongoId: req.user.id,
      textureId: req.params.id,
      brushId: req.body.brushId,
      stroke: req.body.stroke,
      strokeId: req.body.strokeId,
      operationType: req.body.operationType
    });

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. ' + err });
  }
});

router.post('/undo/:id', requireJwtAuth, requireSocketAuth, async (req, res) => {
  req.io.to(CODRAWING_ROOM_PREFIX+req.params.id).emit(ON_CODRAWING_UNDO);
})

export default router;
