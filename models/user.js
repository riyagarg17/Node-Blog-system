const mongoose=require('mongoose');

const Schema=mongoose.Schema;

//creating user schema
const userSchema=new Schema({

    googleID:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    firstName:{
        type:String
    },
    lastName:String,
    image:String
});

//create collection and add schema
mongoose.model('users',userSchema);
