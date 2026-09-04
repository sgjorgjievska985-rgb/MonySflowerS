document.getElementById('addProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 1. Земи ги вредностите од сите полиња
    const productData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: Number(document.getElementById('price').value),
        stock: Number(document.getElementById('stock').value),
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value
    };

    try {
        // 2. Испрати POST барање до бекендот
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Производот е успешно додаден!');
            window.location.href = 'index.html'; // Редирекција до почетната
        } else {
            alert('Грешка: ' + (data.error || 'Неуспешно додавање'));
        }
    } catch (err) {
        console.error('Грешка при поврзување:', err);
        alert('Серверот не е достапен.');
    }
});
