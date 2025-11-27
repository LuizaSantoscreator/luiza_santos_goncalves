import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CustomInput from '../components/CustomInput';
import '../styles/pages/Login.css'; // Importação direta

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/token/', {
        username: username,
        password: password
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      navigate('/'); 
      
    } catch (err) {
      console.error(err);
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="form-wrapper">
        <h2 className="login-title">Smart City Login</h2>
        
        {error && <p className="error-message">{error}</p>}

        <CustomInput 
          label="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite seu usuário"
        />
        
        <CustomInput 
          label="Senha" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
        />

        <button type="submit" className="login-button">
          ENTRAR
        </button>
      </form>
    </div>
  );
};

export default Login;