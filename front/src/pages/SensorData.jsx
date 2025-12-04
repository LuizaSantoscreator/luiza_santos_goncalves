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

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este sensor?")) {
      try {
        await api.delete(`/sensores/${id}/`);
        alert("Sensor excluído com sucesso!");
        fetchSensores();
      } catch (error) {
        alert("Erro ao excluir. Verifique se existem medições atreladas.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/editar-sensor/${id}`);
  };

  const handleHistory = (id) => {
    navigate(`/history/${id}`);
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
             Novo Sensor
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
                  <th>Histórico</th> {/* NOVA COLUNA */}
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {sensores.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{textAlign: 'center'}}>
                      Nenhum sensor deste tipo encontrado.
                    </td>
                  </tr>
                ) : (
                  sensores.map((sensor) => (
                    <tr key={sensor.id}>
                      <td>{sensor.id}</td>
                      <td>{sensor.ambiente}</td>
                      <td>{sensor.mac_address}</td>
                      <td>{sensor.latitude}</td>
                      <td>{sensor.longitude}</td>
                      <td className={sensor.status ? "status-active" : "status-inactive"}>
                        {sensor.status ? 'Ativo' : 'Inativo'}
                      </td>

                      {/* BOTÃO DE HISTÓRICO */}
                      <td>
                        <button 
                          className="btn-history"
                          onClick={() => handleHistory(sensor.id)}
                        >
                          Ver Histórico
                        </button>
                      </td>

                      {/* EDITAR / EXCLUIR */}
                      <td className="actions-cell">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(sensor.id)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(sensor.id)}
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
