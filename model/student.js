const mongoose = require('mongoose');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const studentSchema = new mongoose.Schema({
	name: {
		type: String,
		min: 4,
		max: 51,
		required: true
	},
	age: {
		type: Number,
		require: true
	},
	dob: {
		type: Date,
		require: true
	},
	semail: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
	},
	college: {
		type: String,
		require: true
	},
	createremail: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
	}
});

function validateStudent(register) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		age: Joi.number().required(),
		dob: Joi.date().format('YYYY-MM-DD'),
		college: Joi.string().required(),
		semail: Joi.string().min(5).max(255).required().email(),
	};
	return Joi.validate(register, schema);
}
const Student = mongoose.model('student ', studentSchema);
exports.studentSchema = studentSchema;
exports.Student = Student;
exports.validateStudent = validateStudent;