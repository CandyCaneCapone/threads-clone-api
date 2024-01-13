import mongoose from "mongoose";

const connectDB = async (): Promise<any> => {
  try {
    if (process.env.MONGO_URI !== undefined) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`Connected to MongoDB`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
