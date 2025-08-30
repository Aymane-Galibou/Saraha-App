import {Router} from 'express'
import { sendMessage ,getMessages} from './messages.service.js'
import { messageSchema } from './messages.validation.js'
import { validation } from '../../middleware/validation.js'
import { authenticate } from '../../middleware/auth.js'




export const messageRouter=Router()

// send a Message
messageRouter.post("/",validation(messageSchema),sendMessage)

// get Messages 
messageRouter.get("/",authenticate,getMessages)







