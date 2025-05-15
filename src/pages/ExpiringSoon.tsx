import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  expirationDate: string; // Format: YYYY-MM-DD
  quantity: number;
  price?: number;
  image?: string;
}

const BakeryPOS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Pandesal", expirationDate: '2023-10-15', quantity: 10, price: 5 },
    { id: 2, name: "Star Bread", expirationDate: '2023-10-20', quantity: 5, price: 10 },
    { id: 3, name: "Pan De Coco", expirationDate: '2023-10-10', quantity: 20, price: 15 },
    { id: 4, name: "Donut", expirationDate: '2023-10-12', quantity: 15, price: 10 },
    { id: 5, name: "Shakoy", expirationDate: '2023-10-18', quantity: 8, price: 5 },
    { id: 6, name: "Monay", expirationDate: '2023-10-14', quantity: 12, price: 10 },
    { id: 7, name: "Hopia", expirationDate: '2023-10-16', quantity: 7, price: 5 },
    { id: 8, name: "Spanish Bread", expirationDate: '2023-10-19', quantity: 9, price: 15 },
    { id: 9, name: "Ensaymada", expirationDate: '2023-10-21', quantity: 6, price: 10 },
    { id: 10, name: "Cupcake", expirationDate: '2023-10-17', quantity: 4, price: 15 },
    { id: 11, name: "Crinkles", expirationDate: '2023-10-13', quantity: 18, price: 5 },
    { id: 12, name: "Mamon", expirationDate: '2023-10-22', quantity: 3, price: 15 },
    { id: 13, name: "Red Velvet", expirationDate: '2023-10-25', quantity: 2, price: 350 },
    { id: 14, name: "Raspberry Cake", expirationDate: '2023-10-23', quantity: 1, price: 500 },
    { id: 15, name: "Oreo Cake", expirationDate: '2023-10-24', quantity: 1, price: 450 },
    { id: 16, name: "White Forest Cake", expirationDate: '2023-10-26', quantity: 1, price: 500 },
    { id: 17, name: "Green Velvet Cake", expirationDate: '2023-10-27', quantity: 1, price: 550 },
    { id: 18, name: "Cookies and Cream Cake", expirationDate: '2023-10-28', quantity: 1, price: 450 },
    { id: 19, name: "Ube Cake", expirationDate: '2023-10-29', quantity: 1, price: 500 },
    { id: 20, name: "Black Forest Cake", expirationDate: '2023-10-30', quantity: 1, price: 550 },
    { id: 21, name: "Chocolate Mousse Cake", expirationDate: '2023-10-31', quantity: 1, price: 650 },
    { id: 22, name: "Purple Yam", expirationDate: '2023-11-01', quantity: 1, price: 600 }
  ]);

  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    const expiring = products.filter(product => {
      const expiration = new Date(product.expirationDate);
      return expiration >= today && expiration <= oneWeekFromNow;
    });

    setExpiringProducts(expiring);
  }, [products]);

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '300px',
      borderRadius: '10px',
      textAlign: 'center',
      position: 'relative'
    }}>
      <button
        style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
          color: 'black',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'red')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'black')}
        onClick={handleClose}
      >
        ✕
      </button>
      <h1>Bakery POS System</h1>

      <h2>All Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - Quantity: {product.quantity}
          </li>
        ))}
      </ul>

      <h2>Expiring Products (Next 7 Days)</h2>
      <ul style={{ fontSize: 'x-large' }}>
        {expiringProducts.map(product => (
          <li key={product.id}>
            {product.name} - Quantity: {product.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BakeryPOS;