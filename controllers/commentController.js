const express = require('express');

const Comment = require("../models/comment");
const Like = require("../models/like");


const router = express.Router();

const auth = require('../middleware/auth');

router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(comment.id == 0){
            return res.status(404).send("Comment not found");
        }
        res.status(200).json(comment);
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/:id/likes', async (req, res) => {
    try {
        const result = {
            likes: await Like.commentLikesCount(req.params.id),
            dislikes: await Like.commentDislikesCount(req.params.id)
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
    }
});

router.post('/:id/likes', async (req, res) => {
    try {
        const { type } = req.body;

        if (!(type)) {
            return res.status(400).send("All input is required");
        }

        if (type != 'like' && type != 'dislike') {
            return res.status(400).send("Wrong type");
        }

        const like = await Like.save({
            user_id: req.user.id,
            publish_date: new Date(),
            post_id: 0,
            comment_id: req.params.id,
            type
        });

        res.status(201).json(like);
    } catch (err) {
        console.log(err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).send("All input is required");
        }

        const comment = await Comment.update({
            id: req.params.id,
            content
        });

        res.status(200).json(comment);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(comment.id == 0){
            return res.status(404).send("Comment not found");
        }
        if(comment.user_id != req.user.id){
            return res.status(403).send("Access denied");
        }
        await Comment.delete(req.params.id);
        res.status(200).send("Success");
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id/likes', auth, async (req, res) => {
    try {
        const like = await Like.deleteUserLikeComment(req.user.id, req.params.id);
        if(like.id == 0){
            return res.status(404).send("Like not found");
        }
        await Like.delete(like.id);
        res.status(200).send("Success");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;