const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { login, password, confirm, email } = req.body;

        if (!(login && password && confirm && email)) {
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

        encryptedPassword = await bcrypt.hash(password, 10);

        let user = await User.save({
            login,
            password: encryptedPassword,
            email
        });

        const token = jwt.sign(
            { user_id: user.id, role: user.role},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user = user.safe();
        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!(login && password)) {
            return res.status(400).send("All input is required");
        }

        let user = await User.findByLogin(login);

        if (user.id == 0) {
            return res.status(400).send("Invalid Credentials");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send("Invalid Credentials");
        }

        const token = jwt.sign(
            { user_id: user.id, role: user.role },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user = user.safe();
        user.token = token;

        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;