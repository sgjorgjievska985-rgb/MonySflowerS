const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Сервирање на сите статични HTML, CSS и JS фајлови од главната папка
app.use(express.static(path.join(__dirname)));

// Root рута ( / ) која ја отвора почетната страница index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Стартување на серверот
app.listen(PORT, () => {
    console.log(`Серверот е успешно стартуван на: http://localhost:${PORT}`);
});