import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/Home.css';

// --- Importação dos Ícones ---
import tempIcon from '../assets/icons8-temperatura-48.png';
import umidIcon from '../assets/icons8-moisture-50.png';
import luzIcon from '../assets/icons8-sol-50.png';
import contIcon from '../assets/icons8-contador-50.png';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      label: 'Temperatura', 
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
        
        <div className="info-card">
          <h2>Bem-vindo ao Sistema Smart City</h2>
          <p>
            Uma cidade inteligente de verdade começa cuidando do seu ambiente. 
            Nossa plataforma traduz os dados dos sensores em ações práticas, ajudando a escola 
            a usar melhor seus recursos e criando um espaço muito mais saudável para todos.
          </p>
          <p>
            Acompanhe abaixo os indicadores em tempo real para tomar decisões baseadas em dados.
          </p>
        </div>
        
        <div className="home-grid">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="home-card"
              onClick={() => navigate(item.path)}
            >
              {/* Trocado de span para div */}
              <div className="card-icon">{item.icon}</div>
              <div className="card-title">{item.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;