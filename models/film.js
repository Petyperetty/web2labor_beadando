const mongoose=require("mongoose");
const filmSchema=new mongoose.Schema({
    fkod:{type:Number, unique:true},
    filmcim:{type:String},
    szines:{type:Boolean},
    szinkron:{type:String},
    szarmazas:{type:String},
    mufaj:{type:String},
    hossz:{type:Number}
});
module.exports=mongoose.model("film",filmSchema, "film");