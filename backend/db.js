const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/paytm")

//creating schema for users table
const userSchema= mongoose.schema({
    usename:
    {
     type:String,
     require:true,
     unique:true,
     trim:true,
     lowercase:true,
     minlength:true,
     maxlength:true
    },
    password:{
        type:String,
        require:true,
        minlength:6

    },
    firstName:{
        type:String,
        require:true,
        trim:true,
        maxlength:50
    },

    lastName:{
        type:String,
        require:true,
        trim:true,
        maxlength:50
    },
})

//creating model
const User=mongoose.model("User",userSchema);

module.exports={
    User
}