const { Register, validate } = require("../model/register")
const mongoose = require('mongoose');
const express = require("express");
const _ = require('lodash');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Register.findOne({ email: req.body.usermail });
    if (user) return res.status(400).send('User already registered.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const register = new Register({
        name: req.body.fullname,
        email: req.body.usermail,
        password: password
    });
    await register.save();
    res.send((_.pick(req.body, ['fullname', 'usermail'])))
})



module.exports = router; 