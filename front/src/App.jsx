import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import SensorData from './pages/SensorData';
import SensorHistory from './pages/SensorHistory';
import Ambientes from './pages/Ambientes';
import SensorForm from './pages/SensorForm'; // Usado para cadastrar e editar
import AmbienteForm from './pages/AmbienteForm';

// Componente para proteger rotas (só entra se tiver token)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Rota Pública --- */}
        <Route path="/login" element={<Login />} />
        
        {/* --- Rotas Privadas (Só com Login) --- */}
        
        {/* 1. Dashboard (Home) */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        {/* 2. Lista de Sensores por Tipo (ex: /sensores/temperatura) */}
        <Route 
          path="/sensores/:tipo" 
          element={
            <PrivateRoute>
              <SensorData />
            </PrivateRoute>
          } 
        />

        {/* 3. Histórico e Gráfico (ex: /history/1) */}
        <Route 
          path="/history/:id" 
          element={
            <PrivateRoute>
              <SensorHistory />
            </PrivateRoute>
          } 
        />

        {/* 4. Lista de Ambientes */}
        <Route 
          path="/ambientes" 
          element={
            <PrivateRoute>
              <Ambientes />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/ambientes" 
          element={<PrivateRoute>
            <Ambientes />
            </PrivateRoute>} 
        />
        <Route 
          path="/cadastrar-ambiente" 
          element={<PrivateRoute>
            <AmbienteForm />
            </PrivateRoute>} 
        />
        <Route 
          path="/editar-ambiente/:id" 
          element={<PrivateRoute>
            <AmbienteForm />
            </PrivateRoute>} 
        />

        {/* 5. Cadastro de Novo Sensor */}
        <Route 
          path="/cadastrar-sensor" 
          element={
            <PrivateRoute>
              <SensorForm />
            </PrivateRoute>
          } 
        />

        {/* 6. Edição de Sensor */}
        {/* O :id permite que a página saiba qual sensor carregar para edição */}
        <Route 
          path="/editar-sensor/:id" 
          element={
            <PrivateRoute>
              <SensorForm />
            </PrivateRoute>
          } 
        />

        {/* Rota de Mapa removida conforme solicitado */}

      </Routes>
    </Router>
  );
}

export default App;