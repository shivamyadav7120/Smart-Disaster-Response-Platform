const mongoose = require("mongoose");
const riskZoneSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, district:{type:String,default:"",trim:true,index:true}, risk:{type:String,required:true}, score:{type:Number,min:0,max:100,default:0}, geometry:{type:Object,required:true}, isActive:{type:Boolean,default:true} },{timestamps:true});
module.exports = mongoose.model("RiskZone", riskZoneSchema);
