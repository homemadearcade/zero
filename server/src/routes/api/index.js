import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import cobrowsingRoutes from './cobrowsing';
import lobbysRoutes from './lobbys';
import gameRoutes from './games';

const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/lobbys', lobbysRoutes);
router.use('/cobrowsing', cobrowsingRoutes);
router.use('/games', gameRoutes);

export default router;
