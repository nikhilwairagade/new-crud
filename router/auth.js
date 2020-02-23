const Joi = require('joi');
const { Register } = require("../model/register")
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
app.use(express.static('./htmlPage'));

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Register.findOne({ email: req.body.usermail })
    if (!user) return res.status(400).send('Invalid Email or password.')

    const validpassword = await bcrypt.compare(req.body.password, user.password)
    if (!validpassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken();
    res.header('x-auth', token).send(token);

    // try {
    //     // res.sendFile('/htmlPage/dashboard.html');
    //     // console.log(path.join('dashboard.html'))
    //     // res.sendFile(path.join('dashboard.html'));

    //     res.sendFile('dashboard.html', {
    //         root: path.join(__dirname, './')
    //     })


    // }
    // catch (ex) {

    //     console.log("some problem", ex.message);
    // }

})

function validate(auth) {
    const schema = {
        usermail: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(auth, schema);
}

module.exports = router;