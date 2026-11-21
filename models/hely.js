const mongoose=require("mongoose");
const helySchema=new mongoose.Schema({
    fkod:{type:Number},
    moziazon:{type:Number}
});
module.exports=mongoose.model("hely",helySchema, "hely");