import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import cobrowsingRoutes from './cobrowsing';
import lobbyInstanceRoutes from './lobbyInstance';
import arcadeGameRoutes from './arcadeGames';
import awsRoutes from './aws';
import ticketedEventRoutes from './ticketedEvents'
import ticketPurchaseRoutes from './ticketPurchases'
import interfacePresetRoutes from './interfacePresets'
import codrawingRoutes from './codrawing'
import gameRoomInstanceRoutes from './gameRoomInstance'
import canvasImagesRoutes from './canvasImages'
import experienceModelRoutes from './experienceModel'
import entityClassRoutes from './entityClass'

const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/lobbyInstance', lobbyInstanceRoutes);
router.use('/cobrowsing', cobrowsingRoutes);
router.use('/codrawing', codrawingRoutes);
router.use('/gameRoomInstance', gameRoomInstanceRoutes);
router.use('/arcadeGames', arcadeGameRoutes);
router.use('/ticketedEvents', ticketedEventRoutes);
router.use('/ticketPurchases', ticketPurchaseRoutes);
router.use('/interfacePresets', interfacePresetRoutes);
router.use('/experienceModel', experienceModelRoutes);
router.use('/entityClass', entityClassRoutes);
router.use('/aws', awsRoutes);
router.use('/canvasImages', canvasImagesRoutes);

'routes register', router.stack.map((router) => {
  // console.log(router.regexp)
  return router.handle.stack.map((route) => {
    // console.log(route)
  })
})

export default router;
