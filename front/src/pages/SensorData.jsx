import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorData.css';

const SensorData = () => {
  const { tipo } = useParams();
  const navigate = useNavigate();
  
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados
  const fetchSensores = async () => {
    try {
      setLoading(true);
      const tipoFormatado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
      const response = await api.get(`/sensores/?tipo=${tipoFormatado}`);
      setSensores(response.data);
    } catch (error) {
      console.error("Erro ao buscar sensores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensores();
  }, [tipo]);

  // Função de Excluir (DELETE)
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Impede que abra o histórico ao clicar no botão
    if (window.confirm("Tem certeza que deseja excluir este sensor?")) {
      try {
        await api.delete(`/sensores/${id}/`);
        alert("Sensor excluído com sucesso!");
        fetchSensores(); // Recarrega a lista
      } catch (error) {
        alert("Erro ao excluir. Verifique se existem medições atreladas.");
      }
    }
  };

  // Função de Editar (Navega para o form com ID)
  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/editar-sensor/${id}`);
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <main className="content-wrap">
        <div className="headerTitle">
          <h1>Sensores de {tipo}</h1>
          <button 
            onClick={() => navigate('/cadastrar-sensor')} 
            className="btn-add"
          >
            + Novo Sensor
          </button>
        </div>

        {loading ? (
          <p className="loading">Carregando dados...</p>
        ) : (
          <div className="tableWrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ambiente</th>
                  <th>MAC Address</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Status</th>
                  <th>Ações</th> {/* Nova Coluna */}
                </tr>
              </thead>
              <tbody>
                {sensores.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center'}}>
                      Nenhum sensor deste tipo encontrado.
                    </td>
                  </tr>
                ) : (
                  sensores.map((sensor) => (
                    <tr 
                      key={sensor.id} 
                      onClick={() => navigate(`/history/${sensor.id}`)}
                      title="Clique para ver o histórico"
                    >
                      <td>{sensor.id}</td>
                      <td>{sensor.ambiente}</td>
                      <td>{sensor.mac_address}</td>
                      <td>{sensor.latitude}</td>
                      <td>{sensor.longitude}</td>
                      <td className={sensor.status ? "status-active" : "status-inactive"}>
                        {sensor.status ? 'Ativo' : 'Inativo'}
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="btn-edit" 
                          onClick={(e) => handleEdit(sensor.id, e)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={(e) => handleDelete(sensor.id, e)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SensorData;