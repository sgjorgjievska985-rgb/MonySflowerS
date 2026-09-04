const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Swagger Конфигурација (Внимавај apis да го вклучува './routes/*.js')
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Mony's Flowers API",
            version: '1.0.0',
            description: 'API документација за производи и корисници'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./routes/*.js', './server.js'] // Ќе ги скенира сите рути во папката routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 2. Регистрирање на рутите
const productRoutes = require('./routes/products'); // или како што ти се вика рутерот за производи
const userRoutes = require('./routes/users');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // Нов ендпоинт за корисници

// Стартување на серверот
app.listen(3000, () => console.log('Серверот работи на порт 3000'));