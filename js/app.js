// Кога ги вчитуваш производите во loop/forEach:
const productCard = `
  <div class="col-md-4 mb-4">
    <div class="card h-100 shadow-sm border-0">
      <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-danger">${product.category}</span>
          <h5 class="text-success fw-bold mb-0">${product.price} ден.</h5>
        </div>
        <h5 class="card-title fw-bold">${product.name}</h5>
        <p class="card-text text-muted">${product.description}</p>
        <div class="d-flex justify-content-between mt-3">
          <!-- Копче со прилагодени data-атрибути -->
          <button class="btn btn-outline-success btn-details" 
                  data-name="${product.name}"
                  data-category="${product.category}"
                  data-price="${product.price}"
                  data-description="${product.description}"
                  data-image="${product.imageUrl}">
            Детали
          </button>
          <a href="edit-product.html?id=${product._id}" class="btn btn-outline-warning">✏️ Измени</a>
        </div>
      </div>
    </div>
  </div>
`;
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-details')) {
        const btn = e.target;
        
        // Вземи ги податоците од копчето
        const name = btn.getAttribute('data-name');
        const category = btn.getAttribute('data-category');
        const price = btn.getAttribute('data-price');
        const description = btn.getAttribute('data-description');
        const image = btn.getAttribute('data-image');

        // Пополни го модалот
        document.getElementById('detailsModalName').innerText = name;
        document.getElementById('detailsModalCategory').innerText = category;
        document.getElementById('detailsModalPrice').innerText = `${price} ден.`;
        document.getElementById('detailsModalDescription').innerText = description;
        document.getElementById('detailsModalImage').src = image;

        // Отвори го Bootstrap Модалот
        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }
});