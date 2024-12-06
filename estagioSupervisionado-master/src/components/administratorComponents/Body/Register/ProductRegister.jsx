import React, { useState } from 'react';
import './StyleProductRegister.css';

export default function ProductRegister() {
    const [selectedGroup, setSelectedGroup] = useState('Selecione o grupo');
    const [selectedType, setSelectedType] = useState('Selecione o tipo');
    const [showGroupOptions, setShowGroupOptions] = useState(false);
    const [showTypeOptions, setShowTypeOptions] = useState(false);

    const handleGroupSelect = (option) => {
        setSelectedGroup(option);
        setShowGroupOptions(false);
    };

    const handleTypeSelect = (option) => {
        setSelectedType(option);
        setShowTypeOptions(false);
    };

    return (
        <div>
            <form>
                <div className="registerContainer">
                    <div>
                        <h1 style={{ textAlign: 'center', paddingTop: '30px' }}>Cadastro de Produtos</h1>
                    </div>
                    <div className="boxRegister">
                        <div className="productLine">
                            <div>
                                <p>Código:</p>
                                <input className="productData" type="number" />
                            </div>
                            <div>
                                <p>Nome:</p>
                                <input className="productData" type="text" />
                            </div>
                            <div>
                                <p>Valor:</p>
                                <input className="productData" type="number" />
                            </div>
                        </div>
                        <div className="productLine">
                            <div className="customDropdown">
                                <p>Grupo:</p>
                                <div
                                    className="dropdownButton"
                                    onClick={() => setShowGroupOptions(!showGroupOptions)}
                                >
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
                            <div className="customDropdown">
                                <p>Tipo:</p>
                                <div
                                    className="dropdownButton"
                                    onClick={() => setShowTypeOptions(!showTypeOptions)}
                                >
                                    {selectedType}
                                </div>
                                <ul className={`dropdownOptions ${showTypeOptions ? 'show' : ''}`}>
                                    <li onClick={() => handleTypeSelect("Un")}>Unidade</li>
                                    <li onClick={() => handleTypeSelect("Kg")}>Quilograma</li>
                                </ul>
                            </div>

                            <div>
                                <p>Quantidade:</p>
                                <input className="productData" type="number" />
                            </div>
                        </div>
                    </div>
                    <div className="registerButton">
                        <button type="submit" id="btn" style={{ borderRadius: '5px', width: '100px', height: '30px', backgroundColor: '#80ed99' }}>Cadastrar</button>
                    </div>
                </div>
            </form>
        </div>
    );
}