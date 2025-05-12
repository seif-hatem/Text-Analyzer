const express= require("express")
const app=express()
const router=express.Router()
const path = require('path')
const UserRoutes = require("./routes/user.route")
const userModel = require("./models/user.model")


app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }))  // For parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/users',UserRoutes)


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signin.html'))
})

app.get('/sign',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'))
})

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','home.html'))
})


// validate user log in

app.post('/validateIn',async (req,res)=>{
    const { email , password }=req.body
    try {
        const user = await userModel.findOne({ email });
    
        if (!user) {
            return res.send(`<script>alert('User not found'); window.location.href = '/';</script>`);

        //   return res.status(401).json({ message: 'User not found' });
        }
        else{
            

            if(user.email==email&& user.password==password){
                //here
                return res.redirect('/home');
            }
            else {
                return res.send(`<script>alert('Incorrect password'); window.location.href = '/';</script>`);
                // return res.status(401).json({ message: 'Incorrect password' });
              }
        }
    } catch (err) {
        return res.send(`<script>alert('Error: ${err.message}'); window.location.href = '/';</script>`);
    
        // res.status(500).json({ message: 'Server error', error: err.message });
      }
    
    
})


app.post('/validateSignUp',async (req,res)=>{
    const user=req.body
    if(user.password!==user['confirm-password']){
        return res.send(`<script>alert('Error: passwords is not matching.'); window.location.href = '/sign';</script>`);
    }
    try {
        // Instead of using request, we directly create the user in the database
        const newUser = await userModel.create(user);

        if (newUser) {
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