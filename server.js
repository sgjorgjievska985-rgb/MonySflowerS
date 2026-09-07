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

// Mongoose Модели
const Product = mongoose.model('Product', new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: String,
    imageUrl: String
}));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}));

// Swagger Спецификација со Тагови за задебелени секции
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: "Mony's Flowers API",
        version: '1.0.0',
        description: 'API документација за производи и корисници'
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
        { name: 'Products', description: 'Управување со производи' },
        { name: 'Users', description: 'Управување со корисници' }
    ],
    paths: {
        '/api/products': {
            get: {
                tags: ['Products'],
                summary: 'Земање на сите производи',
                responses: { 200: { description: 'Успешно' } }
            },
            post: {
                tags: ['Products'],
                summary: 'Додавање нов производ',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Црвени Рози' },
                                    category: { type: 'string', example: 'Букети' },
                                    price: { type: 'number', example: 2400 },
                                    stock: { type: 'number', example: 15 },
                                    description: { type: 'string', example: 'Опис' },
                                    imageUrl: { type: 'string', example: 'https://site.com/img.jpg' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Креирано' } }
            }
        },
        '/api/users': {
            get: {
                tags: ['Users'],
                summary: 'Земање на сите корисници',
                responses: { 200: { description: 'Успешно' } }
            },
            post: {
                tags: ['Users'],
                summary: 'Додавање нов корисник',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string', example: 'ana_petrovska' },
                                    email: { type: 'string', example: 'ana@gmail.com' },
                                    password: { type: 'string', example: 'парола123' },
                                    role: { type: 'string', example: 'user' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Корисникот е креиран' } }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Рути
app.get('/api/products', async (req, res) => res.json(await Product.find()));
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => res.json(await User.find()));
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Серверот е активен на http://localhost:3000'));