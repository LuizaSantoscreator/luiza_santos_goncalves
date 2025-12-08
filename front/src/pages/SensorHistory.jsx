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

  
  const handleExport = async () => {
    try {
      // Importante: responseType 'blob' para arquivos binários (Excel/PDF)
      const response = await api.get(`/medicoes/exportar/?sensor=${id}`, {
        responseType: 'blob',
      });

      // Cria um link temporário para forçar o download no navegador
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historico_sensor_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao exportar", error);
      alert("Erro ao baixar o arquivo Excel.");
    }
  };
  // --------------------------------

  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dados = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{dados.dataFormatada}</p>
          <p className="tooltip-value">Valor: {dados.valor}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="history-container">
      <Navbar />
      
      <main className="history-content">
        <div className="header-flex">
          <h1 className="history-title">Histórico do Sensor #{id}</h1>
          
          {/* BOTÃO DE EXPORTAR */}
          <button onClick={handleExport} className="btn-export">
            Baixar Excel
          </button>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', color: '#fff'}}>Carregando gráfico...</p>
        ) : (
          <>
            <div className="chart-wrapper">
              <h3 className="chart-title">Variação no Tempo</h3>
              
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={medicoes}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="id" hide />
                  <YAxis stroke="var(--chart-text)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="var(--chart-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorValor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <h3 className="table-title">Registros Detalhados</h3>
            
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
          </>
        )}
      </main>
    </div>
  );
};

export default SensorHistory;
