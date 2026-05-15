import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();


app.use(cors({
    origin: process.env.cors_origin,
    credentials: true
}))

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/User.routes.js";




// routes declaration
app.use("/api/v1/users", userRoutes);



export default app;