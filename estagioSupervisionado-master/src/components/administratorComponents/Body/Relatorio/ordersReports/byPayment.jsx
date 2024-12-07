import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

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

    // Função para gerar o PDF com os dados detalhados por cliente
    const generatePDF = () => {
        if (!report || Object.keys(report).length === 0) {
            alert('Não há dados para gerar o PDF');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Relatório de Pedidos Detalhado por Cliente', 20, 20);

        let yOffset = 30;

        // Adicionando os cabeçalhos da tabela
        doc.setFontSize(12);
        doc.text('Cliente', 20, yOffset);
        doc.text('Pedido ID', 80, yOffset);
        doc.text('Tipo de Pagamento', 140, yOffset);
        doc.text('Valor Total', 200, yOffset);

        yOffset += 10;

        // Iterando sobre os clientes e os pedidos
        Object.keys(report).forEach(clientName => {
            const clientOrders = report[clientName];

            doc.setFontSize(12);
            doc.text(clientName, 20, yOffset); // Nome do cliente
            yOffset += 10;

            clientOrders.forEach(order => {
                // Detalhes do pedido
                doc.text(order.orderId.toString(), 80, yOffset);
                doc.text(order.paymentType, 140, yOffset);
                doc.text(order.totalValue.toFixed(2), 200, yOffset);
                yOffset += 10;
            });

            // Adicionando espaçamento entre clientes
            yOffset += 10;
        });

        doc.save('relatorio-pedidos-detalhado.pdf');
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
            <h1>Relatório de Pedidos Detalhado por Cliente</h1>
            {report && Object.keys(report).length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Pedido ID</th>
                                <th>Tipo de Pagamento</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(report).map((clientName) => {
                                const clientOrders = report[clientName];
                                return clientOrders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>{clientName}</td>
                                        <td>{order.orderId}</td>
                                        <td>{order.paymentType}</td>
                                        <td>{order.totalValue}</td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                    <button onClick={generatePDF}>Gerar PDF</button>
                </div>
            ) : (
                <p>Nenhum pedido encontrado.</p>
            )}
        </div>
    );
}
