import express from 'express';
import connectDB from './config/db.js';

import UsersRoute from './routes/api/users.js';
import AuthRoute from './routes/api/auth.js';
import ProfileRoute from './routes/api/profile.js';
import PostsRoute from './routes/api/posts.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res, next) => {
  res.send('Running!!!! YAY');
});

// Define routes
app.use('/api/users', UsersRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/profile', ProfileRoute);
app.use('/api/posts', PostsRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
