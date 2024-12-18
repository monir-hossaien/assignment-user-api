import jwt from 'jsonwebtoken';
import {JWT_KEY} from "../../src/config/config.js";

export const createToken = (id, phoneNumber)=>{
    const payload = {id, phoneNumber};
    const token = jwt.sign(payload, JWT_KEY, {expiresIn: '1h'});
    return token;
}

export const verifyToken = async (token)=>{
    try {
        const decoded = await jwt.verify(token, JWT_KEY);
        return decoded;
    }
    catch (e) {
        return null
    }
}