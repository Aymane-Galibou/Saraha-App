import Joi from "joi";
import { generalRules } from "../../utils/rulesSchema.js";

export const signupSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .max(15)
      .messages({ "string.min": "Name is short" })
      .required(),
    password: Joi.string().min(3).required(),
    confirmedPassword: Joi.string().valid(Joi.ref("password")).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "admin").required(),
    phone: Joi.string()
      .regex(/^06[0-9]{8}$/)
      .required(),
    gender: Joi.string().valid("male", "female").required(),
  }),
  query: Joi.object({
    slag: Joi.number().min(3).max(15),
  }),
  headers: generalRules.headers,
};

export const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .max(15)
      .messages({ "string.min": "Name is short" }),
    phone: Joi.string().regex(/^06[0-9]{8}$/),
    gender: Joi.string().valid("male", "female"),
  }),
  headers: generalRules.headers.required(),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().min(3).required(),
    newPassword: Joi.string().min(3).required(),
    confirmedNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
  headers: generalRules.headers.required(),
};

export const freezAccountSchema = {
  headers: generalRules.headers.required(),
};

export const ShareProfileSchema = {
  params: Joi.object({
    id: generalRules.objectId.required(),
  }),
};
