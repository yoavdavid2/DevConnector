import Router from 'express';
import checkAPIs from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../../Models/User.js';
const router = Router();
const { check, validationResult } = checkAPIs;
const MIN_PASS_CHARS = 6;

/*
@route  POST api/users
@desc   Register user
@access Public
*/
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      `Please include a password with ${MIN_PASS_CHARS} or more characters`
    ).isLength({
      min: MIN_PASS_CHARS,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating (for only appropriate images)
        d: 'mm', // default image
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

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
