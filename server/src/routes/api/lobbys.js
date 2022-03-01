import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

function findLobbyById(id, res) {
  const lobbyFound = lobbys.filter((l) => {
    if(l.id === id) {
      return true
    } else {
      return false
    }
  })[0]

  if(!lobbyFound) {
    res.status(500).json({ message: 'No lobby found for id: ' + id});
    return null
  }

  return lobbyFound
}


const lobbys = [
  {
    participantEmail: 'email0@email.com',
    startTime: '8:00 PM',
    id: uuidv4()
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
    const lobbyFound = findLobbyById(req.params.id, res)
    if(!lobbyFound) return

    res.json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byEmail/:email', async (req, res) => {
  try {
    const lobbyFound = findLobbyById(req.params.id, res)
    if(!lobbyFound) return

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
      id: uuidv4()
    };

    lobbys.push(lobby)

    res.status(200).json({ lobby: lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/leave/:id', requireJwtAuth, async (req, res) => {
  try {
    const lobbyFound = findLobbyById(req.params.id, res)
    if(!lobbyFound) return




  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/join/:id', requireJwtAuth, async (req, res) => {
  try {
    const lobbyFound = findLobbyById(req.params.id, res)
    if(!lobbyFound) return

    if (req.user.role === 'ADMIN') {
      return res.status(200)
    } else if(lobbyFound.participantEmail === req.user.email){
      return res.status(200)
    } else {
      return res.status(400).json({ message: 'You do not have permission to join that lobby.' });
    }

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to delete that lobby.' });
    }

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

    res.status(200).json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {

    const lobbyFound = findLobbyById(req.params.id, res)
    if(!lobbyFound) return

    lobbyFound.participantEmail = req.body.participantEmail
    lobbyFound.startTime = req.body.startTime

    res.status(200).json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
