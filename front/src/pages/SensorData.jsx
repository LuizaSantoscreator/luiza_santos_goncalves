import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <--- ADICIONADO useNavigate
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorData.css';

const SensorData = () => {
  const { tipo } = useParams();
  const navigate = useNavigate(); // <--- Inicializa o hook de navegação
  
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSensores() {
      try {
        setLoading(true);
        // Formata a primeira letra para maiúscula (ex: temperatura -> Temperatura)
        // Isso é necessário porque o Backend salva como "Temperatura" no banco
        const tipoFormatado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        
        // Busca na API filtrando pelo tipo
        const response = await api.get(`/sensores/?tipo=${tipoFormatado}`);
        setSensores(response.data);
      } catch (error) {
        console.error("Erro ao buscar sensores", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSensores();
  }, [tipo]);

  return (
    <div className="container">
      <Navbar />
      
      <main className="content">
        <div className="headerTitle">
          <h1>Sensores de {tipo}</h1>
        </div>

        {loading ? (
          <p className="loading">Carregando dados...</p>
        ) : (
          <div className="tableWrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ambiente</th>
                  <th>MAC Address</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sensores.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>
                      Nenhum sensor deste tipo encontrado.
                    </td>
                  </tr>
                ) : (
                  sensores.map((sensor) => (
                    <tr 
                      key={sensor.id} 
                      onClick={() => navigate(`/history/${sensor.id}`)} // <--- AÇÃO DE CLIQUE
                      style={{ cursor: 'pointer' }} // <--- Mãozinha ao passar o mouse
                      title="Clique para ver o histórico"
                    >
                      <td>{sensor.id}</td>
                      <td>{sensor.ambiente}</td>
                      <td>{sensor.mac_address}</td>
                      <td>{sensor.latitude}</td>
                      <td>{sensor.longitude}</td>
                      <td className={sensor.status ? "statusOn" : "statusOff"}>
                        {sensor.status ? 'Ativo' : 'Inativo'}
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