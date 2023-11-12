const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const auth = require('./middleware/auth');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');


app.use(express.json());

app.use('/api/auth', authController);
app.use('/api/users', userController);
app.use('/api/posts', postController);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});