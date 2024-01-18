import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import IUser from "../types/user";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[\w-]+(?:\.[\w-]+)*@(?:[a-zA-Z0-9]+\.)+[a-zA-Z]{2,7}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    profilePic : {
      type : String 
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (): Promise<any> {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<any> {
  return await bcrypt.compare(password , this.password);
};

const User = mongoose.model("users", userSchema);

export default User;
