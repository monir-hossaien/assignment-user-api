import User from "../../src/model/userModel.js";
import bcrypt from "bcrypt";
import {createToken} from "../../src/utility/tokenUtility.js";


export const Registration = async (req,res)=>{
    try {
        const reqBody = req.body;
        const userNid = reqBody.NIDNumber;
        const existingUser = await User.findOne({NIDNumber: userNid});
        if(existingUser){
            return res.status(400).json({error: 'User already exists'});
        }
        const user = await User.create(reqBody);
        return res.status(200).json({status: "success", message: "User created successfully", data: user});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}

export const login = async (req,res)=>{
    try {
        const {phoneNumber, password} = req.body;
        if(!phoneNumber || !password){
            return res.status(400).json({error: 'Phone and password must be required'});
        }
        const user = await User.findOne({phoneNumber: phoneNumber});
        if(!user){
            return res.status(400).json({error: 'User does not exist'});
        }
        //check password
        const isValid = await bcrypt.compareSync(password, user.password);
        if(!isValid){
            return res.status(400).json({error: 'Invalid number or password'});
        }
        // create token
        const token = await createToken(user['_id'], user['phoneNumber']);
        res.cookie('token', token, {httpOnly:true, expiresIn: '1h'});

        return res.status(200).json({status: "success", message: "User login successfully", token: token});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}

export const readProfile = async (req,res)=>{
    try {
        const userID = req.headers.id;
        const user = await User.findOne({_id: userID}).select('-password');
        if(!user){
            return res.status(404).json({error: 'user not found'});
        }
        return res.status(200).json({status: "success", user: user});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}

export const updateProfile = async (req,res)=>{
    try {
        const reqBody = req.body;
        const userID = req.headers.id;
        const user = await User.findByIdAndUpdate({_id: userID}, {$set: reqBody}, {new: true});
        return res.status(200).json({status: "success", message: "User updated successfully", data: user});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}

export const allUserprofile = async (req,res)=>{
    try {
        const allUser = await User.find().select('-password');
        return res.status(200).json({status: "success", data: allUser});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}

export const deleteUser = async (req,res)=>{
    try {
        const userID = req.params.id;
        const user = await User.findOne({_id: userID})
        if(!user){
            return res.status(404).json({error: 'User does not exist'});
        }
        await User.deleteOne({_id: userID});
        return res.status(200).json({status: "success"});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}

export const logout = async (req,res)=>{
    try {
        const userID = req.headers.id;
        console.log(userID)
        const user = await User.findOne({_id: userID});
        if(!user){
            return res.status(401).json({error: 'User does not exist'});
        }
        res.clearCookie('token');
        return res.status(200).json({status: "success", message: "logout successfully"});
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }
}