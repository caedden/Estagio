import React, { useEffect, useState } from 'react';

export default function OrderReport() {
    // Estado para armazenar o relatório de pedidos
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar o relatório do backend
    const fetchReport = async () => {
        try {
            // Requisição para o novo endpoint da API
            const response = await fetch('http://localhost:3000/api/pedidos/tipoPagamento');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar relatório');
            }

            const data = await response.json();

            if (data.paymentReport) {
                setReport(data.paymentReport);
            } else {
                setError('Nenhum relatório encontrado.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // UseEffect para carregar o relatório ao montar o componente
    useEffect(() => {
        fetchReport();
    }, []);

    // Exibição enquanto o relatório está sendo carregado
    if (loading) {
        return <div>Carregando relatório...</div>;
    }

    // Exibição de erro, caso haja algum
    if (error) {
        return <div>Erro: {error}</div>;
    }

    // Exibição do relatório, caso haja dados
    return (
        <div>
            <h1>Relatório de Pedidos por Tipo de Pagamento</h1>
            {report && Object.keys(report).length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de Pagamento</th>
                            <th>Total de Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(report).map((paymentType) => (
                            <tr key={paymentType}>
                                <td>{paymentType}</td>
                                <td>{report[paymentType]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum pedido encontrado.</p>
            )}
        </div>
    );
}
