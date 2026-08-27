document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Свадбени аранжмани (40%)', 'Букети за роденден (35%)', 'Саксиски цвеќиња (25%)'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: ['#198754', '#ffc107', '#0dcaf0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Најпродавани категории оваа сезона'
                }
            }
        }
    });
});