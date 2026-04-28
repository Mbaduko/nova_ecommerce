const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
dotenv.config();

const app = express()

const prisma = new PrismaClient();

const PORT = process.env.PORT|| 3000;
app.use(express.json());

app.post('/products', async (req, res, next) => {
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
});

const saveProduct = async (productValue) => {
    try {
        const productSaved = await prisma.product.create({
            data: productValue,
        });
        console.log(productSaved);
    } catch (error) {
        console.error("Error saving Product",error);
    }
};

const getProducts = async () => {
    try {
        const products = await prisma.product.findMany();
        console.log(products)
    } catch (error) {
        console.error("Error fetching products",error);
    }
}


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