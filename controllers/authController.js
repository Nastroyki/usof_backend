const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function generateCode() {
    let code = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
}

async function wrapedSendMail(mailOptions) {
    return new Promise((resolve, reject) => {

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("error is " + error);
                    resolve(false); // or use rejcet(false) but then you will have to handle errors
                }
                else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                }
            });
   });
}


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

            let email_code = generateCode();

            let mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Your registration code for USOF',
                text: 'Your registration code is ' + email_code
            };

            if (!await wrapedSendMail(mailOptions)) {
                return res.status(500).send("Email sending error");
            }

            let user = await User.save({
                login,
                password: encryptedPassword,
                email,
                email_code
            });

            res.status(201).json(user.safe());
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

            if (user.email_code != "" && user.email_code != null) {
                user.email_code = generateCode();
                user = await User.save(user);
                let mailOptions = {
                    from: process.env.MAIL_USER,
                    to: user.email,
                    subject: 'Your registration code for USOF',
                    text: 'Your registration code is ' + user.email_code
                };
                if (!await wrapedSendMail(mailOptions)) {
                    return res.status(500).send("Email sending error");
                }
                return res.status(400).send("Email is not confirmed! New code was sent to your email");
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

    router.post('/verify-email', async (req, res) => {
        try {
            const { login, password, code, email } = req.body;

            if (!(login && password && (code || email))) {
                return res.status(400).send("All input is required");
            }

            let user = await User.findByLogin(login);

            if (user.id == 0) {
                return res.status(400).send("Invalid Login");
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).send("Invalid Password");
            }

            if (email != null) {
                user.email = email;
                user.email_code = generateCode();
                user = await User.save(user);
                let mailOptions = {
                    from: process.env.MAIL_USER,
                    to: user.email,
                    subject: 'Your registration code for USOF',
                    text: 'Your registration code is ' + user.email_code
                };
                if (!await wrapedSendMail(mailOptions)) {
                    return res.status(500).send("Email sending error");
                }
                return res.status(201).send("Email was changed! New code was sent to your email");
            }

            if (user.email_code != code) {
                return res.status(400).send("Invalid Code");
            }

            user.email_code = "";
            user = await User.save(user);
            res.status(200).send("Email was confirmed");
        }
        catch (err) {
            console.log(err);
        }
    });

    router.post("/password-reset", async (req, res) => {
        try {
            const { login, email } = req.body;

            if (!(login || email)) {
                return res.status(400).send("All input is required");
            }

            let user;

            if (login != null) {
                user = await User.findByLogin(login);
            }
            else {
                user = await User.findByEmail(email);
            }

            if (user.id == 0) {
                return res.status(400).send("No such user");
            }

            user.reset_code = generateCode();
            user = await User.save(user);
            let mailOptions = {
                from: process.env.MAIL_USER,
                to: user.email,
                subject: 'Your reset code for USOF',
                text: 'Your reset code is ' + user.reset_code
            };
            if (!await wrapedSendMail(mailOptions)) {
                return res.status(500).send("Email sending error");
            }
            res.status(200).send("Reset code was sent to your email");
        }
        catch (err) {
            console.log(err);
        }
    });

    router.post("/password-reset-confirm", async (req, res) => {
        try {
            const { login, email, password, code } = req.body;

            if (!(((login || email) && password && code))) {
                return res.status(400).send("All input is required");
            }

            let user;

            if (login != null) {
                user = await User.findByLogin(login);
            }
            else {
                user = await User.findByEmail(email);
            }

            if (user.id == 0) {
                return res.status(400).send("No such user");
            }

            if (user.reset_code != code) {
                return res.status(400).send("Invalid Code");
            }

            user.reset_code = "";
            user.password = await bcrypt.hash(password, 10);
            user = await User.save(user);
            res.status(200).send("Password was changed");
        }
        catch (err) {
            console.log(err);
        }
    });

    module.exports = router;