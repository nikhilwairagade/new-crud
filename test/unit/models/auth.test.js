
const { Register } = require('../../../model/register');
const jwt = require('jsonwebtoken');
describe('user.generateAuthonToken', () => {
	it('should return a valid JWT', () => {

		const user = new Register({ email: 'testing@gmail.com' });
		const token = user.generateAuthToken();
		const decode = jwt.verify(token, 'jwtuserkey');
		expect(decode).toMatchObject({ email: 'testing@gmail.com' });

	});
});