import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importando o plugin para tabelas
import './productReports/productStyle.css'
// Função para buscar todos os produtos
async function getAllProducts() {
    const response = await fetch('http://localhost:3000/api/produtos');
    if (response.ok) {
        const products = await response.json();
        return products;
    } else {
        throw new Error('Erro ao obter lista de produtos');
    }
}

async function getTopSellingProductsByDate(date) {
    const response = await fetch(`http://localhost:3000/api/produto/topselling/${date}`);
    if (response.ok) {
        const products = await response.json();
        return products;
    } else {
        throw new Error('Erro ao obter produtos mais vendidos');
    }
}

// Função para buscar produto por descrição
async function getProductsByDescription(description) {
    const response = await fetch(`http://localhost:3000/api/produto/descricao/${description}`);
    if (response.ok) {
        const products = await response.json();
        return products;
    } else {
        throw new Error('Erro ao obter produtos por descrição');
    }
}

// Função para buscar produto pelo código (EAN)
async function getProductByCode(ean) {
    const response = await fetch(`http://localhost:3000/api/produto/codigo/${ean}`);
    if (response.ok) {
        const products = await response.json();
        return products; // Retorna o array de produtos
    } else {
        throw new Error('Erro ao obter produto com código EAN');
    }
}

// Função para criar um novo produto
async function createProduct(newProduct) {
    const response = await fetch('http://localhost:3000/api/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    });

    if (response.ok) {
        const product = await response.json();
        return product;
    } else {
        throw new Error('Erro ao criar produto');
    }
}

export default function ProductReport() {
    const [productData, setProductData] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        description: '',
        ean: '',
        date: '', // Adicionando a data ao estado
    });

    const [newProduct, setNewProduct] = useState({
        name: '',
        ean: '',
        description: '',
        type: '',
        group: '',
        price: '',
        quantity: '',
    });

    // Função para buscar todos os produtos
    async function getAllProducts() {
        const response = await fetch('http://localhost:3000/api/produtos');
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            throw new Error('Erro ao obter lista de produtos');
        }
    }

    // Função para buscar produto mais vendido por data
    async function getTopSellingProductsByDate(date) {
        const response = await fetch(`http://localhost:3000/api/produto/topselling/${date}`);
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            throw new Error('Erro ao obter produtos mais vendidos');
        }
    }

    // Função para buscar produtos por descrição
    async function getProductsByDescription(description) {
        const response = await fetch(`http://localhost:3000/api/produto/descricao/${description}`);
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            throw new Error('Erro ao obter produtos por descrição');
        }
    }

    // Função para buscar produto pelo código (EAN)
    async function getProductByCode(ean) {
        const response = await fetch(`http://localhost:3000/api/produto/codigo/${ean}`);
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            throw new Error('Erro ao obter produto com código EAN');
        }
    }

    // Função para gerar o PDF
    const generatePDF = () => {
        if (!productData || productData.length === 0) {
            alert('Não há dados para gerar o PDF');
            return;
        }

        const doc = new jsPDF();

        // Definindo a fonte e título
        doc.setFontSize(16);
        doc.text('Relatório de Produtos', 20, 20);

        // Definindo a largura das colunas e título das colunas
        const col = ["Nome", "Ean", "Descrição", "Preço", "Tipo", "Grupo", "Quantidade"];
        const rows = [];

        // Preenchendo as linhas com dados dos produtos
        productData.forEach(product => {
            rows.push([product.name, product.ean, product.description, product.price, product.type, product.group, product.quantity]);
        });

        // Criando a tabela no PDF
        doc.autoTable({
            startY: 30, // Definindo o Y para onde começar a tabela
            head: [col],
            body: rows,
            theme: 'grid', // Definindo o tema da tabela como grid (com bordas)
            margin: { top: 10 },
            styles: {
                overflow: 'linebreak',
                fontSize: 10,
                cellPadding: 2,
                halign: 'center',
            },
            columnStyles: {
                0: { cellWidth: 30 }, // Ajustando a largura da coluna 1
                1: { cellWidth: 30 }, // Ajustando a largura da coluna 2
                2: { cellWidth: 50 }, // Ajustando a largura da coluna 3
                3: { cellWidth: 30 }, // Ajustando a largura da coluna 4
                4: { cellWidth: 30 }, // Ajustando a largura da coluna 5
                5: { cellWidth: 30 }, // Ajustando a largura da coluna 6
                6: { cellWidth: 30 }, // Ajustando a largura da coluna 7
            }
        });

        // Salvando o PDF
        doc.save('relatorio-produtos.pdf');
    };

    // Funções de busca com limpeza de erro

    const handleSearchTopSellingByDate = async (e) => {
        e.preventDefault();
        setError(null); // Limpa o erro antes de iniciar uma nova busca
        try {
            const products = await getTopSellingProductsByDate(filters.date);
            setProductData(products);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearchByDescription = async (e) => {
        e.preventDefault();
        setError(null); // Limpa o erro antes de iniciar uma nova busca
        try {
            const products = await getProductsByDescription(filters.description);
            setProductData(products);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearchByCode = async (e) => {
        e.preventDefault();
        setError(null); // Limpa o erro antes de iniciar uma nova busca
        try {
            const products = await getProductByCode(filters.ean);
            setProductData(products); // Apenas define o array retornado diretamente
        } catch (error) {
            setError(error.message);
            setProductData([]); // Em caso de erro, limpa a lista
        }
    };

    const handleCreateProductChange = (e) => {
        const { id, value } = e.target;
        setNewProduct({ ...newProduct, [id]: value });
    };

    const handleSubmitCreateProduct = async (e) => {
        e.preventDefault();
        setError(null); // Limpa o erro antes de criar um novo produto
        try {
            const createdProduct = await createProduct(newProduct);
            setProductData([...productData, createdProduct]); // Adiciona o novo produto na lista
            setNewProduct({
                name: '',
                ean: '',
                description: '',
                type: '',
                group: '',
                price: '',
                quantity: '',
            });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="product-report">
            <h2>Relatório de Produtos</h2>

            {/* Busca por Descrição */}
            <form onSubmit={handleSearchByDescription}>
                <input
                    type="text"
                    value={filters.description}
                    onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                    placeholder="Buscar por descrição"
                />
                <button type="submit">Buscar por Descrição</button>
            </form>

            {/* Busca por Data para Produtos Mais Vendidos */}
            <form onSubmit={handleSearchTopSellingByDate}>
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    placeholder="Buscar por Data"
                />
                <button type="submit">Buscar Mais Vendidos</button>
            </form>

            {/* Busca por Código (EAN) */}
            <form onSubmit={handleSearchByCode}>
                <input
                    type="text"
                    value={filters.ean}
                    onChange={(e) => setFilters({ ...filters, ean: e.target.value })}
                    placeholder="Buscar por Código (EAN)"
                />
                <button type="submit">Buscar por Código</button>
            </form>

            {/* Lista de Produtos */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <h3>Produtos Encontrados</h3>
                <ul>
                    {productData.length > 0 ? (
                        productData.map((product) => (
                            <li key={product.id}>
                                <h4>{product.name}</h4>
                                <p><strong>Ean:</strong> {product.ean}</p>
                                <p><strong>Descrição:</strong> {product.description}</p>
                                <p><strong>Preço:</strong> {product.price}</p>
                                <p><strong>Tipo:</strong> {product.type}</p>
                                <p><strong>Grupo:</strong> {product.group}</p>
                            </li>
                        ))
                    ) : (
                        <p>Nenhum produto encontrado.</p>
                    )}
                </ul>
            </div>

            <button onClick={generatePDF}>Gerar PDF</button>

            {/* Criar Novo Produto */}
            <h3>Criar Novo Produto</h3>
            <form onSubmit={handleSubmitCreateProduct}>
                <input
                    type="text"
                    id="name"
                    value={newProduct.name}
                    onChange={handleCreateProductChange}
                    placeholder="Nome"
                    required
                />
                <input
                    type="text"
                    id="ean"
                    value={newProduct.ean}
                    onChange={handleCreateProductChange}
                    placeholder="Código EAN"
                    required
                />
                <input
                    type="text"
                    id="description"
                    value={newProduct.description}
                    onChange={handleCreateProductChange}
                    placeholder="Descrição"
                    required
                />
                <input
                    type="text"
                    id="type"
                    value={newProduct.type}
                    onChange={handleCreateProductChange}
                    placeholder="Tipo"
                    required
                />
                <input
                    type="text"
                    id="group"
                    value={newProduct.group}
                    onChange={handleCreateProductChange}
                    placeholder="Grupo"
                    required
                />
                <input
                    type="number"
                    id="price"
                    value={newProduct.price}
                    onChange={handleCreateProductChange}
                    placeholder="Preço"
                    required
                />
                <input
                    type="number"
                    id="quantity"
                    value={newProduct.quantity}
                    onChange={handleCreateProductChange}
                    placeholder="Quantidade"
                    required
                />
                <button type="submit">Criar Produto</button>
            </form>
        </div>
    );
}
