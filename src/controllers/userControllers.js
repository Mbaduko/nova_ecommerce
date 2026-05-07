import { prisma } from "../config/prisma.js";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import * as z from "zod";
import { UserRole } from "@prisma/client";

dotenv.config();

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

export const login = async (req, res, next) => {
    try {

        const logingSchema= z.object({
            email: z.string(
                'Invalid email address'
            ).email('Use email format'),
            password:z.string('Invalid passwor<d').min(8,'Password must be at least 8 characters long')
        });

        const result = logingSchema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input", 
                errors: result.error
            });
        };


        const {email,password} = req.body;
        
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json ({
                success: false,
                message: "User not found"
            })
        }
        const isPasswordRight = await argon2.verify(user.password, password);
        if (isPasswordRight) {
            const {password, ...userInfo} = user;
            const token = jwt.sign({
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1d"
                }
            );
            return res.status(200).json ({
                success: true,
                message: "Login successful",
                token,
                data: userInfo
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
     } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in"
        })
    }
};