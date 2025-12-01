import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/pages/Home.css';

// --- IMPORTANTE: Importe suas imagens aqui ---
// Certifique-se que os arquivos existem em src/assets/
import tempIcon from '../assets/icons8-temperatura-48.png'; // Troque pelo nome real do seu arquivo
import umidIcon from '../assets/icons8-moisture-50.png';
import luzIcon from '../assets/icons8-sol-50.png';
import contIcon from '../assets/icons8-contador-50.png';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      label: 'Temperatura', 
      // Aqui usamos a tag <img> em vez do emoji
      icon: <img src={tempIcon} alt="Temperatura" className="icon-img" />, 
      path: '/sensores/temperatura' 
    },
    { 
      label: 'Umidade', 
      icon: <img src={umidIcon} alt="Umidade" className="icon-img" />, 
      path: '/sensores/umidade' 
    },
    { 
      label: 'Luminosidade', 
      icon: <img src={luzIcon} alt="Luminosidade" className="icon-img" />, 
      path: '/sensores/luminosidade' 
    },
    { 
      label: 'Contador', 
      icon: <img src={contIcon} alt="Contador" className="icon-img" />, 
      path: '/sensores/contador' 
    },
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
              {/* A classe card-icon agora envolve a imagem */}
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