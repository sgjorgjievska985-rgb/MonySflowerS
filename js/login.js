document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        alert('Успешна најава!');
        window.location.href = data.role === 'admin' ? '/add-product' : '/';
    } else {
        alert(data.error);
    }
});