import mongoose, { ObjectId } from "mongoose";

interface IUser extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  followers: ObjectId[];
  following: ObjectId[];
  profilePic: string;
  comparePassword (password : string) : Promise<any>
}

export default IUser;
