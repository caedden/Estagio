import React, { useState, useEffect } from 'react';

export default function OrderMoviments() {
    const [orderData, setOrderData] = useState({
        items: [{ id: '', quantity: 1, price: 0.00 }],
        totalOrder: 0.00,
        paymentType: '',
        status: '',
        tableId: '',
    });

    const [products, setProducts] = useState([]);  // Lista de produtos disponíveis

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
                updatedItems[index].price = selectedProduct.price;
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
            items: [...prevData.items, { id: '', quantity: 1, price: 0.00 }],
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
            alert('Todos os campos são obrigatórios!' + totalOrder + " " + paymentType + " " + status + " " + tableId);
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
            } else {
                alert(result.error);  // Exibe o erro caso a requisição falhe
            }
        } catch (error) {
            console.error('Erro ao enviar o pedido:', error);
            alert('Erro ao enviar o pedido.');
        }
    };


    return (
        <div style={{ backgroundColor: '#FFC300', padding: '20px', width: '70%', margin: '0 auto', borderRadius: '8px' }}>
            <h2>Cadastro de Pedido</h2>
            <form onSubmit={handleSubmit}>
                {orderData.items.map((item, index) => (
                    <div key={item.id} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
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
                                    required
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                >
                                    <option value="">Selecione um Produto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - R${product.price.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ flex: '1 1 20%' }}>
                                <label htmlFor={`item-quantity-${index}`}>Quantidade:</label>
                                <input
                                    type="number"
                                    id={`item-quantity-${index}`}
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={handleChange}
                                    data-index={index}
                                    min="1"
                                    required
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>

                            <div style={{ flex: '1 1 20%' }}>
                                <label htmlFor={`item-price-${index}`}>Preço:</label>
                                <input
                                    type="number"
                                    id={`item-price-${index}`}
                                    name="price"
                                    value={item.price}
                                    onChange={handleChange}
                                    data-index={index}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                style={{
                                    flex: '1 1 10%',
                                    padding: '5px 10px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '5px',
                                }}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                    }}
                >
                    Adicionar Item
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 30%' }}>
                        <label htmlFor="totalOrder">Valor Total:</label>
                        <input
                            type="number"
                            id="totalOrder"
                            name="totalOrder"
                            value={calculateTotal()}
                            disabled
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                backgroundColor: '#f1f1f1',
                            }}
                        />
                    </div>

                    <div style={{ flex: '1 1 30%' }}>
                        <label htmlFor="paymentType">Forma de Pagamento:</label>
                        <select
                            id="paymentType"
                            name="paymentType"
                            value={orderData.paymentType}
                            onChange={handleGeneralChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="">Selecione...</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Pix">Pix</option>
                        </select>
                    </div>

                    <div style={{ flex: '1 1 30%' }}>
                        <label htmlFor="status">Status do Pedido:</label>
                        <select
                            id="status"
                            name="status"
                            value={orderData.status}
                            onChange={handleGeneralChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="">Selecione...</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Em Preparação">Em Preparação</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="tableId">Número da Mesa:</label>
                        <input
                            type="number"
                            id="tableId"
                            name="tableId"
                            value={orderData.tableId}
                            onChange={handleGeneralChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    Cadastrar Pedido
                </button>
            </form>
        </div>
    );


}    