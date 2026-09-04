// Се зема формата за додавање од HTML
const addProductForm = document.getElementById('add-product-form');

if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Го спречува превчитувањето на страницата

        // Се земаат вредностите од полињата во формата
        const newProduct = {
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: Number(document.getElementById('price').value),
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('imageUrl').value
        };

        try {
            // Твојот fetch повик овде:
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Успешно зачувано во MongoDB:', data);
                alert('Производот е успешно додаден!');
                window.location.href = 'index.html'; // Пренасочување кон почетната
            } else {
                alert('Грешка при додавање на производот.');
            }
        } catch (err) {
            console.error('Грешка:', err);
        }
    });
}