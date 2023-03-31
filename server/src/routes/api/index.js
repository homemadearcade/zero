import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import cobrowsingRoutes from './cobrowsing';
import lobbyInstanceRoutes from './lobbyInstance';
import arcadeGameRoutes from './arcadeGames';
import awsRoutes from './aws';
import ticketedEventRoutes from './ticketedEvents'
import ticketPurchaseRoutes from './ticketPurchases'
import interfacePresetRoutes from './library/interfacePreset'
import codrawingRoutes from './codrawing'
import gameRoomInstanceRoutes from './gameRoomInstance'
import canvasImagesRoutes from './canvasImages'
import experienceModelRoutes from './experienceModel'
import entityModelRoutes from './library/entityModel'
import relationRoutes from './library/relation'
import relationTagRoutes from './library/relationTag'
import effectRoutes from './library/effect'
import eventRoutes from './library/event'
import libraryRoutes from './library/library'

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
router.use('/interfacePreset', interfacePresetRoutes);
router.use('/experienceModel', experienceModelRoutes);
router.use('/entityModel', entityModelRoutes);
router.use('/aws', awsRoutes);
router.use('/relation', relationRoutes);
router.use('/relationTag', relationTagRoutes);
router.use('/effect', effectRoutes);
router.use('/event', eventRoutes);
router.use('/canvasImages', canvasImagesRoutes);
router.use('/library', libraryRoutes);

'routes register', router.stack.map((router) => {
  // console.log(router.regexp)
  return router.handle.stack.map((route) => {
    // console.log(route)
  })
})

export default router;
