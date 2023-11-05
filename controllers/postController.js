const express = require('express');

const Post = require("../models/post");
const Comment = require("../models/comment");
const PostTag = require("../models/postTag");
const Like = require("../models/like");
const Tag = require("../models/tag");

const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll();
        if(posts.length == 0){
            return res.status(404).send("Posts not found");
        }
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.id == 0){
            return res.status(404).send("Post not found");
        }
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.findByPostId(req.params.id);
        if(comments.length == 0){
            return res.status(404).send("Comments not found");
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/:id/comments', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).send("All input is required");
        }

        const comment = await Comment.save({
            user_id: req.user.id,
            post_id: req.params.id,
            publish_date: new Date(),
            content
        });

        res.status(201).json(comment);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/tags', async (req, res) => {
    try {
        const tags = await PostTag.findByPostId(req.params.id);
        if(tags.length == 0){
            return res.status(404).send("Tags not found");
        }
        res.status(200).json(tags);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/like', async (req, res) => {
    try {
        const result = {
            likes: await Like.postLikesCount(req.params.id),
            dislikes: await Like.postDislikesCount(req.params.id)
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!(title && content && tags)) {
            return res.status(400).send("All input is required");
        }
        for (let i = 0; i < tags.length; i++) {
            if(tags[i].id == 0 || tags[i].id == null || tags[i].id == undefined){
                return res.status(400).send(`Tag id:${tags[i].id} not found`);
            }
            id = await Tag.findById(tags[i].id);
            if(id == 0){
                return res.status(400).send(`Tag id:${tags[i].id} not found`);
            }
        }

        const post = await Post.save({
            user_id: req.user.id,
            publish_date: new Date(),
            title,
            content
        });

        for (let i = 0; i < tags.length; i++) {
            await PostTag.save({
                post_id: post.id,
                tag_id: tags[i].id
            });
        }

        res.status(201).json(post);
    } catch (err) {
        console.log(err);
    }
});

router.post('/:id/like', auth, async (req, res) => {
    try {
        const { type } = req.body;
        Like.deleteUserLike(req.user.id, req.params.id);
        await Like.save({
            user_id: req.user.id,
            publish_date: new Date(),
            post_id: req.params.id,
            comment_id: 0,
            type
        });
        res.status(201).send("Success");
    }
    catch (err) {
        console.log(err);
    }
});


router.patch('/:id', auth, async (req, res) => {
    try {
        const { post_id, title, content, tags } = req.body;

        if (!(post_id && title && content && tags)) {
            return res.status(400).send("All input is required");
        }
        for (let i = 0; i < tags.length; i++) {
            if(tags[i].id == 0 || tags[i].id == null || tags[i].id == undefined){
                return res.status(400).send(`Tag id:${tags[i].id} not found`);
            }
            id = await Tag.findById(tags[i].id);
            if(id == 0){
                return res.status(400).send(`Tag id:${tags[i].id} not found`);
            }
        }

        const post = await Post.findById(post_id);
        if(post.id == 0){
            return res.status(404).send("Post not found");
        }
        if(!(post.user_id == req.user.id || req.user.role == 'admin')){
            return res.status(403).send("Access denied");
        }

        const updatedPost = await Post.save({
            id: post_id,
            user_id: req.user.id,
            publish_date: new Date(),
            title,
            content
        });

        await PostTag.deleteByPostId(post_id);

        for (let i = 0; i < tags.length; i++) {
            await PostTag.save({
                post_id: post_id,
                tag_id: tags[i].id
            });
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.id == 0){
            return res.status(404).send("Post not found");
        }
        if(!(post.user_id == req.user.id || req.user.role == 'admin')){
            return res.status(403).send("Access denied");
        }
        await Post.deleteById(req.params.id);
        res.status(200).send("Post deleted");
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.id == 0){
            return res.status(404).send("Post not found");
        }
        if(!(post.user_id == req.user.id || req.user.role == 'admin')){
            return res.status(403).send("Access denied");
        }
        await Like.deleteUserLike(req.user.id, req.params.id);
        res.status(200).send("Success");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;


