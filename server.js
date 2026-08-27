const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/monysflowers';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Поврзување со MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log(' Успешно поврзано со MongoDB базата'))
    .catch(err => console.error(' Грешка при поврзување со MongoDB:', err));

// --- REST API РУТИ (CRUD) ---

// 1. Земање на сите производи (GET)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Земање на еден производ по ID (GET)
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Производот не е пронајден' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Креирање нов производ (POST)
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Ажурирање на производ (PUT)
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. Бришење на производ (DELETE)
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
    console.log(`Серверот работи на: http://localhost:${PORT}`);
});