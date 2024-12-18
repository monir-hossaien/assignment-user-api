import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {saltRounds} from "../../src/config/config.js";

const DataSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        NIDNumber: {
            type: String,
            required: [true, 'NID is required'],
            trim: true,
            unique: [true, 'NID Number must be unique'],
            immutable: true,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone is required'],
            unique: [true, 'Phone Number must be unique'],
            immutable: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(saltRounds)), // Hashing password before saving
        },
        bloodGroup: {
            type: String,
            required: [true, 'Blood group is required'],
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            default: 'A+',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        }

    },
    {
        timestamps: true,
        versionKey: 'false',
    });

const User = mongoose.model('User', DataSchema);
export default User;