import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorForm.css';

const SensorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL (se for edição)
  
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true); // Novo estado para controlar carregamento
  
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
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Carrega lista de ambientes
        const responseAmb = await api.get('/ambientes/');
        setAmbientes(responseAmb.data);

        // 2. Se for EDIÇÃO (tem ID), carrega dados do sensor
        if (id) {
          try {
            const responseSensor = await api.get(`/sensores/${id}/`);
            const sensorData = responseSensor.data;
            
            // Preenche o formulário com os dados que vieram do banco
            setFormData({
              sensor: sensorData.sensor || 'Temperatura',
              mac_address: sensorData.mac_address || '',
              latitude: sensorData.latitude || '',
              longitude: sensorData.longitude || '',
              ambiente: sensorData.ambiente || '', 
              unidade_med: sensorData.unidade_med || '',
              status: sensorData.status !== undefined ? sensorData.status : true
            });
          } catch (err) {
            console.error("Erro ao buscar sensor específico", err);
            alert("Erro ao carregar dados do sensor para edição.");
            navigate('/sensores/temperatura'); // Volta se der erro
          }
        } else {
          // 3. Se for CADASTRO (novo), seleciona o primeiro ambiente da lista
          if (responseAmb.data.length > 0) {
            setFormData(prev => ({ ...prev, ambiente: responseAmb.data[0].id }));
          }
        }
      } catch (error) {
        console.error("Erro geral ao carregar formulário", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/sensores/${id}/`, formData);
        alert('Sensor atualizado com sucesso!');
      } else {
        await api.post('/sensores/', formData);
        alert('Sensor cadastrado com sucesso!');
      }
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert('Erro ao salvar sensor. Verifique os dados.');
    }
  };

  if (loading) {
    return (
      <div className="form-page-container">
        <Navbar />
        <p style={{textAlign: 'center', color: 'white', marginTop: '50px'}}>
          Carregando formulário...
        </p>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <Navbar />
      
      <div className="form-container">
        <h2 className="form-title">
          {id ? 'Editar Sensor' : 'Cadastro de Sensor'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Tipo de Sensor */}
          <div className="form-group">
            <label>Tipo de Sensor</label>
            <select name="sensor" value={formData.sensor} onChange={handleChange}>
              <option value="Temperatura">Temperatura</option>
              <option value="Umidade">Umidade</option>
              <option value="Luminosidade">Luminosidade</option>
              <option value="Contador">Contador</option>
            </select>
          </div>

          {/* MAC Address */}
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

          {/* Ambiente */}
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

          {/* Latitude e Longitude */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Latitude</label>
              <input 
                name="latitude" 
                type="number" 
                step="any" 
                value={formData.latitude} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Longitude</label>
              <input 
                name="longitude" 
                type="number" 
                step="any" 
                value={formData.longitude} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button type="submit" className="btn-save">
            {id ? 'SALVAR ALTERAÇÕES' : 'CRIAR SENSOR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SensorForm;