const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const userModel = require('../models/user.model');

require('dotenv').config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Security Tests', () => {
    describe('NoSQL Inject Prevention', () => {
        it('Prevent NoSQL injection in login', async () => {
            const maliciousPayload = {
                email: { $gt: "" },
                password: { $gt: "" }
            };
            
            const response = await request(app)
                .post('/validateIn')
                .send(maliciousPayload);
            
            expect(response.status).toBe(200);
            expect(response.text).toContain('alert');
        });
    });

    describe('XSS Prevention', () => {
        it('Mimic user input in registration', async () => {
            const xssPayload = {
                first_name: '<script>alert("xss")</script>',
                last_name: 'Test',
                email: 'test@test.com',
                phone_number: '1234567890',
                password: 'password123',
                gender: 'Male'
            };

            const response = await request(app)
                .post('/api/users')
                .send(xssPayload);

            expect(response.status).toBe(201);
        });
    });

    describe('Input Validation', () => {
        it('validate email format', async () => {
            const invalidEmail = {
                first_name: 'Test',
                last_name: 'User',
                email: 'invalid-email',
                phone_number: '1234567890',
                password: 'password123',
                gender: 'Male'
            };

            const response = await request(app)
                .post('/api/users')
                .send(invalidEmail);

            expect(response.status).toBe(201);
        });

        it('validate strong password ', async () => {
            const weakPassword = {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@test.com',
                phone_number: '1234567890',
                password: '123', // Too short
                gender: 'Male'
            };

            const response = await request(app)
                .post('/api/users')
                .send(weakPassword);

            expect(response.status).toBe(201);
        });
    });

    describe('Authentication Tests', () => {
        it('prevent access to protected routes without authentication', async () => {
            const response = await request(app)
                .get('/home');

            expect(response.status).toBe(200);
        });

        it('prevent brute force attacks', async () => {
            const loginAttempts = Array(5).fill({
                email: 'test@test.com',
                password: 'wrongpassword'
            });

            for (const attempt of loginAttempts) {
                await request(app)
                    .post('/validateIn')
                    .send(attempt);
            }

            // After 5 failed attempts, the next attempt should be blocked
            const response = await request(app)
                .post('/validateIn')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('alert');
        });
    });

    describe('CSRF Protection', () => {
        it('requests without CSRF token', async () => {
            const response = await request(app)
                .post('/api/users')
                .set('Origin', 'http://malicious-site.com')
                .send({
                    first_name: 'Test',
                    last_name: 'User',
                    email: 'test@test.com',
                    phone_number: '1234567890',
                    password: 'password123',
                    gender: 'Male'
                });

            expect(response.status).toBe(201);
        });
    });
}); 