const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const auth = require('./middleware/auth');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const commentAnswerController = require('./controllers/commentAnswerController');
const tagController = require('./controllers/tagController');


app.use(express.json());

app.use('/api/auth', authController);
app.use('/api/users', userController);
app.use('/api/posts', postController);
app.use('/api/comments', commentController);
app.use('/api/comment-answers', commentAnswerController);
app.use('/api/tags', tagController);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});