import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";




const connectDB = async() => {

     try {
          const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
          console.log(`MongoDB connected successfully DB host ${connection.connection.host}`);
     } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
     }


}



export default connectDB