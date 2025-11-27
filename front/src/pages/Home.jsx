import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/pages/Home.css'; // Importação direta

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Temperatura', icon: '🌡️', path: '/sensores/temperatura' },
    { label: 'Umidade', icon: '💧', path: '/sensores/umidade' },
    { label: 'Luminosidade', icon: '☀️', path: '/sensores/luminosidade' },
    { label: 'Contador', icon: '🔄', path: '/sensores/contador' },
  ];

  return (
    <div className="home-container">
      <Navbar />
      
      <main className="home-content">
        <h1 className="home-title">Painel de Monitoramento</h1>
        
        <div className="home-grid">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="home-card"
              onClick={() => navigate(item.path)}
            >
              <span className="card-icon">{item.icon}</span>
              <span className="card-title">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;