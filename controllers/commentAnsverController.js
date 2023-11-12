const express = require('express');

const CommentAnswer = require('../models/commentAnswer');

const router = express.Router();

const auth = require('../middleware/auth');

router.get('/:id', async (req, res) => {
    try {
        const commentAnswer = await CommentAnswer.findById(req.params.id);
        if(commentAnswer.id == 0){
            return res.status(404).send("Comment answer not found");
        }
        res.status(200).json(commentAnswer);
    }
    catch (err) {
        console.log(err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).send("All input is required");
        }

        const commentAnswer = await CommentAnswer.update({
            id: req.params.id,
            content
        });

        res.status(200).json(commentAnswer);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const commentAnswer = await CommentAnswer.findById(req.params.id);
        if(commentAnswer.id == 0){
            return res.status(404).send("Comment answer not found");
        }
        if(commentAnswer.user_id != req.user.id){
            return res.status(403).send("Access denied");
        }
        await CommentAnswer.delete(req.params.id);
        res.status(200).send("Success");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;