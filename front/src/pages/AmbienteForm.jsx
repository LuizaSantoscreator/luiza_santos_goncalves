import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorForm.css';

const AmbienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [locais, setLocais] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    descricao: '',
    local: '',       // ID do Local
    responsavel: ''  // ID do Responsável
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Carrega Locais e Responsáveis para os Selects
        const [resLocais, resResponsaveis] = await Promise.all([
            api.get('/locais/'),
            api.get('/responsaveis/')
        ]);
        
        setLocais(resLocais.data);
        setResponsaveis(resResponsaveis.data);

        // 2. Se for edição, carrega dados do Ambiente
        if (id) {
            const responseAmb = await api.get(`/ambientes/${id}/`);
            const amb = responseAmb.data;
            setFormData({
                descricao: amb.descricao,
                local: amb.local, // O backend deve mandar o ID aqui
                responsavel: amb.responsavel
            });
        } else {
            // Valores padrão para cadastro novo
            if (resLocais.data.length > 0) setFormData(prev => ({...prev, local: resLocais.data[0].id}));
            if (resResponsaveis.data.length > 0) setFormData(prev => ({...prev, responsavel: resResponsaveis.data[0].id}));
        }

      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/ambientes/${id}/`, formData);
        alert('Ambiente atualizado!');
      } else {
        await api.post('/ambientes/', formData);
        alert('Ambiente criado!');
      }
      navigate('/ambientes');
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert('Erro ao salvar ambiente.');
    }
  };

  if (loading) return <div className="form-page-container"><Navbar /><p style={{textAlign:'center', color:'white', marginTop:'50px'}}>Carregando...</p></div>;

  return (
    <div className="form-page-container">
      <Navbar />
      <div className="form-container">
        <h2 className="form-title">{id ? 'Editar Ambiente' : 'Novo Ambiente'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Descrição (Nome da Sala)</label>
            <input 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange} 
              placeholder="Ex: Laboratório de Informática 2"
              required 
            />
          </div>

          <div className="form-group">
            <label>Localização (Bloco/Prédio)</label>
            <select name="local" value={formData.local} onChange={handleChange}>
              {locais.map(local => (
                <option key={local.id} value={local.id}>{local.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Responsável</label>
            <select name="responsavel" value={formData.responsavel} onChange={handleChange}>
              {responsaveis.map(resp => (
                <option key={resp.id} value={resp.id}>{resp.nome}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-save">SALVAR AMBIENTE</button>
        </form>
      </div>
    </div>
  );
};

export default AmbienteForm;
