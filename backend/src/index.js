import dotenv from "dotenv"
import mongoose from 'mongoose';

import { DB_NAME } from './constants.js';
import connectDB from "./db/index.js"
import app from './app.js'

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.on(`error`, (err) => {      // Listen for server errors
        console.log(`server error : ${err}`);
        throw err; // Rethrow the error to be caught by the outer catch block
    });
    app.listen(process.env.PORT || 8000, () => {// Start the server
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("mongodb error connection :", err)
})




