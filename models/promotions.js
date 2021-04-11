const mongoose=require("mongoose");
const Schema=mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const promoSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:true
    }
}, {timestamps:true});

const Promotions=mongoose.model("promotion", promoSchema);
module.exports=Promotions;
