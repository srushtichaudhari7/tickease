import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: String,
  password: String,
  role: { type: String, enum: ["Employee", "Customer"], default: "Customer" }
});

export default model("User", UserSchema);