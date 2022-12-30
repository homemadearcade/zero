import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import cobrowsingRoutes from './cobrowsing';
import lobbysRoutes from './lobbys';
import arcadeGameRoutes from './arcadeGames';
import awsRoutes from './aws';
import ticketedEventRoutes from './ticketedEvents'
import codrawingRoutes from './codrawing'

const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/lobbys', lobbysRoutes);
router.use('/cobrowsing', cobrowsingRoutes);
router.use('/codrawing', codrawingRoutes);
router.use('/arcadeGames', arcadeGameRoutes);
router.use('/ticketedEvents', ticketedEventRoutes);

router.use('/aws', awsRoutes);

'routes register', router.stack.map((router) => {
  // console.log(router.regexp)
  return router.handle.stack.map((route) => {
    // console.log(route.route.path)
  })
})

export default router;
