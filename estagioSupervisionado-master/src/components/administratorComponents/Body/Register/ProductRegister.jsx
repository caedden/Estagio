import React, { useState } from 'react';
import './StyleProductRegister.css';

export default function ProductRegister() {
    const [selectedGroup, setSelectedGroup] = useState('Selecione o grupo');
    const [selectedType, setSelectedType] = useState('Selecione o tipo');
    const [showGroupOptions, setShowGroupOptions] = useState(false);
    const [showTypeOptions, setShowTypeOptions] = useState(false);
    const [productEAN, setProductEAN] = useState(''); // Agora é 'EAN' e tratado como string
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');

    const handleGroupSelect = (option) => {
        setSelectedGroup(option);
        setShowGroupOptions(false);
    };

    const handleTypeSelect = (option) => {
        setSelectedType(option);
        setShowTypeOptions(false);
    };

    const clearForm = () => {
        setProductEAN('');
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductQuantity('');
        setSelectedGroup('Selecione o grupo');
        setSelectedType('Selecione o tipo');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação para verificar se todos os campos obrigatórios estão preenchidos
        if (!productEAN || !productName || !productPrice || !productQuantity) {
            alert('Preencha todos os campos.');
            return;
        }

        // Verifique se o EAN é um número válido (mantido como string para garantir que seja tratado corretamente)
        if (isNaN(productEAN) || productEAN.trim() === '') {
            alert('Código EAN inválido.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/produto/ean/${productEAN.trim()}`); // Alterado para usar EAN

            if (response.ok) {
                const data = await response.json();
                const updatedProduct = {
                    ...data,
                    quantity: data.quantity + parseInt(productQuantity),
                };

                await fetch(`http://localhost:3000/api/produto/ean/${productEAN.trim()}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProduct),
                });
                alert('Produto já cadastrado. Quantidade atualizada!');
            } else if (response.status === 404) {
                // Para criar o novo produto, usamos o corpo de requisição esperado
                const newProduct = {
                    ean: productEAN.trim(), // 'ean' no lugar de 'code'
                    name: productName,
                    description: productDescription,
                    price: parseFloat(productPrice),
                    quantity: parseInt(productQuantity),
                    group: selectedGroup,
                    type: selectedType,
                };

                await fetch('http://localhost:3000/api/produto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct),
                });
                alert('Produto cadastrado com sucesso!');
            } else {
                alert('Erro ao acessar o produto.');
            }

            clearForm();

        } catch (error) {
            console.error('Erro ao cadastrar ou atualizar o produto:', error);
            alert('Erro ao processar a requisição.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="registerContainer">
                    <div>
                        <h1 style={{ textAlign: 'center', paddingTop: '30px' }}>Cadastro de Produtos</h1>
                    </div>
                    <div className="boxRegister">
    <div className="productLine">
        <div>
            <p>Código EAN:</p>
            <input
                className="productData"
                type="text"
                value={productEAN}
                onChange={(e) => setProductEAN(e.target.value)}
                maxLength="50"
            />
        </div>
        <div>
            <p>Nome:</p>
            <input
                className="productData"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
            />
        </div>
        <div>
            <p>Valor:</p>
            <input
                className="productData"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
            />
        </div>
    </div>
    <div className="productLine">
        <div className="customDropdown">
            <p>Grupo:</p>
            <div className="dropdownButton" onClick={() => setShowGroupOptions(!showGroupOptions)}>
                {selectedGroup}
            </div>
            <ul className={`dropdownOptions ${showGroupOptions ? 'show' : ''}`}>
                <li onClick={() => handleGroupSelect("Drinks")}>Drinks</li>
                <li onClick={() => handleGroupSelect("Cervejas")}>Cervejas</li>
                <li onClick={() => handleGroupSelect("Vinhos")}>Vinhos</li>
                <li onClick={() => handleGroupSelect("Não Alcoólicos")}>Não Alcoólicos</li>
                <li onClick={() => handleGroupSelect("Porções")}>Porções</li>
                <li onClick={() => handleGroupSelect("Doses")}>Doses</li>
                <li onClick={() => handleGroupSelect("Garrafas")}>Garrafas</li>
                <li onClick={() => handleGroupSelect("Combos")}>Combos</li>
            </ul>
        </div>
        <div>
            <p>Descrição:</p>
            <input
                className="productData"
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
            />
        </div>
        <div className="customDropdown">
            <p>Tipo:</p>
            <div className="dropdownButton" onClick={() => setShowTypeOptions(!showTypeOptions)}>
                {selectedType}
            </div>
            <ul className={`dropdownOptions ${showTypeOptions ? 'show' : ''}`}>
                <li onClick={() => handleTypeSelect("Un")}>Unidade</li>
                <li onClick={() => handleTypeSelect("Kg")}>Quilograma</li>
            </ul>
        </div>
    </div>
    <div className="productLine">
        <div>
            <p>Quantidade:</p>
            <input
                className="productData"
                type="number"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
            />
        </div>
    </div>
    <div className="registerButton">
        <button type="submit" id="btn" style={{ borderRadius: '5px', width: '100px', height: '30px', backgroundColor: '#80ed99', cursor: "pointer" }}>Cadastrar</button>
    </div>
</div>
                </div>
            </form>
        </div>
    );
}
