import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import cobrowsingRoutes from './cobrowsing';
import lobbysRoutes from './lobbys';
import arcadeGameRoutes from './arcadeGames';
import awsRoutes from './aws';
import ticketedEventRoutes from './ticketedEvents'
import ticketPurchaseRoutes from './ticketPurchases'
import interfacePresetRoutes from './interfacePresets'
import codrawingRoutes from './codrawing'
import gameRoomRoutes from './gameRoom'
import canvasImagesRoutes from './canvasImages'
import experienceRoutes from './experiences'

const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/lobbys', lobbysRoutes);
router.use('/cobrowsing', cobrowsingRoutes);
router.use('/codrawing', codrawingRoutes);
router.use('/gameRoom', gameRoomRoutes);
router.use('/arcadeGames', arcadeGameRoutes);
router.use('/ticketedEvents', ticketedEventRoutes);
router.use('/ticketPurchases', ticketPurchaseRoutes);
router.use('/interfacePresets', interfacePresetRoutes);
router.use('/experience', experienceRoutes);
router.use('/aws', awsRoutes);
router.use('/canvasImages', canvasImagesRoutes);
router.use('/experiences', experienceRoutes);

'routes register', router.stack.map((router) => {
  // console.log(router.regexp)
  return router.handle.stack.map((route) => {
    // console.log(route)
  })
})

export default router;
