import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Componente simples para a Home (faremos a real depois)
const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo ao Sistema Smart City</h1>
      <button onClick={handleLogout} style={{ padding: '10px', background: 'red', color: 'white' }}>
        Sair
      </button>
    </div>
  );
};

// Proteção de Rotas: Só deixa entrar se tiver token 
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rota Protegida: Home */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;