function showDetails(name, category, price, description, imageUrl) {
    document.getElementById('detailsModalName').innerText = name;
    document.getElementById('detailsModalCategory').innerText = category;
    document.getElementById('detailsModalPrice').innerText = price;
    document.getElementById('detailsModalDescription').innerText = description;
    document.getElementById('detailsModalImage').src = imageUrl;
}