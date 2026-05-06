import {prisma} from '../config/prisma.js';
import * as z from 'zod';   

export const createOrder = async (req, res, next) => {
    try {
        const zodSchema = z.object({
            userId: z.number(),
            products: z.array(z.object({
                productId: z.number(),
                quantity: z.number().min(1, 'Quantity must be at least 1')
            }))
        })

        console.log("Request body:", req.body);

        const result = zodSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: result.error
            });
        }

        const {userId, products} = req.body;

        const user = await prisma.user.findUnique({
            where:{
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };

        let totalPrice =0;
        products.forEach(async (product, index)=> {
            const productFromDb = await prisma.product.findUnique({
                where: {
                    id: product.productId
                }
            });

            if (!productFromDb) {
                return res.status (404).json({
                    success: false,
                    message: `Product with id ${product.productId} is missing`
                });
            }

            if (productFromDb.quantity < product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for product with id ${product.productId} available quantity is ${productFromDb.quantity}`
                });
            };

            totalPrice += productFromDb.price * product.quantity;

            await prisma.product.update({
                where: {
                    id:product.productId
                },
                data: {
                    quantity: productFromDb.quantity - product.quantity
                }
            });
        });

        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice
            }
        });

        products.forEach(async (product) => {
            await prisma.oderedProduct.create({
                data: {
                    orderId: order.id,
                    productId: product.productId,
                    quantity: product.quantity
                }
            });
        })

        return res.status(201).json({
            success: true,
            message: "Order is created successfully",
            data: order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}