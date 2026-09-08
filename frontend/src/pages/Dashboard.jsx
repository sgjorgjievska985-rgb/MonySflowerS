import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Залиха на производи (парчиња)',
        data: products.map(p => p.stock),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2 className="mb-4">Статистика и Залиха</h2>
      <div className="card p-4 shadow-sm">
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;