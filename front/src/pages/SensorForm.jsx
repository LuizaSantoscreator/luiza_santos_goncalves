import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorForm.css';

const SensorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    sensor: 'Temperatura',
    mac_address: '',
    latitude: 0,  // Valor padrão fixo (obrigatório no back)
    longitude: 0, // Valor padrão fixo
    ambiente: '',
    unidade_med: '',
    status: true
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const responseAmb = await api.get('/ambientes/');
        setAmbientes(responseAmb.data);

        if (id) {
          const responseSensor = await api.get(`/sensores/${id}/`);
          const sensorData = responseSensor.data;
          
          if (sensorData) {
            setFormData({
              sensor: sensorData.sensor || 'Temperatura',
              mac_address: sensorData.mac_address || '',
              latitude: sensorData.latitude || 0,
              longitude: sensorData.longitude || 0,
              ambiente: sensorData.ambiente || '', 
              unidade_med: sensorData.unidade_med || '',
              status: sensorData.status !== undefined ? sensorData.status : true
            });
          } else {
            alert("Sensor não encontrado.");
            navigate('/');
          }
        } else {
          if (responseAmb.data && responseAmb.data.length > 0) {
            setFormData(prev => ({ ...prev, ambiente: responseAmb.data[0].id }));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar formulário", error);
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
      alert('Erro ao salvar sensor.');
    }
  };

  if (loading) {
    return (
      <div className="form-page-container">
        <Navbar />
        <p style={{textAlign: 'center', color: 'white', marginTop: '50px'}}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <Navbar />
      <div className="form-container">
        <h2 className="form-title">{id ? 'Editar Sensor' : 'Cadastro de Sensor'}</h2>
        
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

          <button type="submit" className="btn-save">
            {id ? 'SALVAR ALTERAÇÕES' : 'CRIAR SENSOR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SensorForm;