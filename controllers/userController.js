const express = require('express');
const sharp = require('sharp');
const User = require("../models/user");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        if(users.length == 0){
            return res.status(404).send("Users not found");
        }
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user.id == 0){
            return res.status(404).send("User not found");
        }
        res.status(200).json(user.safe());
    } catch (err) {
        console.log(err);
    }
});
router.post('/', async (req, res) => {
    if(req.user.role != 'admin'){
        return res.status(403).send("Access denied");
    }
    try {
        const { login, password, confirm, email, role } = req.body;

        if (!(login && password && confirm && email && role)) {
            return res.status(400).send("All input is required");
        }

        if (password !== confirm) {
            return res.status(400).send("Password does not match");
        }

        const loginCheck = await User.findByLogin(login);

        if (loginCheck.id != 0) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const emailCheck = await User.findByEmail(email);

        if (emailCheck.id != 0) {
            return res.status(409).send("Email Already Exist. Please Login");
        }

        if (role != 'admin' && role != 'user') {
            return res.status(409).send("Wrong role");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.save({
            login,
            password: encryptedPassword,
            email,
            role
        });

        res.status(201).json(user.safe());
    } catch (err) {
        console.log(err);
    }
});
router.patch('/avatar', async (req, res) => {
    try {
        const { profile_picture } = req.files;

        if (!(profile_picture)) {
            return res.status(400).send("All input is required");
        }
        if (!(/^image/.test(profile_picture.mimetype))) return res.status(400).send("Wrong file type");
        let size = 500;
        sharp(profile_picture.data)
            .metadata()
            .then(metadata => {
                if (metadata.width > metadata.height) {
                    size = metadata.height;
                } else {
                    size = metadata.width;
                }
                sharp(profile_picture.data)
                    .resize({
                        width: size,
                        height: size,
                        fit: 'cover',
                        position: 'center'
                    }).toFormat('jpg').toFile(process.cwd() + `/avatars/${req.user.login}.jpg`, (err, info) => {
                        if (err) {
                            console.error(err);
                            res.status(400).send("Error");
                            return;
                        }
                        // All good
                        let user = User.findById(req.user.id);
                        user.profile_picture = `/avatars/${req.user.login}.jpg`;
                        User.save(user);
                        res.status(200).send("Success");
                    });
            });
    } catch (err) {
        console.log(err);
    }
});

router.patch('/:id', async (req, res) => {
    if(!(req.user.role == 'admin' || req.user.id == req.params.id)){
        return res.status(403).send("Access denied");
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const { login, password, full_name,  email, role } = req.body;

        user.login = login || user.login;
        user.password = password || user.password;
        user.full_name = full_name || user.full_name;
        user.email = email || user.email;
        user.role = role || user.role;

        await User.save(user);
        res.status(200).send(user.safe());
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.delete('/:id', async (req, res) => {
    if (!(req.user.role == 'admin' || req.user.id == req.params.id)) {
        return res.status(403).send("Access denied");
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        await User.deleteById(req.params.id);
        res.status(200).send("Success");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;