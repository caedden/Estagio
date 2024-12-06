import React, { useState } from 'react';

// Função para buscar o produto
async function getProduct(id) {
    try {
        const response = await fetch('http://localhost:3000/api/produto/'+id);
        if (response.ok) {
            const product = await response.json();
            return product;
        } else {
            throw new Error('Erro ao obter produto com id: ${id}');
        }
    } catch (error) {
        console.log (response)
        console.error('Erro na requisição:', error);
        throw error;
    }
}

export default function ProductReport() {
    const [productId, setProductId] = useState(''); // Estado para o id do produto
    const [productData, setProductData] = useState(null); // Estado para os dados do produto
    const [error, setError] = useState(null); // Estado para erro

    // Função para manipular a submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o comportamento padrão de envio do formulário
        setError(null); // Limpar erro anterior

        if (!productId) {
            setError('Por favor, insira um ID de produto.');
            return;
        }

        try {
            const product = await getProduct(productId);
            setProductData(product); // Atualiza o estado com os dados do produto
        } catch (error) {
            setError('Produto não encontrado ou erro na requisição.');
        }
    };

    return (
        <div>
            <h2>Relatório de Produto</h2>

            {/* Formulário de busca */}
            <form onSubmit={handleSubmit}>
                <label htmlFor="texto">ID do Produto: </label>
                <input
                    type="text"
                    id="texto"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)} // Atualiza o estado com o valor do input
                />
                <button type="submit">Buscar Produto</button>
            </form>

            {/* Exibindo os dados do produto */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe erro se houver */}
            {productData && (
                <div>
                    <h3>Detalhes do Produto</h3>
                    <p><strong>Nome:</strong> {productData[0].name}</p>
                    <p><strong>Ean:</strong> {productData[0].ean}</p>
                    <p><strong>Descrição:</strong> {productData[0].description}</p>
                    <p><strong>Data de Criação:</strong> {new Date(productData[0].creationdate).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}