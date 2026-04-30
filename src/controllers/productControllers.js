import {prisma} from "../config/prisma.js";

export const saveProduct = async (req, res, next) => {
    try {
        const inputs = req.body;
        console.log(inputs);
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

// module.exports = {
//     saveProduct
// }