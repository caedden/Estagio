import React, { useState } from 'react';

export default function OrderReport() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReport = async () => {
        if (!startDate || !endDate) {
            setError('Por favor, insira as datas de início e fim.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/pedidos/tipoPagamento&data?startDate=${startDate}&endDate=${endDate}`);
            
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

    return (
        <div>
            <h1>Relatório de Pedidos por Tipo de Pagamento</h1>
            
            <div>
                <label>Data de Início: </label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                />
            </div>

            <div>
                <label>Data de Fim: </label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                />
            </div>

            <button onClick={fetchReport}>Gerar Relatório</button>

            {loading && <div>Carregando relatório...</div>}

            {error && <div style={{ color: 'red' }}>Erro: {error}</div>}

            {report && Object.keys(report).length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de Pagamento</th>
                            <th>Total de Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item) => (
                            <tr key={item.paymenttype}>
                                <td>{item.paymenttype}</td>
                                <td>{item.total_orders}</td>
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
