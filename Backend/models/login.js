import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    loginTime:{type:Date,default:Date.now},
    success:{type:Boolean,required:true}
})

const login = mongoose.model("login",loginSchema);
export default login;