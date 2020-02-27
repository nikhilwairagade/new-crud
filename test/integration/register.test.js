/* eslint-disable no-undef */
const request=require('supertest');
const {Register}=require('../../model/register');
let server;

describe('/api/user_register',() =>{
	beforeEach(()=>{server=require('../../index');});
	afterAll(async()=>{
		await Register.remove({});
		await server.close();});

	describe('POST /',() => {
		it('should return 400 if regiter name field is missing',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({});
			expect(res.status).toBe(400);
		});
		it('should return 400 if register email field is missing',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik123'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if register password is missing',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik123',email:'abcd@gmail.com'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if register name is less than 5 charecter',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if register invalid email',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik123',email:'email'});
			expect(res.status).toBe(400);
		});
		it('should return 400 if register password is less than 5 charecter',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik123',email:'email@gmail.com',password:'123'});
			expect(res.status).toBe(400);
		});
		it('should return 200 user register sucesfully',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik123',email:'email@gmail.com',password:'12345'});
			expect(res.status).toBe(200);
			expect(res.body.name==='nik123').toBe(true);
		});
		it('should return 400 user already register',async () =>{
			const res= await   request(server).post('/api/user_register')
				.send({name:'nik123',email:'email@gmail.com',password:'12345'});
			expect(res.status).toBe(400);
		});
        
	});

});