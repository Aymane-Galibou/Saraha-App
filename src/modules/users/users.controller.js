import { Router } from "express";
import { confirmEmail, freezeAccount, getProfile, shareProfile, signin, signup,updatePassword,updateProfile } from "./users.service.js";
import { authenticate, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { signupSchema,updatePasswordSchema,updateProfileSchema,freezAccountSchema, ShareProfileSchema } from "./users.validation.js";

export const userRouter = Router();

//register
userRouter.post("/signup", validation(signupSchema), signup);

//Log in
userRouter.post("/signin", signin);

//for confirmation email
userRouter.get("/confirmEmail/:token", confirmEmail);

//get Profile
userRouter.get("/getprofile",authenticate,authorization(["user"]),getProfile);

//Share You Profile
userRouter.get("/profile/:id",validation(ShareProfileSchema),shareProfile);

//update Profile information
userRouter.patch("/profile/update",validation(updateProfileSchema) ,authenticate,updateProfile);

// update Password
userRouter.patch("/profile/update/Password",validation(updatePasswordSchema) ,authenticate,updatePassword);

// freeze Account
userRouter.put("/profile/freeze",validation(freezAccountSchema),authenticate,freezeAccount)