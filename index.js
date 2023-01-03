const express= require("express");
const app= express();
const morgan = require("morgan");
const cors= require("cors");
const dotenv = require("dotenv");
const auth=require("./Middleware/auth");
const login=require("./Routes/login");
const ContactsData =require("./Routes/contact")
const mongoose= require("mongoose");
mongoose.set('strictQuery', true);
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
dotenv.config();

mongoose.connect("mongodb+srv://ContactManager:P6sj9BgtZx4Ew7zf@cluster1.qlrjsax.mongodb.net/?retryWrites=true&w=majority" ,{useNewUrlParser: true},(err)=>{
    if(err){
        console.log(err.message)
    }else{
    console.log('connected to db')
    }
});
app.use("/",login)
app.use("/" , ContactsData)


app.listen(5000,()=>{console.log("server is running on port 5000")});