import { Router } from 'express';
import localAuthRoutes from './localAuth';
import googleAuthRoutes from './googleAuth';
import apiRoutes from './api';
import { readFileSync, writeFile } from 'fs';
import { resolve } from 'path';
import authRoutes from './auth'

const router = Router();

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/*
AUTH

GET /auth/google
GET /auth/google/callback

POST /auth/login
POST /auth/register
GET /auth/logout

*/
router.use('/auth', localAuthRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/auth', authRoutes)

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// API
router.use('/api', apiRoutes);
// fallback 404
router.use('/api', (req, res) => res.status(404).json('No route for this path'));

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/// MISC
router.get('/spriteSheets', (req,res)=>{
  const { spriteSheetIds } =  req.query;

  const sss = []
  spriteSheetIds.forEach((id) => {
    const data = readFileSync(resolve(__dirname, '../../../data/sprite/' +id+'.json'), 'utf8')
    const parsedData = JSON.parse(data)
    sss.push(parsedData)
  })

  res.send({spriteSheets: sss})
})

export default router;
