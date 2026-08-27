document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: Number(document.getElementById('productPrice').value),
            stock: Number(document.getElementById('productStock').value),
            imageUrl: document.getElementById('productImage').value,
            description: document.getElementById('productDescription').value
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                alert('Производот е успешно додаден!');
                window.location.href = 'index.html';
            } else {
                alert('Грешка при зачувување на производот.');
            }
        } catch (err) {
            console.error('Грешка:', err);
        }
    });
});
