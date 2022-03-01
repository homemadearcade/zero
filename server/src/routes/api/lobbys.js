import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const lobbys = [
  {
    participantEmail: 'email0@email.com',
    startTime: '8:00 PM',
    id: 'c5ee5f1e-fe16-4296-9f26-162e21e922eb',
    users: []
  }
];

function requireLobbyId(req, res, next) {
  let index

  const lobbyFound = lobbys.filter((l, i) => {
    if(l.id === req.params.id) {
      index = i
      return true
    } else {
      return false
    }
  })[0]

  if(!lobbyFound) {
    res.status(400).json({ message: 'No lobby found with id: ' + req.params.id });
    return 
  }

  req.lobby = lobbyFound
  req.lobbyIndex = index

  next()
}

router.get('/', async (req, res) => {
  try {    
    res.json({
      lobbys
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', requireLobbyId, async (req, res) => {
  try {
    res.json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byEmail/:participantEmail', async (req, res) => {
  try {

    const lobbyFound = lobbys.filter((l, i) => {
      if(l.participantEmail === req.params.participantEmail) {
        return true
      } else {
        return false
      }
    })[0]

    if(!lobbyFound) {
      res.status(400).json({ message: 'No lobby found for: ' + req.params.participantEmail, });
    }
      
    res.json({ lobby: lobbyFound });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  try {
    let lobby = {
      participantEmail: req.body.participantEmail,
      startTime: req.body.startTime,
      id: uuidv4(),
      users: [],
    };

    lobbys.push(lobby)

    res.status(200).json({ lobbys: lobbys });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/remove/:id', requireJwtAuth, requireLobbyId, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privileges to remove user from that lobby.' });
    }

    let index;

    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.user.id) {
        index = i
        return true
      } else {
        return false
      }
    })[0]

    if(!userFound) return

    req.lobby.users.splice(index, 1)

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/join/:id', requireJwtAuth, requireLobbyId, async (req, res) => {
  try {
    const userFound = req.lobby.users.filter((u, i) => {
      if(u.id === req.user.id) {
        return true
      } else {
        return false
      }
    })[0]
    
    if (req.user.role === 'ADMIN') {
      if(!userFound) {
        req.lobby.users.push(req.user)
      }
      return res.status(200).send()
    } else if(req.lobby.participantEmail === req.user.email){
      if(!userFound) {
        req.lobby.users.push(req.user)
      }
      return res.status(200).send()
    } else {
      return res.status(400).json({ message: 'You do not have permission to join that lobby.' });
    }

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, requireLobbyId, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({ message: 'You do not have privileges to delete that lobby.' });
    }

    lobbys.splice(req.lobbyIndex, 1);

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, requireLobbyId, async (req, res) => {
  try {

    req.lobby.participantEmail = req.body.participantEmail
    req.lobby.startTime = req.body.startTime

    res.status(200).json({ lobby: req.lobby });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
