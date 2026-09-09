const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/monysflowers';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// --- 5 КОЛЕКЦИИ (МОДЕЛИ) ---
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

// --- SWAGGER КОНФИГУРАЦИЈА ---
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Mony's Flowers API",
    version: "1.0.0",
    description: "REST API за онлајн продавница за цвеќиња со 5 колекции и JWT автентикација"
  },
  servers: [
    {
      url: "http://localhost:3000"
    }
  ],
  tags: [
    { name: "Products", description: "Работа со производи" },
    { name: "Users", description: "Автентикација и корисници" },
    { name: "Categories", description: "Категории на производи" },
    { name: "Orders", description: "Управување со нарачки" },
    { name: "Reviews", description: "Оцени и рецензии" },
    { name: "Database", description: "Административни операции со базата" },
    { name: "Currency", description: "Конверзија на валути" }
  ],
  paths: {
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Ги враќа сите производи",
        responses: { "200": { description: "Успешно" } }
      },
      post: {
        tags: ["Products"],
        summary: "Креира нов производ",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Лале" },
                  category: { type: "string", example: "Букети" },
                  price: { type: "number", example: 300 },
                  stock: { type: "number", example: 15 },
                  description: { type: "string", example: "Свежи пролетни лалиња" },
                  imageUrl: { type: "string", example: "" }
                },
                required: ["name", "category", "price", "stock"]
              }
            }
          }
        },
        responses: { "201": { description: "Креирано" } }
      }
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Враќа производ по единечен ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Успешно" } }
      },
      put: {
        tags: ["Products"],
        summary: "Ажурира постоечки производ",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Ажурирано" } }
      },
      delete: {
        tags: ["Products"],
        summary: "Брише производ по ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Избришано" } }
      }
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Ги враќа сите корисници",
        responses: { "200": { description: "Успешно" } }
      }
    },
    "/api/users/register": {
      post: {
        tags: ["Users"],
        summary: "Регистрација на нов корисник",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "korisnik1" },
                  email: { type: "string", example: "korisnik1@gmail.com" },
                  password: { type: "string", example: "123456" },
                  role: { type: "string", example: "user" }
                },
                required: ["username", "email", "password"]
              }
            }
          }
        },
        responses: { "201": { description: "Успешна регистрација" } }
      }
    },
    "/api/users/login": {
      post: {
        tags: ["Users"],
        summary: "Најава на корисник и генерација на JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "korisnik1" },
                  password: { type: "string", example: "123456" }
                },
                required: ["username", "password"]
              }
            }
          }
        },
        responses: { "200": { description: "Успешна најава" } }
      }
    },
    "/api/users/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Брише корисник по ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Избришано" } }
      }
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Ги враќа сите категории",
        responses: { "200": { description: "Успешно" } }
      },
      post: {
        tags: ["Categories"],
        summary: "Креира нова категорија",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Свадбени букети" },
                  description: { type: "string", example: "Цвеќиња за свадбени прослави" }
                },
                required: ["name"]
              }
            }
          }
        },
        responses: { "201": { description: "Креирано" } }
      }
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Ги враќа сите нарачки",
        responses: { "200": { description: "Успешно" } }
      },
      post: {
        tags: ["Orders"],
        summary: "Креира нова нарачка",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { type: "string", example: "ВНЕСИ_USER_ID_ТУКА" },
                  products: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        product: { type: "string", example: "ВНЕСИ_PRODUCT_ID_ТУКА" },
                        quantity: { type: "number", example: 2 }
                      }
                    }
                  },
                  totalPrice: { type: "number", example: 3000 }
                },
                required: ["user", "totalPrice"]
              }
            }
          }
        },
        responses: { "201": { description: "Креирано" } }
      }
    },
    "/api/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Ги враќа сите рецензии",
        responses: { "200": { description: "Успешно" } }
      },
      post: {
        tags: ["Reviews"],
        summary: "Додава нова рецензија",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  product: { type: "string", example: "ВНЕСИ_PRODUCT_ID_ТУКА" },
                  username: { type: "string", example: "korisnik1" },
                  comment: { type: "string", example: "Прекрасен букет!" },
                  rating: { type: "number", example: 5 }
                },
                required: ["product", "username", "comment", "rating"]
              }
            }
          }
        },
        responses: { "201": { description: "Креирано" } }
      }
    },
    "/api/convert-price/{amount}": {
      get: {
        tags: ["Currency"],
        summary: "Конверзија на цена од MKD во EUR",
        parameters: [{ name: "amount", in: "path", required: true, schema: { type: "number" } }],
        responses: { "200": { description: "Успешна конверзија" } }
      }
    },
    "/db": {
      post: {
        tags: ["Database"],
        summary: "Внесување иницијални (Seed) податоци во базата",
        responses: { "201": { description: "Базата е успешно наполнета" } }
      },
      delete: {
        tags: ["Database"],
        summary: "Бришење на сите податоци од сите 5 колекции",
        responses: { "200": { description: "Базата е исчистена" } }
      }
    }
  }
};

