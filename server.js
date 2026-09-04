const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/monysflowers';

// Middleware за JSON парсирање и статички фајлови
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Swagger Конфигурација
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Mony's Flowers REST API",
            version: '1.0.0',
            description: 'API за управување со производи и корисници'
        },
        servers: [{ url: `http://localhost:${PORT}` }]
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Поврзување со MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log(' Успешно поврзано со MongoDB базата'))
    .catch(err => console.error(' Грешка при поврзување со MongoDB:', err));

// --- REST API РУТИ СО SWAGGER ДОКУМЕНТАЦИЈА ---

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Ги враќа сите производи
 *     responses:
 *       200:
 *         description: Успешно преземени сите производи
 */
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Враќа производ по единечен ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешно пронајден производ
 *       404:
 *         description: Производот не е пронајден
 */
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Производот не е пронајден' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Креира нов производ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешно креиран производ
 */
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Ажурира постоечки производ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешно ажуриран производ
 */
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Брише производ по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Производот е успешно избришан
 */
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Производот е успешно избришан' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root рута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Серверот е активен на: http://localhost:${PORT}`);
    console.log(`Swagger документацијата е достапна на: http://localhost:${PORT}/api-docs`);
});