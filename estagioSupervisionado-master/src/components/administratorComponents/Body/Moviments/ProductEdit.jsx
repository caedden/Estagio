import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './styleMoviment/productEdit.css'; // Importe o arquivo CSS

// Função para buscar todos os produtos
async function fetchAllProducts() {
    const response = await fetch(`http://localhost:3000/api/produtos`);
    if (response.ok) {
        const products = await response.json();
        return products;
    } else {
        throw new Error('Erro ao obter lista de produtos');
    }
}

// Função para buscar um produto pelo ID
async function fetchProduct(productId) {
    const response = await fetch(`http://localhost:3000/api/produto/${productId}`);
    if (response.ok) {
        const products = await response.json();
        return products[0]; // Assume que sempre há um único produto no array retornado
    } else {
        throw new Error('Erro ao obter produto');
    }
}

// Função para atualizar o produto
async function updateProduct(productId, updatedProduct) {
    const response = await fetch(`http://localhost:3000/api/produto/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
        const product = await response.json();
        return product;
    } else {
        throw new Error('Erro ao atualizar produto');
    }
}

export default function ProductEdit() {
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: '',
        ean: '',
        description: '',
        type: '',
        group: '',
        price: '',
        quantity: '',
    });
    const [message, setMessage] = useState('');

    // Carregar todos os produtos ao montar o componente
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchAllProducts();
                setProducts(products);
            } catch (error) {
                console.error(error.message);
            }
        };
        loadProducts();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [id]: value !== undefined ? value : '' });
    };

    const handleProductIdChange = (selectedOption) => {
        setProductId(selectedOption.value);
        handleFetchProduct(selectedOption.value);
    };

    const handleFetchProduct = async (id) => {
        try {
            const product = await fetchProduct(id);
            setUpdatedProduct({
                name: product.name || '',
                ean: product.ean || '',
                description: product.description || '',
                type: product.type || '',
                group: product.group || '',
                price: product.price || '',
                quantity: product.quantity || '',
            });
            setMessage(`Produto ${product.name} carregado para edição.`);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const product = await updateProduct(productId, updatedProduct);
            setMessage(`Produto atualizado com sucesso: ${product.name}`);
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="registerContainer">
            <div className="boxRegister">
                <h3>Alteração de Produto</h3>
                <div className="fetchProductContainer">
                    <Select
                        id="fetchProductId"
                        value={products.find(product => product.id === productId)}
                        onChange={handleProductIdChange}
                        options={products.map(product => ({ value: product.id, label: `${product.name} (ID: ${product.id})` }))}
                        placeholder="Selecione um produto"
                        className="customerData"
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            value={updatedProduct.name}
                            onChange={handleInputChange}
                            placeholder="Nome"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="ean">Código EAN</label>
                        <input
                            type="text"
                            id="ean"
                            value={updatedProduct.ean}
                            onChange={handleInputChange}
                            placeholder="Código EAN"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="description">Descrição</label>
                        <input
                            type="text"
                            id="description"
                            value={updatedProduct.description}
                            onChange={handleInputChange}
                            placeholder="Descrição"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="type">Tipo</label>
                        <input
                            type="text"
                            id="type"
                            value={updatedProduct.type}
                            onChange={handleInputChange}
                            placeholder="Tipo"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="group">Grupo</label>
                        <input
                            type="text"
                            id="group"
                            value={updatedProduct.group}
                            onChange={handleInputChange}
                            placeholder="Grupo"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="price">Preço</label>
                        <input
                            type="number"
                            id="price"
                            value={updatedProduct.price}
                            onChange={handleInputChange}
                            placeholder="Preço"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="quantity">Quantidade</label>
                        <input
                            type="number"
                            id="quantity"
                            value={updatedProduct.quantity}
                            onChange={handleInputChange}
                            placeholder="Quantidade"
                            required
                            className="customerData"
                        />
                    </div>
                    <button type="submit">Atualizar Produto</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
