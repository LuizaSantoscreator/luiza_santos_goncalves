import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/pages/Ambientes.css';

const Ambientes = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmbientes() {
      try {
        setLoading(true);
        const response = await api.get('/ambientes/');
        setAmbientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar ambientes", error);
        alert("Erro ao carregar lista de ambientes.");
      } finally {
        setLoading(false);
      }
    }
    fetchAmbientes();
  }, []);

  return (
    <div className="ambientes-container">
      <Navbar />
      
      <main className="content-wrap">
        <h1 className="page-title">Gerenciamento de Ambientes</h1>

        {loading ? (
          <p style={{textAlign: 'center'}}>Carregando...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Local</th>
                <th>Descrição (Sala)</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {ambientes.map((ambiente) => (
                <tr key={ambiente.id}>
                  <td>{ambiente.id}</td>
                  {/* O Backend manda o ID ou Objeto, dependendo do Serializer. 
                      Se aparecer [Object object], avise que ajustamos. */}
                  <td>{typeof ambiente.local === 'object' ? ambiente.local.nome : ambiente.local}</td>
                  <td>{ambiente.descricao}</td>
                  <td>{typeof ambiente.responsavel === 'object' ? ambiente.responsavel.nome : ambiente.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Ambientes;