const mongoose=require("mongoose");

const filmSchema=new mongoose.Schema({
    fkod:{type:Number, unique:true},
    filmcim:{type:String, required:[true, "A cím megadása kötelező!"], trim:true},
    szines:{type:Boolean},
    szinkron:{type:String},
    szarmazas:{type:String, required:[true, "A származás megadása kötelező!"], trim:true},
    mufaj:{type:String, required:[true, "A műfaj megadása kötelező!"], trim:true},
    hossz:{type:Number, required:[true, "A hossz megadása kötelező!"], min:[1, "A hossz legalább 1 perc legyen!"], max:[600, "A hossz legfeljebb 600 perc lehet!"], cast:"A hossz csak szám lehet!"}
});
module.exports=mongoose.model("film",filmSchema, "film");