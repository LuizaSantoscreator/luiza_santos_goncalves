import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Link } from "react-router-dom";
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
      } finally {
        setLoading(false);
      }
    }

    fetchAmbientes();
  }, []);

  return (
    // CLASSE CORRETA: ambientes-container
    <div className="ambientes-container">
      <Navbar />
      
      <main className="content-wrap">
        <h1 className="page-title">Gerenciamento de Ambientes</h1>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/cadastrar-ambiente" className="btn-add">
            + Novo Ambiente
          </Link>
        </div>

        {loading ? (
          <p style={{textAlign: 'center'}}>Carregando...</p>
        ) : (
          // CLASSE CORRETA: ambientes-table
          <table className="ambientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Descrição (Sala)</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {ambientes.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center'}}>Nenhum ambiente cadastrado.</td>
                </tr>
              ) : (
                ambientes.map((ambiente) => (
                  <tr key={ambiente.id}>
                    <td>{ambiente.id}</td>
                    <td>{typeof ambiente.local === 'object' ? ambiente.local.nome : ambiente.local}</td> 
                    <td>{ambiente.descricao}</td>
                    <td>{typeof ambiente.responsavel === 'object' ? ambiente.responsavel.nome : ambiente.responsavel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Ambientes;