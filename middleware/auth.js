import jwt from 'jsonwebtoken';
import config from 'config';

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    // status 401 - not authorized
    return res.status(401).json({ msg: 'No token, authorization denied' });
  } else {
    // Verify the token
    try {
      const decoded = jwt.verify(token, config.get('jwtToken'));
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }
}

export default auth;
