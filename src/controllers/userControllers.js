import { prisma } from "../config/prisma.js";
import argon2 from "argon2";


export const createUser = async (req, res,next) => {
    try {

        const {password} = req.body;
        const inputs = req.body;
        const hashedPassword = await argon2.hash(password);
        inputs.password = hashedPassword;
        
        const createUser = await prisma.user.create({
            data: inputs
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: createUser
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating user"
        })
    }
}