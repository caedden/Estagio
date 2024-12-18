import React, { useEffect, useState } from 'react';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState({});

    useEffect(() => {
        // Fazendo requisição HTTP para buscar os pedidos cadastrados
        fetch('http://localhost:3000/api/pedidos')
            .then(response => response.json())
            .then(data => {
                setOrders(data);
            })
            .catch(error => {
                console.error('Erro ao buscar pedidos:', error);
            });
    }, []);

    const handleStatusSelect = (orderId, newStatus) => {
        setSelectedStatuses(prevStatuses => ({
            ...prevStatuses,
            [orderId]: newStatus,
        }));
    };

    const handleStatusChange = (orderId) => {
        const newStatus = selectedStatuses[orderId];
        if (!newStatus) return;

        // Verificar se o pedido já está cancelado
        const order = orders.find(o => o.orderid === orderId);
        if (order && order.status === 'cancelado') {
            alert('O pedido já está cancelado e não pode sofrer alterações de status.');
            return;
        }

        fetch(`http://localhost:3000/api/pedido/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        })
            .then(response => response.json())
            .then(updatedOrder => {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.orderid === orderId ? { ...order, status: newStatus } : order
                    )
                );
            })
            .catch(error => {
                console.error('Erro ao atualizar status do pedido:', error);
            });
    };

    return (
        <div>
            <h3>Pedidos Cadastrados</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {orders && orders.length > 0 ? (
                    orders.map((order) => (
                        <li key={order.orderid} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #1E2A47', borderRadius: '8px', backgroundColor: '#FFA500', maxWidth: '600px', margin: 'auto' }}>
                            <h4><strong>Pedido #{order.orderid}</strong></h4>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Mesa:</strong> {order.tableid}</p>
                            <p><strong>Forma de Pagamento:</strong> {order.paymenttype}</p>
                            <p><strong>Total do Pedido:</strong> R${order.totalorder}</p>
                            <h5>Itens:</h5>
                            <ul>
                                {order.items && order.items.map((item, index) => (
                                    <li key={index}>
                                        <p><strong>Produto:</strong> {item.name}</p>
                                        <p><strong>Quantidade:</strong> {item.quantity}</p>
                                        <p><strong>Preço Unitário:</strong> R${item.price}</p>
                                        <p><strong>Subtotal:</strong> R${(item.quantity * item.price).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '10px' }}>
                                <select
                                    value={selectedStatuses[order.orderid] || order.status}
                                    onChange={(e) => handleStatusSelect(order.orderid, e.target.value)}
                                    style={{ padding: '5px', marginRight: '10px' }}
                                    disabled={order.status === 'cancelado'}
                                >
                                    <option value="pendente">Pendente</option>
                                    <option value="em_progresso">Em Progresso</option>
                                    <option value="finalizado">Finalizado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                                <button
                                    onClick={() => handleStatusChange(order.orderid)}
                                    style={{
                                        backgroundColor: order.status === 'cancelado' ? '#ccc' : '#28a745',
                                        color: 'white',
                                        padding: '5px 10px',
                                        border: 'none',
                                        cursor: order.status === 'cancelado' ? 'not-allowed' : 'pointer',
                                    }}
                                    disabled={order.status === 'cancelado'}
                                >
                                    Alterar Status
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Nenhum pedido cadastrado.</p>
                )}
            </ul>
        </div>
    );
}

export default OrderList;
