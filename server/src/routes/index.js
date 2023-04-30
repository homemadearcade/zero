import { Router } from 'express';
import localAuthRoutes from './localAuth';
import googleAuthRoutes from './googleAuth';
import apiRoutes from './api';
import { readFileSync, writeFile } from 'fs';
import { resolve } from 'path';

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
router.post('/uploadtest', (req, res) => {
  let startTime = new Date().getTime();
  let dataSize = 0;

  // Each time data is received, report the number of bits each second
  req.on('data', (data) => {
    dataSize += data.length;
  });

  // When all data is received, log it and close the connection;
  req.on('end', () => {
    let currentTime = new Date().getTime();
    let duration =  (currentTime - startTime)/1000;
    var bitsLoaded = dataSize * 8;
    var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);
    res.status(200).send({ });
  })
})

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
