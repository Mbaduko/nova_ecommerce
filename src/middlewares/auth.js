import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const protect = (req, res, next) => {
    const authHeader= req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Auth header missing"
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message:"Missing token"
        })
    }

    try {
        const tokenPayload = jwt.verify(token,process.env.JWT_KEY);
        return next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}

export default protect;