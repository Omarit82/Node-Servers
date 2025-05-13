//getTasks,createTask,getTask,updateTask,deleteTask
import taskModel from "../models/task.model.js"

export const getTasks = async(req,res)=>{
    try {
        const tasks =  await taskModel.find();
        res.status(200).json({tasks:tasks});
    } catch (error) {
        res.status(500).send({message:"Error connection lost", error:error})
    }
}

export const createTask = async(req,res) => {
    try {
        const task = req.body;
        console.log(task);
        const response = await taskModel.create(task);
        res.status(201).send({message:"Task created",task:response})
    } catch (error) {
        res.status(500).send({message:"Error connection lost", error:error})
    }
}

export const deleteTask = async(req,res) =>{
    try {
        const taskId = req.params.id;
        const response = await taskModel.deleteOne({ _id: taskId });
        res.status(200).send({message:"Task Erased", task:response})
    } catch (error) {
        res.status(500).send({message:"Error connection lost", error:error})
    }
    
}