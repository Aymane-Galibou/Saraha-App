import jwt from "jsonwebtoken";

export const decodeToken = ({ token, signature }) => {
  return jwt.verify(token, signature);
};
