import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^\d{10}$/.test(v),
            message: "Mobile number must be 10 digits",
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: "Invalid email format",
        },
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
    loginId: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (v) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v),
            message:
                "Password must have at least 6 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        },
    },
    socketId: {
        type: String,
        trim: true,
        default: null,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

const User = mongoose.model("User", userSchema);

export default User;
