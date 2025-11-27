import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorForm.css'; // Vamos criar o CSS abaixo

const SensorForm = () => {
  const navigate = useNavigate();
  const [ambientes, setAmbientes] = useState([]);
  
  const [formData, setFormData] = useState({
    sensor: 'Temperatura',
    mac_address: '',
    latitude: '',
    longitude: '',
    ambiente: '',
    unidade_med: '',
    status: true
  });

  useEffect(() => {
    async function loadAmbientes() {
      try {
        const response = await api.get('/ambientes/');
        setAmbientes(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, ambiente: response.data[0].id }));
        }
      } catch (error) {
        console.error("Erro ao carregar ambientes", error);
      }
    }
    loadAmbientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sensores/', formData);
      alert('Sensor cadastrado com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert('Erro ao salvar sensor. Verifique os dados.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f9' }}>
      <Navbar />
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0056b3' }}>
          Novo Sensor
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Sensor</label>
            <select name="sensor" value={formData.sensor} onChange={handleChange}>
              <option value="Temperatura">Temperatura</option>
              <option value="Umidade">Umidade</option>
              <option value="Luminosidade">Luminosidade</option>
              <option value="Contador">Contador</option>
            </select>
          </div>

          <div className="form-group">
            <label>MAC Address</label>
            <input 
              name="mac_address" 
              value={formData.mac_address} 
              onChange={handleChange} 
              placeholder="Ex: 00:1B:44:11:3A:B7"
              required 
            />
          </div>

          <div className="form-group">
            <label>Ambiente</label>
            <select name="ambiente" value={formData.ambiente} onChange={handleChange}>
              {ambientes.map(amb => (
                <option key={amb.id} value={amb.id}>
                  {amb.descricao} - {typeof amb.local === 'object' ? amb.local.nome : amb.local}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Latitude</label>
              <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Longitude</label>
              <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-save">SALVAR SENSOR</button>
        </form>
      </div>
    </div>
  );
};

export default SensorForm;