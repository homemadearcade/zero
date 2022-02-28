import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';

const router = Router();

const lobbys = [
  {
    participantEmail: 'email0@email.com',
    startTime: '8:00 PM',
    id: '1000'
  }
];

router.get('/', async (req, res) => {
  try {    
    res.json({
      lobbys
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {

    const lobbyFound = lobbys.filter((l) => {
      if(l.id === req.params.id) {
        return true
      } else {
        return false
      }
    })[0]

    res.json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byEmail/:email', async (req, res) => {
  try {
    const lobbysFound = lobbys.filter((l) => {
      if(l.participantEmail === req.params.email) {
        return true
      } else {
        return false
      }
    })

    if(lobbysFound.length == 0) {
      res.status(500).json({ message: 'No lobby found for ' + req.params.email});
      return
    }

    res.json({ lobby: lobbysFound[0] });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  try {
    let lobby = {
      participantEmail: req.body.participantEmail,
      startTime: req.body.startTime,
      id: Math.ceil(Math.random() * 1000)
    };

    lobbys.push(lobby)

    res.status(200).json({ lobby: lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {

    let index
    const lobbyFound = lobbys.filter((l, i) => {
      if(l.id === req.params.id) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    lobbys.splice(index, 1);

    res.json({ lobby: lobbyFound });

    res.status(200).json({ lobby: lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {

    const lobbyFound = lobbys.filter((l) => {
      if(l.id === req.params.id) {
        return true
      } else {
        return false
      }
    })[0]

    lobbyFound.participantEmail = req.body.participantEmail
    lobbyFound.startTime = req.body.startTime

    res.status(200).json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
