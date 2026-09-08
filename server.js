const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/monysflowers';

// Middleware за JSON парсирање и статички фајлови
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/add-product', (req, res) => res.sendFile(path.join(__dirname, 'add-product.html')));
app.get('/edit-product', (req, res) => res.sendFile(path.join(__dirname, 'edit-product.html')));

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: String,
    imageUrl: String
}));

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}));

const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
    name: { type: String, required: true },
    description: String
}));

const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}));

const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
}));

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

// --- REST API РУТИ ЗА PRODUCTS ---

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Ги враќа сите производи
 *     tags: [Products]
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
 *     tags: [Products]
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
 *     tags: [Products]
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
 *     tags: [Products]
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
 *     tags: [Products]
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

// --- REST API РУТИ ЗА USERS ---

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Ги враќа сите корисници
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешно преземени сите корисници
 */
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Креира нов корисник
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 default: user
 *     responses:
 *       201:
 *         description: Успешно креиран корисник
 */
app.post('/api/users', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Брише корисник по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Корисникот е успешно избришан
 */
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Корисникот е успешно избришан' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root рута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.delete('/db', async (req, res) => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        res.json({ message: 'Базата е успешно исчистена (сите податоци се избришани).' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Внесување на иницијални (Seed) податоци
app.post('/db', async (req, res) => {
    try {
        // Бришење на стари за чист почеток
        await Product.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});

        // Додавање категории
        const categories = await Category.insertMany([
            { name: 'Букети', description: 'Свежи цветни букети за сите пригоди' },
            { name: 'Собни растенија', description: 'Зелени саксиски растенија' }
        ]);

        // Додавање производи
        const products = await Product.insertMany([
            { name: 'Црвени Рози', category: 'Букети', price: 1500, stock: 10, description: 'Букет од 101 црвена роза', imageUrl: '' },
            { name: 'Орхидеја', category: 'Собни растенија', price: 800, stock: 5, description: 'Бела елегантна орхидеја', imageUrl: '' }
        ]);

        // Додавање демо администратор
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@monysflowers.com',
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            message: 'Иницијалните податоци се успешно внесени!',
            stats: {
                categories: categories.length,
                products: products.length,
                adminCreated: adminUser.username
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Серверот е активен на: http://localhost:${PORT}`);
    console.log(`Swagger документацијата е достапна на: http://localhost:${PORT}/api-docs`);
});