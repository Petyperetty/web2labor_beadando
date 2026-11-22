const mongoose=require("mongoose");
const uzenetSchema=new mongoose.Schema({
    uzenet:{type:String},
    email:{type:String},
});
module.exports=mongoose.model("uzenet", uzenetSchema, "uzenet");