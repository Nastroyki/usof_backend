const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const auth = require('./middleware/auth');
const cors = require("cors");

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const commentAnswerController = require('./controllers/commentAnswerController');
const tagController = require('./controllers/tagController');


app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};


app.use(cors(corsOptions));
app.use(fileUpload({}));

app.use('/api/auth', authController);
app.use('/api/users', userController);
app.use('/api/posts', postController);
app.use('/api/comments', commentController);
app.use('/api/comment-answers', commentAnswerController);
app.use('/api/tags', tagController);

app.get('/img/avatars/:login', async (req, res) => {
    try {
        res.sendFile(process.cwd() + `/avatars/${req.params.login}.jpg`);
    } catch (err) {
        console.log(err);
    }
});
app.get('/img/avatars', async (req, res) => {
    try {
        res.sendFile(process.cwd() + `/default-avatar.jpg`);
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});