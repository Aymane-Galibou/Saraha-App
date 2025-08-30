import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/error/globalErrorHandler.js";
import { sentEmailEvent } from "../../utils/sendEmail.Event.js";
import { hashPassword } from "../../utils/hashing/hash.js";
import { comparePassword } from "../../utils/hashing/compare.js";
import { encryptPhone } from "../../utils/encryption/encrypt.js";
import { decryptPhone } from "../../utils/encryption/decrypt.js";
import { generateToken } from "../../utils/token/generateToken.js";
import { decodeToken } from "../../utils/token/decodeToken.js";
import messageModel from "../../DB/models/message.model.js";



export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, confirmedPassword, gender, role } =
    req.body;

  // verify passwords matching

  if (password != confirmedPassword) {
    next(
      new Error("password and confirmed password not matched", { cause: 400 })
    );
  }
  // verify email existing

  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    next(new Error("the email is already exist", { cause: 400 }));
  }

  // hashing password we used + to translate salt into a number

  const passwordHashed = await hashPassword({
    password,
    salt: process.env.SALT_ROUNDS,
  });

  // encryption of phone

  const encyptedPhone = await encryptPhone({
    phone,
    phoneSecret: process.env.PHONE_KEYENCRYPTION,
  });

  // handling confirmation of email here
  sentEmailEvent.emit("sendEmail", { email });

  // create User
  const User = await userModel.insertOne({
    name,
    gender,
    email,
    phone: encyptedPhone,
    password: passwordHashed,
    role,
  });
  return res
    .status(202)
    .send({ message: "User Created Successfuly", user: User });
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // verify email existing
  const UserInfo = await userModel.findOne({ email,confirmed: true,isDeleted:false}).lean();
  if (!UserInfo) {
    return res
      .status(404)
      .send({ message: "the email is Not exist Or Not confirmed" });
  }
  const { _id, email: userEmail, name, role } = UserInfo;

  const matchingPassword = await comparePassword({
    password,
    hashedPassword: UserInfo.password,
  });

  if (!matchingPassword) {
    return res.status(401).send({ message: "Password is Not Correct" });
  }
  const token = await generateToken({
    payload: { email: userEmail, _id, name },
    signature:
      role === "user"
        ? process.env.SIGNATURE_USER
        : process.env.SIGNATURE_ADMIN,
    option: { expiresIn: "1h" },
  });
  return res.status(202).send({
    message: "sign in successfuly",
    user: { _id, userEmail, name },
    token,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  const decodedPhone = await decryptPhone({
    phone: user.phone,
    secretPhone: process.env.PHONE_KEYENCRYPTION,
  });
  console.log(decodedPhone);
    const yourMessages=await messageModel.find({receiverId:req.user._id})


  return res.status(200).send({
    messageStatus: "Profile Fetched successfuly",
    user: { ...user, phone: decodedPhone,password:"Not allowed" },
    yourMessages
  });
});

export const confirmEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token)
    return res.status(400).send({ message: "Invalid confirmation link" });

  // const decodedToken = jwt.verify(token, process.env.SIGNATUR_EMAIL);
  const decodedToken = decodeToken({
    token,
    signature: process.env.SIGNATUR_EMAIL,
  });

  const user = await userModel.findOneAndUpdate(
    { email: decodedToken.email, confirmed: false },
    { confirmed: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).send("<h1>User not found or already confirmed</h1>");
  }
  return res.status(200).send("<h1>Email confirmed successfully</h1>");
});

export const updateProfile = asyncHandler(async (req, res,next) => {
  let updateData={}
  const {phone,name,gender}=req.body

if(phone){
 updateData.phone=await encryptPhone({phone:phone,phoneSecret:process.env.PHONE_KEYENCRYPTION,})
}
if(name){
  updateData.name=name
}
if(gender){
  updateData.gender=gender
}


const newUser=await userModel.findByIdAndUpdate(req.user._id,updateData,{new:true})
  if (!newUser) {
    return next(
      new Error("Unable to update profile. Please verify you are signed in.")
    );
  }
  return res.status(200).send({
    message: "Profile Update Successfuly",
    user: newUser,
  });
});


export const updatePassword = asyncHandler(async (req, res,next) => {
  let updateData={}
  const {oldPassword,newPassword}=req.body
    const isMatched=await comparePassword({password:oldPassword,hashedPassword:req.user.password})
    if(!isMatched){
      return next(new Error("old Password is not correct"))
    }
  const passwordHashed = await hashPassword({password:newPassword,salt: process.env.SALT_ROUNDS,});
if(passwordHashed){
  updateData.password=passwordHashed
  updateData.passwordChangedAt=Date.now()
}

const newUser=await userModel.findByIdAndUpdate(req.user._id,updateData,{new:true}).select("-password")
  if (!newUser) {
    return next(
      new Error("Unable to update Password. Please verify you are signed in.")
    );
  }
  return res.status(200).send({
    message: "Profile Update Successfuly",
    user: newUser,
  });
});

export const freezeAccount = asyncHandler(async (req, res,next) => {


const freezedUser=await userModel.findByIdAndUpdate(req.user._id,{passwordChangedAt:Date.now(),isDeleted:true},{new:true}).select(["name","email","gender"])
  if (!freezedUser) {
    return next(
      new Error("Unable to freeze Account Please verify you are signed in.")
    );
  }
  return res.status(200).send({
    message: "Profile freezed Successfuly",
    user: freezedUser,
  });
});


export const shareProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const User=await userModel.findById(id).select(["name","email","gender","role"])

  if(!User){
        return next(
      new Error("We cannot find this User",{cause:404})
    );

  }
  return res.status(200).send({
    message: "Profile Fetched successfuly",
    User,
  });
});