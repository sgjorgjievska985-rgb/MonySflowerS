const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Поврзување со база
mongoose.connect('mongodb://127.0.0.1:27017/monysflowers')
    .then(() => console.log('Успешна конекција со MongoDB!'))
    .catch(err => console.error('Грешка со база:', err));

// Модели
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, category: String, price: Number, stock: Number, description: String, imageUrl: String
}));

const User = mongoose.model('User', new mongoose.Schema({
    username: String, email: String, password: String, role: { type: String, default: 'user' }
}));

// Swagger Документација
const swaggerSpec = {
    openapi: '3.0.0',
    info: { title: "Mony's Flowers API", version: '1.0.0' },
    paths: {
        '/api/products': {
            get: { summary: 'Сите производи', responses: { 200: { description: 'OK' } } },
            post: { summary: 'Додај производ', responses: { 201: { description: 'Created' } } }
        },
        '/api/users': {
            get: { summary: 'Сите корисници', responses: { 200: { description: 'OK' } } },
            post: { summary: 'Додај корисник', responses: { 201: { description: 'Created' } } }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Рути
app.get('/api/products', async (req, res) => res.json(await Product.find()));
app.post('/api/products', async (req, res) => res.status(201).json(await new Product(req.body).save()));

app.get('/api/users', async (req, res) => res.json(await User.find()));
app.post('/api/users', async (req, res) => res.status(201).json(await new User(req.body).save()));

app.listen(3000, () => console.log('Серверот работи на http://localhost:3000'));