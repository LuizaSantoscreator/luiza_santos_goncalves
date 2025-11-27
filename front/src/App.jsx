import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import SensorData from './pages/SensorData';
import SensorHistory from './pages/SensorHistory';
import Ambientes from './pages/Ambientes';
import SensorForm from './pages/SensorForm'; // <--- Precisa criar esse arquivo (veja abaixo)

// Componente para proteger rotas (só entra se tiver token)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* --- Rotas Privadas (Só com Login) --- */}
        
        {/* Dashboard (Home) */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        {/* Lista de Sensores por Tipo (ex: /sensores/temperatura) */}
        <Route 
          path="/sensores/:tipo" 
          element={
            <PrivateRoute>
              <SensorData />
            </PrivateRoute>
          } 
        />

        {/* Histórico e Gráfico (ex: /history/1) */}
        <Route 
          path="/history/:id" 
          element={
            <PrivateRoute>
              <SensorHistory />
            </PrivateRoute>
          } 
        />

        {/* Lista de Ambientes */}
        <Route 
          path="/ambientes" 
          element={
            <PrivateRoute>
              <Ambientes />
            </PrivateRoute>
          } 
        />

        {/* Formulário de Cadastro de Sensor */}
        <Route 
          path="/cadastrar-sensor" 
          element={
            <PrivateRoute>
              <SensorForm />
            </PrivateRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;