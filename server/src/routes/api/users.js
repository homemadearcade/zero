import { Router } from 'express';
import multer from 'multer';
import { resolve } from 'path';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, validateUser } from '../../models/User';
import Message from '../../models/Message';
import { seedDb } from '../../utils/seed';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '../../../public/images'));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `avatar-${Date.now()}-${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

router.put('/:id/speedTest', requireJwtAuth, async (req, res, next) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privelages to edit this user.' });

    //       //validate name, username and password
    // const { error } = validateUser();
    // if (error) return res.status(400).json({ message: error.details[0].message });

    // let avatarPath = null;
    // if (req.file) {
    //   avatarPath = req.file.filename;
    // }

    if(!tempUser.speedTests) tempUser.speedTests = []

    tempUser.speedTests.push(req.body)

    if(tempUser.speedTests.length > 10) tempUser.speedTests = tempUser.speedTests.slice(-10)

    const user = await User.findByIdAndUpdate(tempUser.id, { $set: tempUser }, { new: true });

    res.status(200).json({ user });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
})

router.put('/:id', [requireJwtAuth, upload.single('avatar')], async (req, res, next) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privelages to edit this user.' });

    //       //validate name, username and password
    // const { error } = validateUser();
    // if (error) return res.status(400).json({ message: error.details[0].message });

    // let avatarPath = null;
    // if (req.file) {
    //   avatarPath = req.file.filename;
    // }

    // if google user provider dont update password
    let password = null;
    if (req.user.provider === 'email' && req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    let existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.id !== tempUser.id) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    existingUser = await User.findOne({ email: req.body.email });
    if (existingUser && existingUser.id !== tempUser.id) {
      return res.status(400).json({ message: 'Email already taken.' });
    }

    if(!tempUser.unlockableInterfaceIds) {
      tempUser.unlockableInterfaceIds = {}
    }

    if(!tempUser.preferences) {
      tempUser.preferences = {}
    }

    //avatar: avatarPath
    const updatedUser = {  ...req.body, password };

    if(req.body.preferences) {
      updatedUser.preferences = { ...tempUser.preferences, ...req.body.preferences }
    }

    if(req.body.unlockableInterfaceIds) {
      updatedUser.unlockableInterfaceIds = { ...tempUser.unlockableInterfaceIds, ...req.body.unlockableInterfaceIds }
    }

    // remove '', null, undefined
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    // console.log(req.body, updatedUser);
    const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

    res.status(200).json({ user });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// router.get('/reseed', async (req, res) => {
//   await seedDb();
//   res.json({ message: 'Database reseeded successfully.' });
// });

router.get('/me', requireJwtAuth, (req, res) => {
  const me = req.user.toJSON();
  res.json({ me });
});

router.get('/:username', requireJwtAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'No user found.' });
    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byId/:id', requireJwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'No user found.' });
    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/byEmail/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'No user found.' });
    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/', requireJwtAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });

    res.json({
      users: users.map((m) => {
        return m.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privelages to delete that user.' });

    // if (['email0@email.com', 'email1@email.com'].includes(tempUser.email))
    //   return res.status(400).json({ message: 'You can not delete seeded user.' });

    //delete all messages from that user
    await Message.deleteMany({ user: tempUser.id });
    //delete user
    const user = await User.findByIdAndRemove(tempUser.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
