import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 15,
      required: true,
    },
    password: {
      type: String,
      minLength: 3,
      required: true,
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minLength: 10,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("Users", userSchema);

export default userModel;
