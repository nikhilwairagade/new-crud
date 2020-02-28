/* eslint-disable no-undef */
const request =require('supertest');
const {Student}=require('../../model/student');
const {Register}=require('../../model/register');
let server;
let token;
describe('/api/student API', () => {
	beforeEach(async() => { server = require('../../index');
		await   request(server).post('/api/user_register')
			.send({name:'nik123',email:'email@gmail.com',password:'12345'});
		await   request(server).post('/api/auth')
			.send({email:'email@gmail.com',password:'12345'});
		token = new Register({email:'email@gmail.com'}).generateAuthToken(); 
		await request(server).post('/api/student')
			.set('x-auth',token)
			.send({name:'nikss',age:20,dob:'2012-02-01',semail:'wairagade@rknec.edu',college:'rcoem'});
   
	});
	afterEach(async()=>{await Student.remove({});
		await Register.remove({}),
		await server.close();
	});
	describe('GET /',() => {
		it('should return 401 if token not provide',async () =>{
			const res= await   request(server).get('/api/student');
			expect(res.status).toBe(401);
		});
		it('should return 404 if no record found related to user which login',async () =>{
			token = new Register({email:'oimail@gmail.com'}).generateAuthToken();
			const res= await   request(server).get('/api/student').set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 200 if atleast on student record found which relate to current log in user ',async () =>{
			const res= await   request(server).get('/api/student').set('x-auth',token);
			expect(res.status).toBe(200);
			expect(res.body[0].name).toBe('nikss');
		});
	});
	describe('GET by searchname /',() =>{
		it('should return 401 if token not provide',async () =>{
			const res= await   request(server).get('/api/student/SearchByName');
			expect(res.status).toBe(401);
		});
		it('should return 400 if req query empty ',async () =>{
			const res= await   request(server).get('/api/student/SearchByName')
				.query({name:''})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if req query not match with any record ',async () =>{
			const res= await   request(server).get('/api/student/SearchByName')
				.query({name:'xx'})
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 200 if req query match with any record ',async () =>{
			const res= await   request(server).get('/api/student/SearchByName')
				.query({name:'nik'})
				.set('x-auth',token);
			expect(res.status).toBe(200);
			expect(res.body[0].name).toBe('nikss');
		});

	});
	describe('GET by search age between /',() =>{
		it('should return 401 if token not provide',async () =>{
			const res= await   request(server).get('/api/student/SearchByAge');
			expect(res.status).toBe(401);
		});
		it('should return 400 if req query empty ',async () =>{
			const res= await   request(server).get('/api/student/SearchByAge')
				.query({ageAfter:''})
				.query({ageBefor:''})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if req query string not contain number ',async () =>{
			const res= await   request(server).get('/api/student/SearchByAge')
				.query({ageAfter:'m'})
				.query({ageBefor:'n'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if req query string not match with any record ',async () =>{
			const res= await   request(server).get('/api/student/SearchByAge')
				.query({ageAfter:100})
				.query({ageBefor:200})
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 200 if req query string match with any record ',async () =>{
			const res= await   request(server).get('/api/student/SearchByAge')
				.query({ageAfter:1})
				.query({ageBefor:20})
				.set('x-auth',token);
			expect(res.status).toBe(200);
			expect(res.body[0].age).toBe(20);
		});
	});
	describe('GET by search dob between /',() =>{
		it('should return 401 if token not provide',async () =>{
			const res= await   request(server).get('/api/student/SearchBydob');
			expect(res.status).toBe(401);
		});
		it('should return 400 if req query empty ',async () =>{
			const res= await   request(server).get('/api/student/SearchBydob')
				.query({afterdob:''})
				.query({befordob:''})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if req query string not in date format ',async () =>{
			const res= await   request(server).get('/api/student/SearchBydob')
				.query({afterdob:'2010-04'})
				.query({befordob:'2010-04-04'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if req query string not match with any record ',async () =>{
			const res= await   request(server).get('/api/student/SearchBydob')
				.query({afterdob:'2007-04-04'})
				.query({befordob:'2010-04-04'})
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 200 if req query string match with any record ',async () =>{
			const res= await   request(server).get('/api/student/SearchBydob')
				.query({afterdob:'2010-04-04'})
				.query({befordob:'2013-02-01'})
				.set('x-auth',token);
			expect(res.status).toBe(200);
			expect(res.body[0].dob).toContain('2012-02-01');
		});
	});
	describe('POST /',() => {
		it('should return 401 if token not pro',async () =>{
			const res= await   request(server).post('/api/student')
				.send({});
			expect(res.status).toBe(401);
		});
		it('should return 400 if student name is less than 5 charecter',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nik'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if student age is NaN',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nikks',age:'hg'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if student dob is not in well format',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nikks',age:'10',dob:'2012-02'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if student email is not in valide',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nikks',age:'10',dob:'2012-02-20',semail:'ghdhdh'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if student college filed empty',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nikks',age:'10',dob:'2012-02-20',semail:'ghdhdh@gmail.com',college:''})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 400 if try to set createremail ID ',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nikks',age:'10',dob:'2012-02-20',semail:'ghdhdh@gmail.com',college:'rcoem',createremail:'EE@gmail.com'})
				.set('x-auth',token);
			expect(res.status).toBe(400);
		});
		it('should return 200 if student record save sucessfully',async () =>{
			const res= await   request(server).post('/api/student')
				.send({name:'nikks',age:'10',dob:'2012-02-20',semail:'ghdhdh@gmail.com',college:'rcoem'})
				.set('x-auth',token);
			const get_data= await   request(server).get('/api/student').set('x-auth',token);
			expect(res.status).toBe(200);
			expect(get_data.body[1].name).toBe('nikks');
			expect(get_data.body[1].createremail).toBe('email@gmail.com');
		});
	});
	describe('PUT /',() => {
		it('should return 401 if token not pro',async () =>{
			const res= await   request(server).put('/api/student/123')
				.send({});
			expect(res.status).toBe(401);
		});
		it('should return 404 if valid id not provided',async () =>{
			const res= await   request(server).put('/api/student/123')
				.send({})
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 404 if student is not found with given ID',async () =>{
			const res= await   request(server).put('/api/student/5e4fa9f86a702f1418976bcf')
				.send({})
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 404 if student found and it not created by the currently logged user',async () =>{
			const get_data= await   request(server).get('/api/student').set('x-auth',token);
			const token1 = new Register({email:'oimail@gmail.com'}).generateAuthToken();
			const id=get_data.body[0]._id;
			const res= await   request(server).put(`/api/student/${id}`)
				.send({})
				.set('x-auth',token1);
			expect(res.status).toBe(404);
		});
		it('should return 200 if student is found and created by currently logged user and update',async () =>{
			const get_data= await   request(server).get('/api/student').set('x-auth',token);
			const id=get_data.body[0]._id;
			const res= await   request(server).put(`/api/student/${id}`)
				.send({name:'khushi',age:20,dob:'2012-02-01',semail:'wairagade@rknec.edu',college:'rcoem'})
				.set('x-auth',token);
			expect(res.status).toBe(200);
			expect(res.body.name).toBe('khushi');
		});
	});
	describe('DELET /',() => {
		it('should return 401 if token not pro',async () =>{
			const res= await   request(server).delete('/api/student/123');
			expect(res.status).toBe(401);
		});
		it('should return 404 if valid id not provided',async () =>{
			const res= await   request(server).delete('/api/student/123')
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 404 if student is not found with given ID',async () =>{
			const res= await   request(server).delete('/api/student/5e4fa9f86a702f1418976bcf')
				.set('x-auth',token);
			expect(res.status).toBe(404);
		});
		it('should return 404 if student found and it not created by the currently logged user',async () =>{
			const get_data= await   request(server).get('/api/student').set('x-auth',token);
			const token1 = new Register({email:'oimail@gmail.com'}).generateAuthToken();
			const id=get_data.body[0]._id;
			const res= await   request(server).delete(`/api/student/${id}`)
				.set('x-auth',token1);
			expect(res.status).toBe(404);
		});
		it('should return 200 if student is found and created by currently logged user and delete',async () =>{
			const get_data= await   request(server).get('/api/student').set('x-auth',token);
			const id=get_data.body[0]._id;
			const res= await   request(server).delete(`/api/student/${id}`)
				.set('x-auth',token);
			expect(res.status).toBe(200);
			expect(res.body._id).toBe(id);
		});
	});
});