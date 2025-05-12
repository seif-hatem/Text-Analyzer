const monogoose = require("mongoose")
const app = require("../index")

const userModel = require('../models/user.model')
const request = require('supertest');

require("dotenv").config();

beforeEach(async()=>{
    await monogoose.connect(process.env.MONGODB_URI)
})

afterAll(async()=>{
    //await productModel.deleteMany({});
    await userModel.deleteMany({ email: "aly@g.com" },{email:"lash@g.com"},{email: 'test@example.com'});
    await monogoose.connection.close();
    
})

describe('Testing /validateSignUp',()=>{
    it('confirm password not same as password',async ()=>{
       const res=await request(app).post('/validateSignUp').send({
                  first_name:"aly",
                  last_name:"marwan",
                  email:"aly@g.com",
                  phone_number:"0111111",
                  password:"123123",
                  'confirm-password':"diff",
                  gender:"Male"
      
              });
        expect(res.status).toBe(200);
        expect(res.text).toContain('Error: passwords is not matching');
     
    })
    it('should create a new user and redirect to /home', async () => {
        const response = await request(app)
            .post('/validateSignUp')
            .send({
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                phone_number: '0123456789',
                password: 'Password_123',
                'confirm-password': 'Password_123',
                gender: 'Male'
            });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/home');
    
    });
    it('should throw error not all required field is passed',async()=>{
        const response = await request(app)
        .post('/validateSignUp')
        .send({
            
            last_name: 'User',
            email: 'test@example.com',
            phone_number: '0123456789',
            password: 'password123',
            'confirm-password': 'password123',
            gender: 'Male'
        });
        expect(response.text).toContain('Weak password');
    })

})


describe('Testing /validateIn', () => {
    beforeEach(async () => {
        await userModel.create({
            first_name: 'Login',
            last_name: 'User',
            email: 'login@test.com',
            phone_number: '0123456789',
            password: 'securepass',
            gender: 'Male'
        });
    });

    afterAll(async () => {
        await userModel.deleteMany({ email: 'login@test.com' });
    });

    it('should return "User not found" if email does not exist', async () => {
        const res = await request(app).post('/validateIn').send({
            email: 'notfound@test.com',
            password: 'anyPass'
        });

        expect(res.status).toBe(200);
        expect(res.text).toContain('User not found');
        expect(res.text).toContain('window.location.href = \'/\';');
    });

    it('should redirect to /home if credentials are correct', async () => {
        const res = await request(app).post('/validateIn').send({
            email: 'login@test.com',
            password: 'securepass'
        });

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/home');
    });

    it('should return "Incorrect password" if password is wrong', async () => {
        const res = await request(app).post('/validateIn').send({
            email: 'login@test.com',
            password: 'wrongpass'
        });

        expect(res.status).toBe(200);
        expect(res.text).toContain('Incorrect password');
        expect(res.text).toContain('window.location.href = \'/\';');
    });

    it('should show error if email or password missing', async () => {
        const res = await request(app).post('/validateIn').send({
            email: ''
           
        });

        expect(res.status).toBe(400);
        expect(res.text).toContain("Invalid input"); // triggered from the catch block
    });

    it('should return script with error alert if database query fails', async () => {
        // Cause Mongoose to fail by passing an invalid query type
        const res = await request(app).post('/validateIn').send({
            email: { $invalidOperator: true }, // This should break the query
            password: '123456'
        });

        expect(res.status).toBe(400);
        expect(res.text).toContain("Invalid input");
    });
});


describe('GET static pages', () => {
    it('should serve signin.html on GET /', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>'); // Assumes HTML file starts with DOCTYPE
    });

    it('should serve signup.html on GET /sign', async () => {
        const res = await request(app).get('/sign');
        expect(res.status).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>');
    });

    it('should serve home.html on GET /home', async () => {
        const res = await request(app).get('/home');
        expect(res.status).toBe(401);
        
    });
});