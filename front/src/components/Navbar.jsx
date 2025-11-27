import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css'; // <--- CORREÇÃO: Importação direta (sem 'styles from')

const Navbar = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    };
  
    return (
      <header className="header">
        {/* Clique no Logo volta para Home */}
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          Smart City
        </div>
  
        <nav className="nav-links">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/ambientes" className="nav-item">Ambientes</Link>
          <Link to="/cadastrar-sensor" className="nav-item">Novo Sensor</Link>
        </nav>
  
        <button onClick={handleLogout} className="logoutBtn">
          Sair
        </button>
      </header>
    );
  };
  
  export default Navbar;