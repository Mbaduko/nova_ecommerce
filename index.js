import express from 'express';
import dotenv from 'dotenv';
import {saveProduct} from './src/controllers/productControllers.js'
import {prisma} from './src/config/prisma.js';

dotenv.config();

const app = express()

const PORT = process.env.PORT|| 3000;
app.use(express.json());

app.post('/products', saveProduct);

app.get('/products', async (req, res, next) => {
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
});

app.put('/products/:id', async (req, res, next) => {
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
});


app.listen(PORT, async () => {
    try {
        await prisma.$connect()
        console.log("DB connections successful");
        console.log("Ecommerce server running on port:", PORT);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})



// getProducts();