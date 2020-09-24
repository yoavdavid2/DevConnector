import Router from 'express';
import checkAPIs from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import auth from '../../middleware/auth.js';
import User from '../../Models/User.js';

const router = Router();
const { check, validationResult } = checkAPIs;

/*
@route  GET api/auth
@desc   Test route
@access Public
*/
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/*
@route  POST api/auth
@desc   Authenticate user & get token
@access Public
*/
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', `Password is required`).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const doesPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!doesPasswordMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
