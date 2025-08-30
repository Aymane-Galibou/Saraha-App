import UserModel from "../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/error/globalErrorHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  const [prefix, token] = authorization.split(" ");
  if (!prefix || !token) {
    return next(new Error("Token Not Founded", { cause: 404 }));
  }

  let secret;
  if (prefix === "user") secret = process.env.SIGNATURE_USER;
  else if (prefix === "admin") secret = process.env.SIGNATURE_ADMIN;
  else return next(new Error("Invalide Token Type", { cause: 401 }));

  const decodedToken = jwt.verify(token, secret);
  if (!decodedToken?._id) {
    return next(new Error("Invalide Token Payload", { cause: 401 }));
  }
  const UserInfo = await UserModel.findOne(
    { email: decodedToken.email }
  ).lean();
  if (!UserInfo) {
    return next(new Error("User Not found", { cause: 404 }));
  }
  // verify if the account is freezed or not 
  if(UserInfo?.isDeleted){
    return next(new Error("This account is Freezed", { cause: 404 }));
  }

  // destroy token after changing password
  if(parseInt(UserInfo.passwordChangedAt?.getTime() / 1000) > decodedToken.iat){
    return next(new Error("Token expired , sign in again", { cause: 400 }));
}

  req.user = UserInfo;
  next();
});

export const authorization = (accessRole = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRole.includes(req.user.role)) {
      return next(new Error("Access Denied", { cause: 400 }));
    }
    next();
  });
};
