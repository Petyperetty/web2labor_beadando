const mongoose=require("mongoose");
const moziSchema=new mongoose.Schema({
    moziazon:{type:Number, unique:true},
    mozinev:{type:String},
    irszam:{type:Number},
    cim:{type:String},
    telefon:{type:String}
});
module.exports=mongoose.model("mozi",moziSchema, "mozi");