import Joi from "joi";
import { Types } from "mongoose";

const method = (value, helper) => {
  const truthy = Types.ObjectId.isValid(value);
  return truthy ? true : helper.error("string.mongo");
};


// generale Rules contain the rules that are repeted in app validation 
// for exampl Id and also the headers property

export const generalRules = {
  objectId: Joi.string().custom(method).messages({ "string.mongo": "this is Is not valide" }).required(),
  headers: Joi.object({
    "content-type": Joi.string().valid("application/json","application/x-www-form-urlencoded","multipart/form-data","text/plain").optional(),
    "cache-control": Joi.string().optional(),
    "content-length": Joi.string(),
    "postman-token": Joi.string(),
    "user-agent": Joi.string().optional(),
    "cache-control": Joi.string().optional(),
    connection: Joi.string(),
    host: Joi.string(),
    accept: Joi.string().optional(),
    "accept-encoding": Joi.string().optional(),
    "accept-language": Joi.string().optional(),
    "accept-charset": Joi.string().optional(),
    authorization:Joi.string().optional()
  }),
};
