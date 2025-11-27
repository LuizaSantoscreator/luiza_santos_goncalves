import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/SensorHistory.css';

const SensorHistory = () => {
  const { id } = useParams();
  const [medicoes, setMedicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        setLoading(true);
        const response = await api.get(`/medicoes/?sensor=${id}`);
        
        const dadosFormatados = response.data.map(item => ({
          ...item,
          dataFormatada: new Date(item.timestamp).toLocaleString('pt-BR')
        })).reverse();

        setMedicoes(dadosFormatados);
      } catch (error) {
        console.error("Erro ao carregar histórico", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistorico();
  }, [id]);

  // Ignorando aviso do ESLint corretamente
  // eslint-disable-next-line react/prop-types 
  const CustomTooltip = ({ active, payload, label }) => {//ignorar
    if (active && payload && payload.length) {
      const dados = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{ fontWeight: 'bold' }}>{dados.dataFormatada}</p>
          <p style={{ color: '#0056b3' }}>Valor: {dados.valor}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="history-container">
      <Navbar />
      
      <main className="history-content">
        <h1 className="history-title">Histórico do Sensor #{id}</h1>

        {loading ? (
          <p style={{textAlign: 'center'}}>Carregando gráfico...</p>
        ) : (
          <div className="chart-wrapper">
            <h3 style={{marginBottom: '20px', color: '#666'}}>Variação no Tempo</h3>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={medicoes}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0056b3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0056b3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" hide />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#0056b3" 
                  fillOpacity={1} 
                  fill="url(#colorValor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <h3 style={{marginBottom: '10px', color: '#666', marginTop: '30px'}}>Registros Detalhados</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>ID Leitura</th>
              <th>Data/Hora</th>
              <th>Valor Lido</th>
            </tr>
          </thead>
          <tbody>
            {[...medicoes].reverse().map((medicao) => (
              <tr key={medicao.id}>
                <td>{medicao.id}</td>
                <td>{medicao.dataFormatada}</td>
                <td>{medicao.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SensorHistory;
