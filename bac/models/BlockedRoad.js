const mongoose = require("mongoose");
const blockedRoadSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, district:{type:String,default:"",trim:true,index:true}, reason:{type:String,default:""}, latitude:{type:Number,required:true,min:-90,max:90}, longitude:{type:Number,required:true,min:-180,max:180}, isActive:{type:Boolean,default:true} },{timestamps:true});
module.exports = mongoose.model("BlockedRoad", blockedRoadSchema);
