import Joi from "joi";
import { generalRules } from "../../utils/rulesSchema.js";




export const messageSchema=
{
    body:Joi.object({
    content:Joi.string().required(),
    receiverId:generalRules.objectId.required()
})
}
