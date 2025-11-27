import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SensorData from './pages/SensorData';
import SensorHistory from './pages/SensorHistory'; // <--- IMPORTANTE: Importe a nova página aqui

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
        
        {/* Rotas Privadas */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/sensores/:tipo" 
          element={
            <PrivateRoute>
              <SensorData />
            </PrivateRoute>
          } 
        />

        {/* --- NOVA ROTA ADICIONADA: Histórico --- */}
        <Route 
          path="/history/:id" 
          element={
            <PrivateRoute>
              <SensorHistory />
            </PrivateRoute>
          } 
        />

        {/* Rota de Cadastro (que faremos a seguir) */}
        {/* <Route 
          path="/cadastrar-sensor" 
          element={
            <PrivateRoute>
              <SensorForm />
            </PrivateRoute>
          } 
        /> 
        */}

      </Routes>
    </Router>
  );
}

export default App;