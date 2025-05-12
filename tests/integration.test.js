const monogoose = require("mongoose")
const app = require("../index")

const userModel = require('../models/user.model')
const request = require('supertest');
const { default: mongoose } = require("mongoose");

require("dotenv").config();

beforeEach(async()=>{
    await monogoose.connect(process.env.MONGODB_URI)
})

afterAll(async()=>{
    //await productModel.deleteMany({});
    await userModel.deleteMany({ email: "aly@g.com" },{email:"lash@g.com"});
    await monogoose.connection.close();
    
})

describe('Get users',()=>{
    it("should return specific user",async()=>{
        const tmpuser={
            first_name:"aly",
            last_name:"marwan",
            email:"aly@g.com",
            phone_number:"0111111",
            password:"123123",
            gender:"Male"

        }
        const usr= await userModel.create( tmpuser);
        const result= await request(app).get(`/api/users/${usr.id}`)
        expect(result.status).toBe(200)
    })

    it("should return all users",async()=>{
        const tmpuser=[{
            first_name:"aly",
            last_name:"marwan",
            email:"aly@g.com",
            phone_number:"0111111",
            password:"123123",
            gender:"Male"

        },
        {
            first_name:"ahmed",
            last_name:"lasheen",
            email:"lash@g.com",
            phone_number:"0111111",
            password:"123123",
            gender:"Male"

        },
        ]
        const usr= await userModel.create( tmpuser);
        const result= await request(app).get(`/api/users/`)
        expect(result.status).toBe(200)
    })
    it("should return user not found",async()=>{
        const res= await request(app).get("/api/users/60f5fdd2bcf86cd799439011")
        expect(res.status).toBe(404)
    })

    it("should return error due to not connected to db",async()=>{
        monogoose.disconnect()
        const res= await request(app).get("/api/users")
        expect(res.status).toBe(500)
    })

    it('should throw error fetching unvalid id',async()=>{
        const res=await request(app).get(`/api/users/1`)
        expect(res.status).toBe(500)
    })

})

describe('delete users',()=>{
    it('should delete a user',async()=>{
        const tmpusr= {
            first_name:"ahmed",
            last_name:"lasheen",
            email:"lash@g.com",
            phone_number:"0111111",
            password:"123123",
            gender:"Male"

        }
        const user=await userModel.create(tmpusr)
        const result=await request(app).delete(`/api/users/${user.id}`)
        const result2=await request(app).get(`/api/users/${user.id}`)
        expect(result.status).toBe(200)
        expect(result2.status).toBe(404)
    })

    it('should throw error deleting unvalid id',async()=>{
        const res=await request(app).delete(`/api/users/1`)
        expect(res.status).toBe(500)
    })


})

describe('creating new user',()=>{
    it('should create new user',async()=>{
        const tmpusr= {
            first_name:"ahmed",
            last_name:"lasheen",
            email:"lash@g.com",
            phone_number:"0111111",
            password:"123123",
            gender:"Male"

        }
        const result=await request(app).post('/api/users').send(tmpusr)
        expect(result.status).toBe(201)
    })
    it('should throw error as required fields not passed',async()=>{
        const tmpusr= {
            first_name:"ahmed",
            

        }
        const result=await request(app).post('/api/users').send(tmpusr)
        expect(result.status).toBe(500)
    })
})

describe('update user details',()=>{
    it('should return updated user',async()=>{
        const tmpusr= {
            first_name:"ahmed",
            last_name:"lasheen",
            email:"lash@g.com",
            phone_number:"0111111",
            password:"123123",
            gender:"Male"

        }
        const user=await userModel.create(tmpusr);
        const res=await request(app).patch(`/api/users/${user.id}`).send({
            first_name:"alia",
            gender:"Female"
        })
        expect(res.status).toBe(200)
    })

    it('should throw error updating unvalid id',async()=>{
        const res=await request(app).patch(`/api/users/1`).send({
            first_name:"alia",
            gender:"Female"
        })
        expect(res.status).toBe(500)
    })

})




