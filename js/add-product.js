// 1. Ги земаме сите производи од бекендот при вчитување
let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        allProducts = await response.json();
        renderProducts(allProducts); // Ги прикажува сите производи на почеток
    } catch (err) {
        console.error('Грешка при преземање на производите:', err);
    }
}

// 2. Функција за прикажување производи на страницата
function renderProducts(products) {
    const container = document.getElementById('productsContainer'); // Провери го id-то на контејнерот
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p class="text-center">Не се пронајдени производи.</p>';
        return;
    }

    products.forEach(product => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="fw-bold">${product.price} ден.</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. Настан кога ќе се кликне копчето "Пребарај"
document.getElementById('searchBtn').addEventListener('click', function() {
    const selectedValue = document.getElementById('categorySelect').value.toLowerCase();

    // Ако не е избрано ништо или е избрано "Сите", прикажи ги сите
    if (!selectedValue || selectedValue === 'all') {
        renderProducts(allProducts);
        return;
    }

    // Филтрирај според категоријата или името
    const filteredProducts = allProducts.filter(product => 
        product.category.toLowerCase().includes(selectedValue) || 
        product.name.toLowerCase().includes(selectedValue)
    );

    renderProducts(filteredProducts);
});

// Повикај ја функцијата за иницијално вчитување
fetchProducts();
