import {prisma} from "../config/prisma.js";

export const saveProduct = async (req, res, next) => {
    try{
        const inputs = req.body;
        const result = await prisma.product.create({
            data: inputs
        })

        return res.status(201).json({
            status: "success",
            data: result
        })
    } catch (error) {
        console.error("Error creating product:",error);
        return res.status(500).json({
          status:"failed"  
        })
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({
            success: false,
            message: "error fetching products"
        });
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;


        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updates
        });

        return res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product;", error);
        return res.status(500).json({
            success: false,
            message: "error updating product"
        });
    };
}