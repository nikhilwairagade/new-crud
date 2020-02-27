const auth = require('../middleware/authonticate');
const { Student, validateStudent } = require('../model/student')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
router.get('/', auth, async (req, res) => {
	const createremail = req.user.email;
	let student = await Student.find({ createremail });
	if (!student.length) return res.status(404).send('No recod for user' + createremail);

	res.status(200).send(student);
});
router.get('/SearchByName/', auth, async (req, res) => {

	if (!req.query.name.length) return res.status(400).send('Invalid Request');

	const createremail = req.user.email;

	let student = await Student.find({ name: { $regex: req.query.name, $options: 'i' }, createremail });
	if (!student.length) return res.status(404).send('No recod found');

	res.status(200).send(student);
});

router.get('/SearchByAge/', auth, async (req, res) => {

	if (!req.query.ageAfter.length || !req.query.ageBefor.length) return res.status(400).send('Invalid Request');

	const createremail = req.user.email;

	let student = await Student.find({ age: { $gte: req.query.ageAfter, $lte: req.query.ageBefor }, createremail });
	if (!student.length) return res.status(404).send('No record found');

	res.status(200).send(student);

});

router.get('/SearchBydob/', auth, async (req, res) => {

	const date1 = moment(req.query.afterdob, 'YYYY-MM-DD', true).isValid();
	const date2 = moment(req.query.befordob, 'YYYY-MM-DD', true).isValid();
	if (date1 != true || date2 != true) return res.status(400).send('Invalid Request');

	const createremail = req.user.email;
	let student = await Student.find({ dob: { $gte: req.query.afterdob, $lte: req.query.befordob }, createremail });

	if (!student.length) return res.status(400).send('No record found.');

	res.status(200).send(student);

});

router.post('/', auth, async (req, res) => {
	const { error } = validateStudent(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let student = new Student(_.pick(req.body, ['name', 'age', 'dob', 'semail', 'college', 'createremail']));
	student.createremail = req.user.email;
	await student.save();
	res.send((_.pick(req.body, ['name', 'age', 'dob', 'semail', 'college', 'createremail'])));
});

router.put('/:id', auth, async (req, res) => {

	if(!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(404).send('Invalid ID');

	let student = await Student.findById(req.params.id)
	if (!student.length) return res.status(404).send('The student with given Id was not found');

	if (student.createremail === req.user.email) {
		const {error}  = validateStudent(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		student = await Student.findByIdAndUpdate(req.params.id, { name: req.body.name, age: req.body.age, dob: req.body.dob, semail: req.body.semail, college: req.body.college }, { new: true });
		res.status(200).send(student);
	}
	else return res.status(404).send('The student with given Id was not found');
});

router.delete('/:id', auth, async (req, res) => {
	if(!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(404).send('Invalid ID');

	let student = await Student.findById(req.params.id);
	if (!student.length) return res.status(404).send('The student with given Id was not found');
	if (student.createremail === req.user.email) {
		student = await Student.findByIdAndRemove(req.params.id);
		res.status(200).send(student);
	}
	else return res.status(404).send('The student with given Id was not found');
});

module.exports = router;

//swagger 