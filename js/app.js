// Во функцијата каде што ги изцртуваш производите:
const productsContainer = document.getElementById('products-container'); // или твојот container ID

// Кога ги изминуваш производите:
products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    
    card.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <span class="badge bg-danger mb-2">${product.category}</span>
                <h5 class="card-title fw-bold">${product.name}</h5>
                <h5 class="text-success fw-bold mb-3">${product.price} ден.</h5>
                <p class="card-text text-muted">${product.description}</p>
                <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-outline-success btn-details">Детали</button>
                    <a href="edit-product.html?id=${product._id}" class="btn btn-outline-warning">Измени</a>
                </div>
            </div>
        </div>
    `;

    // 🔽 КЛУЧНИОТ ДЕЛ: Директно му ги доделуваме податоците на копчето 🔽
    const detailsBtn = card.querySelector('.btn-details');
    detailsBtn.addEventListener('click', () => {
        document.getElementById('detailsModalName').innerText = product.name;
        document.getElementById('detailsModalCategory').innerText = product.category;
        document.getElementById('detailsModalPrice').innerText = `${product.price} ден.`;
        document.getElementById('detailsModalDescription').innerText = product.description;
        document.getElementById('detailsModalImage').src = product.imageUrl;

        // Прикажи го модалот
        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    });

    productsContainer.appendChild(card);
});