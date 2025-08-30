import messageModel from "../../DB/models/message.model.js"
import userModel from "../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/error/globalErrorHandler.js"



export const sendMessage=asyncHandler( async (req,res,next)=>{

    const {content,receiverId}=req.body
    const  Receiver=await userModel.findOne({_id:receiverId,isDeleted:false}).select(["email","gender","name"])
    if(!Receiver){
        return next(new Error("this Receiver is not exist",{cause:404}))
    }

    const newMessage=await messageModel.create({content,receiverId})


    res.send({messages:"Message is sent successfuly",newMessage})
})



export const getMessages=asyncHandler( async (req,res,next)=>{

    const yourMessages=await messageModel.find({receiverId:req.user._id}).populate([{path:"receiverId",select:"name gender email"}])
    res.send({messageStatus:"Message is sent successfuly",yourMessages})
})