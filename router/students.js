const auth = require('../middleware/authonticate');
const { Student, validateStudent } = require("../model/student")
const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const _ = require('lodash');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

router.get('/', auth, async (req, res) => {
    const createremail = req.user.email;
    let student = await Student.find({ createremail });
    if (!student.length) return res.status(404).send('No recod for user' + createremail);

    res.status(200).send(student);
})
router.get('/:name', auth, async (req, res) => {
    const createremail = req.user.email;
    let student = await Student.find({ name: { $regex: req.params.name, $options: 'i' }, createremail });
    if (!student.length) return res.status(404).send('No recod found');

    res.status(200).send(student);
})

router.get('/age/:age1/:age2', auth, async (req, res) => {
    const createremail = req.user.email;
    let student = await Student.find({ age: { $gte: req.params.age1, $lte: req.params.age2 }, createremail });
    if (!student.length) return res.status(404).send('No record found')

    res.status(200).send(student);

})

router.get('/dob/:dob1/:dob2', auth, async (req, res) => {

    //req.params.dob2 = Joi.date().format('YYYY-MM-DD');

    const createremail = req.user.email;
    let student = await Student.find({ dob: { $gte: req.params.dob1, $lte: req.params.dob2 }, createremail });

    if (!student.length) return res.status(400).send('No record found.');

    res.status(200).send(student);

})

router.post('/', auth, async (req, res) => {
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = new Student(_.pick(req.body, ['name', 'age', 'dob', 'semail', 'college', 'createremail']));
    student.createremail = req.user.email;
    await student.save();
    res.send((_.pick(req.body, ['name', 'age', 'dob', 'semail', 'college', 'createremail'])))

})

router.put('/:id', auth, async (req, res) => {
    let student = await Student.findById(req.params.id)
    if (!student.length) return res.status(404).send('The student with given Id was not found');

    if (student.createremail === req.user.email) {
        const { error } = validateStudent(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        student = await Student.findByIdAndUpdate(req.params.id, { name: req.body.name, age: req.body.age, dob: req.body.dob, semail: req.body.semail, college: req.body.college }, { new: true });

        res.status(200).send(student);
    }
    else return res.status(404).send('The student with given Id was not found');
})

router.delete('/:id', auth, async (req, res) => {
    let student = await Student.findById(req.params.id)
    if (!student.length) return res.status(404).send('The student with given Id was not found');
    if (student.createremail === req.user.email) {

        student = await Student.findByIdAndRemove(req.params.id);
        res.status(200).send(student);
    }
    else return res.status(404).send('The student with given Id was not found');
})

module.exports = router;