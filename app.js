const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
require('dotenv').config()

const app = express()
app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,
  useUnifiedTopology:true})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

// console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]})

const User = mongoose.model("User",userSchema)

app.get("/home",function (req,res) {
  res.render("home")
})

app.get("/login",function (req,res) {
  res.render("login")
})

app.get("/register",function (req,res) {
  res.render("register")
})

app.get("/secrets", function (res,req) {
  res.render("secrets")
})

// app.get("/logout")

app.post("/register",function (req,res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function (err) {
    if (!err) {
      res.render("secrets")
    }else {
      console.log(err);
    }
  })
  // res.redirect("/home")
})

app.post("/login",function (req, res) {
  const email = req.body.username
  const pass = req.body.password
  // console.log(req.body.username);
  User.findOne(
    {
      email:email ,
      // password:req.body.password
    },function(err, foundUser) {
      if (!err) {
        console.log(foundUser.password);
        if(foundUser.password === pass){

          res.render("secrets")
        }else {
          console.log("invalid Password");
          res.send("invalid Password")
        }
      }else {
        console.log(err);
      }
    }
  )
})

// app.get("/register",function (req.res) {
//   res.render("register")
// })




app.listen(8080,function () {
  console.log("Server is running in port 8080");
})
