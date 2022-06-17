const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/UserDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema(
    {
        email:String,
        password:String
    }
);
const secret = "The quick brown fox jumps over the lazy dog";
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});
const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res)
{
    res.render("home");
});
app.get("/login",function(req,res)
{
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req, res)
{
    const user = new User(
        {
            email:req.body.username,
            password:req.body.password
        }
    );
    user.save(function(err)
    {
        if(err)
        {
            console.log(err);
            res.send("Pls try again, some error occured!");
        }
        else
        {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res)
{
    const email = req.body.username;
    const pass = req.body.password;
    User.findOne({email:email},function(err, foundUser)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser)
            {
                if(foundUser.password === pass)
                {
                    res.render("secrets");
                }
                else
                {
                    res.send("No matching found!");
                }
            }
        }
    });
});

app.listen(3000, function()
{
    console.log("Server started on port 3000");
});


