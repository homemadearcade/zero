import { Router } from 'express';
import Joi from 'joi';
import faker from 'faker';

import User from '../models/User';
import requireLocalAuth from '../middleware/requireLocalAuth';
import { registerSchema } from '../services/validators';
import { USER_DID } from '../constants';
import { generateUniqueId } from '../utils/utils';

const router = Router();

router.post('/login', requireLocalAuth, (req, res) => {
  const token = req.user.generateJWT();
  const me = req.user.toJSON();
  res.json({ token, me });
});

router.post('/register', async (req, res, next) => {
  const { error } = Joi.validate(req.body, registerSchema);
  if (error) {
    return res.status(422).send({ message: error.details[0].message });
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUserEmail = await User.findOne({ email });

    if (existingUserEmail) {
      return res.status(422).send({ message: 'Email is in use' });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(422).send({ message: 'Username is in use' });
    }

    try {
      const newUser = await new User({
        provider: 'email',
        email,
        userId: USER_DID + generateUniqueId(),
        password,
        username,
        name,
        // avatar: faker.image.avatar(),
      });

      newUser.registerUser(newUser, (err, user) => {
        if (err) throw err;
        const token = newUser.generateJWT();
        const me = newUser.toJSON();
        res.json({ token, me });
      });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.send(false);
});

export default router;
