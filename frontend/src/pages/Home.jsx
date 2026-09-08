import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const convertPrice = async (id, amount) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/convert-price/${amount}`);
      setConvertedPrices(prev => ({ ...prev, [id]: res.data.convertedEur }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Наши Производи</h2>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.category}</p>
                <p className="card-text">{product.description}</p>
                <h6 className="text-primary fw-bold">{product.price} МКД</h6>
                
                {convertedPrices[product._id] && (
                  <p className="text-success small fw-bold">
                    ≈ {convertedPrices[product._id]} EUR (пресметано во живо)
                  </p>
                )}

                <button 
                  className="btn btn-outline-secondary btn-sm mt-2"
                  onClick={() => convertPrice(product._id, product.price)}
                >
                  Конвертирај во EUR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;