// Се сервира Swagger UI директно од објектот
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ПОВРЗУВАЊЕ СО BAZA ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('Успешно поврзано со MongoDB'))
    .catch(err => console.error('Грешка со MongoDB:', err));

// --- API РУТИ ---

// 1. PRODUCTS
app.get('/api/products', async (req, res) => {
    try { res.json(await Product.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/products', async (req, res) => {
    try { res.status(201).json(await new Product(req.body).save()); } catch (err) { res.status(400).json({ error: err.message }); }
});
app.delete('/api/products/:id', async (req, res) => {
    try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Избришано' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. USERS
app.get('/api/users', async (req, res) => {
    try { res.json(await User.find({}, '-password')); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role: role || 'user' });
        await newUser.save();
        res.status(201).json({ message: 'Успешна регистрација' });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Погрешно корисничко име или лозинка' });
        }
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, username: user.username, role: user.role });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. CATEGORIES
app.get('/api/categories', async (req, res) => {
    try { res.json(await Category.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/categories', async (req, res) => {
    try { res.status(201).json(await new Category(req.body).save()); } catch (err) { res.status(400).json({ error: err.message }); }
});

// 4. ORDERS
app.get('/api/orders', async (req, res) => {
    try { res.json(await Order.find().populate('user').populate('products.product')); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/orders', async (req, res) => {
    try { res.status(201).json(await new Order(req.body).save()); } catch (err) { res.status(400).json({ error: err.message }); }
});

// 5. REVIEWS
app.get('/api/reviews', async (req, res) => {
    try { res.json(await Review.find().populate('product')); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/reviews', async (req, res) => {
    try { res.status(201).json(await new Review(req.body).save()); } catch (err) { res.status(400).json({ error: err.message }); }
});

// DATABASE ADMIN OPS
app.delete('/db', async (req, res) => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        res.json({ message: 'Сите 5 колекции се успешно избришани.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/db', async (req, res) => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});

        const categories = await Category.insertMany([
            { name: 'Букети', description: 'Свежи цветни букети' },
            { name: 'Собни растенија', description: 'Зелени саксиски растенија' }
        ]);

        const products = await Product.insertMany([
            { name: 'Црвени Рози', category: 'Букети', price: 1500, stock: 10, description: 'Букет од 101 црвена роза', imageUrl: '' },
            { name: 'Орхидеја', category: 'Собни растенија', price: 800, stock: 5, description: 'Бела елегантна орхидеја', imageUrl: '' }
        ]);

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@monysflowers.com',
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({ message: 'Базата е успешно пополнета со иницијални податоци!', categories, products, adminUser });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// EXTERNAL CURRENCY API
app.get('/api/convert-price/:amount', async (req, res) => {
    try {
        const amountInMkd = parseFloat(req.params.amount);
        const response = await fetch('https://open.er-api.com/v6/latest/EUR');
        const data = await response.json();
        
        const mkdRate = data.rates ? data.rates.MKD : 61.5;
        const amountInEur = (amountInMkd / mkdRate).toFixed(2);

        res.json({
            originalMkd: amountInMkd,
            convertedEur: parseFloat(amountInEur),
            rateUsed: mkdRate,
            source: "External Exchange Rate API"
        });
    } catch (err) {
        res.status(500).json({ error: 'Грешка при поврзување со надворешниот API сервис' });
    }
});

// HTML STRANICI
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/add-product', (req, res) => res.sendFile(path.join(__dirname, 'add-product.html')));
app.get('/edit-product', (req, res) => res.sendFile(path.join(__dirname, 'edit-product.html')));

app.listen(PORT, () => console.log(`Серверот е активен на: http://localhost:${PORT}`));