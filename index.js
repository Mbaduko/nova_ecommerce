import express from 'express';
import dotenv from 'dotenv';
import {saveProduct, getProducts, updateProduct} from './src/controllers/productControllers.js'
import {createUser, login} from './src/controllers/userControllers.js'
import {prisma} from './src/config/prisma.js';
import protect from './src/middlewares/auth.js';

dotenv.config();

const app = express()

const PORT = process.env.PORT|| 3000;
app.use(express.json());

app.post('/products', protect, saveProduct);

app.get('/products', getProducts);
``
app.put('/products/:id', updateProduct);

app.post('/users', createUser);

app.post('/login', login);


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