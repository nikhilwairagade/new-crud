/* eslint-disable indent */
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 55,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

registrationSchema.methods.generateAuthToken = function () {
    //const token = jwt.sign({ email: this.email }, config.get('jwtPrivateKey'));
    const token = jwt.sign({ email: this.email }, 'jwtuserkey');
    return token;
};

function validateRegister(register) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(register, schema);
}
const Register = mongoose.model('Register_user ', registrationSchema);
exports.registrationSchema = registrationSchema;
exports.Register = Register;
exports.validate = validateRegister;