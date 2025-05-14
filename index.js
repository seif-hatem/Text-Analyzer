const express= require("express")
const app=express()
const validator = require('validator');
const session = require('express-session');
const router=express.Router()
const path = require('path')
const UserRoutes = require("./routes/user.route")
const userModel = require("./models/user.model")
const rateLimit = require('express-rate-limit');




require("dotenv").config();

app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }))  // For parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/users',UserRoutes)

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again later',
});

app.use(session({
    secret: process.env.SESSION_SECRET, // change this to something strong in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // use true only if you're using HTTPS
  }));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signin.html'))
})

app.get('/sign',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'))
})

app.get('/home',(req,res)=>{
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }
    res.sendFile(path.join(__dirname,'public','home.html'))
})


// validate user log in

app.post('/validateIn',loginLimiter,async (req,res)=>{
    const { email , password }=req.body
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).send('Invalid input');
    }
    try {
        const user = await userModel.findOne({ email });
    
        if (!user) {
            return res.send(`<script>alert('User not found'); window.location.href = '/';</script>`);

        //   return res.status(401).json({ message: 'User not found' });
        }
        else{
            

            if(user.email==email&& user.password==password){
                //here
                req.session.user = user.email;
                return res.redirect('/home');
            }
            else {
                return res.send(`<script>alert('Incorrect password'); window.location.href = '/';</script>`);
                // return res.status(401).json({ message: 'Incorrect password' });
              }
        }
    } catch (err) {
        const escapedMessage = ('' + err.message).replace(/'/g, "\\'");
        return res.send(`<script>alert('Error: ${escapedMessage}'); window.location.href = '/';</script>`);
        
    
        // res.status(500).json({ message: 'Server error', error: err.message });
      }
    
    
})


app.post('/validateSignUp',async (req,res)=>{
    const user=req.body
    if(user.password!==user['confirm-password']&&user['confirm-password']!==''){
        return res.send(`<script>alert('Error: passwords is not matching.'); window.location.href = '/sign';</script>`);
    }
    if (!validator.isEmail(user.email)) {
        return res.status(400).send('Invalid email format');
    }
    console.log(user.password)
    console.log(validator.isStrongPassword(user.password))
    if (!validator.isStrongPassword(user.password, { minLength: 8 })) {
        return res.status(400).send('Weak password');
    }
    try {
        // Instead of using request, we directly create the user in the database
        const newUser = await userModel.create(user);

        if (newUser) {
            req.session.user = user.email;
            return res.redirect('/home');
        } else {
            return res.send(`<script>alert('Error: Unable to sign up.'); window.location.href = '/sign';</script>`);
        }
    } catch (err) {
        return res.send(`<script>alert('Error: ${err.message}'); window.location.href = '/sign';</script>`);
    }
})



app.use(router)
module.exports= app 