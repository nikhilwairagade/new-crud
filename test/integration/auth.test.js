/* eslint-disable no-undef */
const {Register}=require('../../model/register');
const request=require('supertest');
let server;

describe('authenticate user', () => {
	beforeEach(async() => { server = require('../../index');
		await request(server).post('/api/user_register')
			.send({name:'nik123',email:'email@gmail.com',password:'12345'});
	});
	afterEach(async()=>{await Register.remove({}),
	await server.close();
	});
    
	describe('POST /',() => {
		it('should return 400 if email is empty',async () =>{
			const res= await   request(server).post('/api/auth').send({});
			expect(res.status).toBe(400);
		});
		it('should return 400 if password is empty',async () =>{
			const res= await   request(server).post('/api/auth').send({email:'nik@rknec.edu'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if email format is invalid',async () =>{
			const res= await   request(server).post('/api/auth').send({email:'nik'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if password format is invalid ',async () =>{
			const res= await   request(server).post('/api/auth').send({email:'nik@rknec.edu',password:'123'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if email is not register',async () =>{
			const res= await   request(server).post('/api/auth').send({email:'nik@rknec.edu',password:'12345'});
			expect(res.status).toBe(404);
		});
		it('should return 400 if password is not match with given credintial',async () =>{
			const res= await   request(server).post('/api/auth').send({email:'email@gmail.com',password:'1235463'});
			expect(res.status).toBe(404);
		});
		it('should return 200 if user loggin sucessfully',async () =>{
			const res= await   request(server).post('/api/auth').send({email:'email@gmail.com',password:'12345'});
			expect(res.status).toBe(200);
		});
	});
});