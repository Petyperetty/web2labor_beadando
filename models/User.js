const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    username:{type:String, unique:true},
    password:{type:String, require:true},
    role:{type:String, enum:["user","admin"], default:"user"},
    name:{type:String},
    email:{type:String, unique: true, require:true}
});
module.exports=mongoose.model("user",userSchema, "user");