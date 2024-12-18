import React, { useState, useEffect } from 'react';
import OrderList from './OrdersList'; 

export default function OrderMoviments() {
    const [orderData, setOrderData] = useState({
        items: [{ id: '', quantity: 1, price: 0.00 }], 
        totalOrder: 0.00,
        paymentType: '',
        status: '',
        tableId: '',
        clientId: ''
    });

    const [products, setProducts] = useState([]);  // Lista de produtos disponíveis
    const [clients, setClients] = useState([]);    // Lista de clientes para pesquisa
    const [clientSearch, setClientSearch] = useState(''); // Filtro de pesquisa para clientes
    const [isClientListVisible, setIsClientListVisible] = useState(false); // Controle de exibição da lista de clientes

    const [orders, setOrders] = useState([]); // Lista de pedidos cadastrados
    const [isModalOpen, setIsModalOpen] = useState(false); // Controle de exibição do modal

    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false); // Controle de exibição do modal de pedidos

    // Buscar os produtos disponíveis ao carregar o componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/produtos');
                const data = await response.json();
                setProducts(data);  // Armazena os produtos no estado
            } catch (error) {
                console.error('Erro ao carregar os produtos:', error);
            }
        };

        fetchProducts();
    }, []);

    // Buscar pedidos cadastrados
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/pedidos');
                const data = await response.json();
                setOrders(data); // Armazena os pedidos no estado
            } catch (error) {
                console.error('Erro ao carregar os pedidos:', error);
            }
        };

        fetchOrders();
    }, []);

    // Função para buscar clientes com base no nome ou documento (clientId)
    useEffect(() => {
        const fetchClients = async () => {
            if (clientSearch.trim() === '') return; // Evita chamada vazia ao backend

            try {
                const response = await fetch(`http://localhost:3000/api/clientes?search=${clientSearch}`);
                const result = await response.json();

                if (response.ok) {
                    setClients(result.data);  // Atualiza a lista de clientes com a resposta da API
                } else {
                    console.error('Erro ao carregar clientes:', result);
                }
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
            }
        };

        fetchClients();
    }, [clientSearch]);

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;

        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        const index = dataset.index;
        if (index === undefined) return; // Verifica se o index está presente

        const updatedItems = [...orderData.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [name]: value, // Atualiza apenas o campo específico
        };

        // Se o campo alterado for quantity ou id, atualiza o preço do produto
        if (name === 'quantity' || name === 'id') {
            const selectedProduct = products.find(product => product.id === updatedItems[index].id);
            if (selectedProduct) {
                updatedItems[index].price = selectedProduct.price; // Preço base do produto
            } else {
                console.error("Produto não encontrado");
            }
        }

        // Atualiza o estado com os itens modificados
        setOrderData((prevData) => ({
            ...prevData,
            items: updatedItems,
        }));
    };

    // Função para adicionar um novo item no pedido
    const addItem = () => {
        setOrderData((prevData) => ({
            ...prevData,
            items: [...prevData.items, { id: '', quantity: 1, price: 0.00 }], // Adiciona um item vazio
        }));
    };

    // Função para remover um item do pedido
    const removeItem = (index) => {
        const updatedItems = orderData.items.filter((item, i) => i !== index);
        setOrderData((prevData) => ({
            ...prevData,
            items: updatedItems,
        }));
    };

    // Função para calcular o total do pedido
    const calculateTotal = () => {
        return orderData.items.reduce((total, item) => total + (parseFloat(item.quantity) * parseFloat(item.price)), 0).toFixed(2);
    };

    // Função para enviar os dados do pedido para o backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalOrder = calculateTotal();
        setOrderData((prevData) => ({
            ...prevData,
            totalOrder,
        }));

        const { items, paymentType, status, tableId } = orderData;

        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!items.length || !totalOrder || !paymentType || !status || !tableId) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    totalOrder: parseFloat(totalOrder),
                    paymentType,
                    status,
                    tableId: parseInt(tableId, 10),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);  // Exibe a mensagem de sucesso
                clearForm(); // Limpa o formulário após o sucesso
            } else {
                alert(result.error);  // Exibe o erro caso a requisição falhe
            }
        } catch (error) {
            console.error('Erro ao enviar o pedido:', error);
            alert('Erro ao enviar o pedido.');
        }
    };

    // Função para limpar o formulário
    const clearForm = () => {
        setOrderData({
            items: [{ id: '', quantity: 1, price: 0.00 }],
            totalOrder: 0.00,
            paymentType: '',
            status: '',
            tableId: '',
            clientId: ''
        });
        setClients([]); // Limpa a lista de clientes
        setClientSearch(''); // Limpa a busca de clientes
        setIsClientListVisible(false); // Fecha a lista de clientes
    };

    // Função para abrir o modal de pedidos
    const openOrdersModal = () => {
        setIsOrdersModalOpen(true);
    };

    // Função para fechar o modal de pedidos
    const closeOrdersModal = () => {
        setIsOrdersModalOpen(false);
    };

    return (
        <div style={{ backgroundColor: '#FFC300', padding: '20px', width: '70%', margin: '0 auto', borderRadius: '15px', borderColor: '000000'}}>
            <h2>Cadastro de Pedido</h2>
            <form onSubmit={handleSubmit}>
                {orderData.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px', border: '6px solid #000000', padding: '10px', borderRadius: '15px' }}>
                        <h3>Item {index + 1}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 30%' }}>
                                <label htmlFor={`item-id-${index}`}>Produto:</label>
                                <select
                                    id={`item-id-${index}`}
                                    name="id"
                                    value={item.id}
                                    onChange={handleChange}
                                    data-index={index}
                                >
                                    <option value="">Selecione um produto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: '1 1 30%' }}>
                                <label htmlFor={`item-quantity-${index}`}>Quantidade:</label>
                                <input
                                    type="number"
                                    id={`item-quantity-${index}`}
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={handleChange}
                                    data-index={index}
                                />
                            </div>
                            <div style={{ flex: '1 1 30%' }}>
                                <label htmlFor={`item-price-${index}`}>Preço Unitário:</label>
                                <input
                                    type="number"
                                    id={`item-price-${index}`}
                                    name="price"
                                    value={item.price}
                                    onChange={handleChange}
                                    data-index={index}
                                />
                            </div>
                            <div style={{ flex: '1 1 10%' }}>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px' }}>
                    Adicionar item
                </button>

                <div style={{ marginTop: '15px' }}>
                    <h3>Total: {calculateTotal()}</h3>
                    <label htmlFor="paymentType">Forma de Pagamento:</label>
                    <select
                        id="paymentType"
                        name="paymentType"
                        value={orderData.paymentType}
                        onChange={handleGeneralChange}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="cartao">Cartão</option>
                        <option value="pix">Pix</option>
                    </select>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={orderData.status}
                        onChange={handleGeneralChange}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="pendente">Pendente</option>
                        <option value="em_progresso">Em Progresso</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label htmlFor="tableId">Mesa:</label>
                    <input
                        type="text"
                        id="tableId"
                        name="tableId"
                        value={orderData.tableId}
                        onChange={handleGeneralChange}
                        required
                    />
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label htmlFor="clientId">Cliente:</label>
                    <input
                        type="text"
                        id="clientId"
                        name="clientId"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        onFocus={() => setIsClientListVisible(true)}
                    />
                    {isClientListVisible && (
                        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', position: 'absolute', padding: '5px', width: '300px' }}>
                            {clients.map(client => (
                                <div key={client.id} onClick={() => setOrderData(prev => ({ ...prev, clientId: client.id }))}>
                                    {client.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px' }}>
                        Enviar Pedido
                    </button>
                </div>
            </form>

            {/* Botão para abrir o modal de pedidos */}
            <button
                onClick={openOrdersModal}
                style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    marginTop: '20px',
                    width: '100%'
                }}
            >
                Ver Pedidos
            </button>

            {/* Modal de pedidos */}
            {isOrdersModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(52, 52, 52, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '80%',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}
                    >
                        <button
                            onClick={closeOrdersModal}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '5px 10px',
                                border: 'none',
                                marginBottom: '20px'
                            }}
                        >
                            Fechar
                        </button>
                        <h3>Pedidos</h3>
                        <OrderList orders={orders} />
                    </div>
                </div>
            )}
        </div>
    );
}
