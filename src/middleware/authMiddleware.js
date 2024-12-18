
import {verifyToken} from "../../src/utility/tokenUtility.js";
import User from "../model/userModel.js";

export const authenticateUser = async (req, res, next)=>{
    const token = req.headers.token || req.cookies.token;
    if(!token){
        return res.status(401).json({status: "error", message: "No token provided. Please log in"});
    }
    const decodedToken = await verifyToken(token);
    if(!decodedToken){
        return res.status(401).json({status: "error", message: "No token provided. Please log in"});
    }
    const id = decodedToken.id;
    const phoneNumber = decodedToken.phoneNumber;
    req.headers.id = id;
    req.headers.phoneNumber = phoneNumber;
    next()
}

//admin middleware === check user is admin or not
export  const isAdmin = async (req, res, next)=>{
    try {
        const adminID = req.headers.id;
        if(!adminID){
            return res.status(401).json({status: "error", message: "No token provided. Please login"});
        }
        const admin = await User.findOne({_id: adminID});
        if(admin.isAdmin === false){
            return res.status(401).json({status: "error", message: "You must be an admin"});
        }
        next()
    }catch (e) {
        return res.status(500).json({status: "error", error: e.message});
    }

}