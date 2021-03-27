const mongoose=require("mongoose");
const Schema=mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const commentSchema=new Schema({
    rating:{
        type:String,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true
    },
    
    author:{
        type:String,
        required:true
    }
    
},{timestamps:true})

const dishSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:'',
        min:0
    },
    price:{
        type:Currency,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    comments:[commentSchema]
},{timestamps:true})

const Dishes=mongoose.model("Dish", dishSchema);
module.exports=Dishes;