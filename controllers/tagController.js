const express = require('express');

const PostTag = require("../models/postTag");
const Tag = require("../models/tag");

const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        let { search } = req.query;
        let tags = [];
        if (search && search !== "") {
            tags = await Tag.findAllByTitleBegin(search);
        } else {
            tags = await Tag.findAll();
        }
        if(tags.length == 0){
            return res.status(404).send("Tags not found");
        }
        res.status(200).json(tags);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if(tag.id == 0){
            return res.status(404).send("Tag not found");
        }
        res.status(200).json(tag);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await PostTag.findByTagId(req.params.id);
        if(posts.length == 0){
            return res.status(404).send("Posts not found");
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!(title && description)) {
            return res.status(400).send("All input is required");
        }
        let tag = await Tag.findByTitle(title);
        if (tag.id != 0) {
            return res.status(400).send("Tag already exists");
        }
        tag = await Tag.save({
            title,
            description
        });

        res.status(201).json(tag);
    } catch (err) {
        console.log(err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!(title && description)) {
            return res.status(400).send("All input is required");
        }

        const tag = await Tag.update({
            id: req.params.id,
            title,
            description
        });

        res.status(200).json(tag);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Tag.delete(req.params.id);
        res.status(200).send("Tag deleted");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;