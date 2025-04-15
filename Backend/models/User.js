import { Schema, model } from "mongoose";
import { UserType } from "../../Shared/user.types.js";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.CUSTOMER,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
