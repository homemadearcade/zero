import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('geting callback')
    next()
  },
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const token = req.user.generateJWT();
    console.log('token', token, clientUrl)
    res.cookie('x-auth-cookie', token);
    res.redirect('https://homemadearcade.herokuapp.com/OAuthSuccess');
  },
);

export default router;
