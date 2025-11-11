import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    isComplete: { type: Boolean, required: true,default:false }
},
    { timestamps: true }
)

const task = mongoose.model("task",taskSchema);
export default task;