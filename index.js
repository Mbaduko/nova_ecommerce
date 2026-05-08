import express from 'express';
import dotenv from 'dotenv';
import {saveProduct, getProducts, updateProduct} from './src/controllers/productControllers.js'
import {createUser, login} from './src/controllers/userControllers.js'
import {prisma} from './src/config/prisma.js';
import protect, {grantAccess} from './src/middlewares/auth.js';
import { cancelOrder, createOrder } from './src/controllers/orderController.js';
import swaggerConfig from './src/config/swagger.js';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express()
const PORT = process.env.PORT|| 3000;
app.use(express.json());

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.post('/products', protect, grantAccess('ADMIN'), saveProduct);

app.get('/products', getProducts);

app.put('/products/:id', updateProduct);

app.post('/users', createUser);


/** 
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - Authentication
 *      summary: User login
 *      description: Authenticate a user and return a JWT token.
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              required: true
 *                              example: "urugero@urundi.smth"
 *                          password:
 *                              type: string
 *                              format: password
 *                              required: true
 *                              example: "password123"
 *      responses:
 *          200:
 *              description: A JWT token
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1cnVyZ2VyQHVydW5kaS5zbXRoIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjg4ODk3MDYxfQ.4n8j8v7lHh3z8u9aVb2eX9s8f7g6h5j4k3l2m1n0o"
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *                              message:
 *                                  type: string
 *                                  example: Login successful
 *                              data: 
 *                                  type: object
 *                                  properties:
 *                                      id: 
 *                                          type: number
 *                                      name:
 *                                          type: string
 *                                      role:
 *                                          type: string
 *                                      email:
 *                                          type: string
 *                                          format: email
 */
app.post('/login', login);

app.post('/orders', protect, grantAccess('CUSTOMER'), createOrder);
app.put('/orders/:id/cancel', protect, cancelOrder);


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