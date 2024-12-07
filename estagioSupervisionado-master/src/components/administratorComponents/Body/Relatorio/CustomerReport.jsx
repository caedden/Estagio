import React, { useEffect, useState } from 'react';
import './CustomerReports/customerReport.css';
import { jsPDF } from "jspdf";

export default function ClientReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ name: '', document: '', phone: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  // Função para realizar a busca
  const fetchReport = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page,
        sortBy,
        order,
      });

      const response = await fetch(`http://localhost:3000/api/clientes?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setReport(data.data);
        setTotalPages(data.totalPages);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(); // Carrega os dados pela primeira vez
  }, [page, sortBy, order]);

  // Função para lidar com mudanças nos campos de filtro
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Função que será chamada quando o botão de busca for clicado
  const handleSearchClick = () => {
    setPage(1); // Resetar para a primeira página ao realizar a pesquisa
    fetchReport(); // Chama a função de busca quando o botão é clicado
  };

  const handleSortChange = (field) => {
    setSortBy(field);
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
  };

  // Função para gerar o PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório de Clientes", 20, 20);

    let yOffset = 30;
    doc.setFontSize(12);
    doc.text("Nome", 20, yOffset);
    doc.text("Documento", 80, yOffset);
    doc.text("Telefone", 160, yOffset);
    
    yOffset += 10;

    // Adiciona os dados dos clientes no PDF
    report.forEach(client => {
      doc.text(client.name, 20, yOffset);
      doc.text(client.document, 80, yOffset);
      doc.text(client.phone, 160, yOffset);
      yOffset += 10;
    });

    doc.save('relatorio-clientes.pdf');
  };

  if (loading) {
    return <div>Carregando relatório...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Erro: {error}</div>;
  }

  return (
    <div>
      <h1>Relatório de Clientes</h1>

      {/* Filtros */}
      <div>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Filtrar por nome"
        />
        <input
          type="text"
          name="document"
          value={filters.document}
          onChange={handleFilterChange}
          placeholder="Filtrar por documento"
        />
        <input
          type="text"
          name="phone"
          value={filters.phone}
          onChange={handleFilterChange}
          placeholder="Filtrar por telefone"
        />
        <button onClick={handleSearchClick}>Buscar</button> {/* Botão de busca */}
      </div>

      {/* Tabela de dados */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSortChange('name')}>Nome</th>
              <th onClick={() => handleSortChange('document')}>Documento</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {report.length === 0 ? ( // Verifica se não há registros
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              report.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.document}</td>
                  <td>{client.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botão para gerar o PDF */}
      <div>
        <button onClick={generatePDF}>Gerar PDF</button>
      </div>

      {/* Paginação */}
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>{`Página ${page} de ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
