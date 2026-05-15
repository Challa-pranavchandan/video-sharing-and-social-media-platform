import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({

    username: {
        type : String,
        required : true,
        unique : true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type : String,
        required : true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,//cloudinary
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required : [true,"Password is required"]
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(Password){
    return await bcrypt.compare(Password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,

        },
         process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: PROCESS.env.ACCESS_TOKEN_EXPIRES_IN
        }
    );
};

userSchema.methods.generateRefreshToken = function()
{
    return jwt.sign(
    {
        id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn: PROCESS.env.REFRESH_TOKEN_EXPIRES_IN
    }
    );
};

export const User = mongoose.model("User", userSchema);