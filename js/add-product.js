document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: Number(document.getElementById('price').value),
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('imageUrl').value
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                const data = await response.json();
                console.log('Успешно зачувано во MongoDB:', data);
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
