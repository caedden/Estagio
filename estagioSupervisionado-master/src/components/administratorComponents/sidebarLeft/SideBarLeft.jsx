import React, { useState } from 'react';
import './StyleSideBarLeft.css';
import OrderMoviments from '../Body/Moviments/OrderMoviments';
import PriceChange from '../Body/Moviments/PriceChange';
import StockMoviments from '../Body/Moviments/StockMoviments';
import CustomerRegister from '../Body/Register/CustomerRegister';
import ProductRegister from '../Body/Register/ProductRegister';
import TableRegister from '../Body/Register/TableRegister';
import CustomerReport from '../Body/Relatorio/CustomerReport';
import OrderReport from '../Body/Relatorio/OrderReport';
import ProductReport from '../Body/Relatorio/ProductReport';
import ProductEdit from '../Body/Moviments/ProductEdit';
import CustomerEdit from '../Body/Moviments/CustomerEdit';

export default function SideBarLeft() {
    const [activeSection, setActiveSection] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState('');

    const initialIcons = {
        cadastro: './././cadastroIconBlack.png',
        movimentos: './././movimentosIconBlack.png',
        relatorios: './././relatoriosIconBlack.png',
    };

    const [iconSources, setIconSources] = useState(initialIcons);

    const handleMouseEnter = (iconName) => {
        setIconSources((prevIcons) => ({
            ...prevIcons,
            [iconName]: `./././${iconName}IconYellow.png`,
        }));
    };

    const handleMouseLeave = (iconName) => {
        setIconSources((prevIcons) => ({
            ...prevIcons,
            [iconName]: `./././${iconName}IconBlack.png`,
        }));
    };

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleItemClick = (message, iconName) => {
        setSelectedMessage(message);
        handleMouseLeave(iconName);
    };

    return (
        <div className="mainContainerSideBar">
            <div className="container">
                <div><h2 style={{marginBottom: "100px", marginTop: "25px"}}> <img src= "./././logo.png" alt="logo" /> </h2></div>
                <div
                    className="buttonSideBar"
                    onClick={() => toggleSection('cadastros')}
                    onMouseEnter={() => handleMouseEnter('cadastro')}
                    onMouseLeave={() => handleMouseLeave('cadastro')}
                >
                    <h2>
                        <img src={iconSources.cadastro} alt="Cadastro" className="icon" />CADASTROS
                    </h2>
                    {activeSection === 'cadastros' && (
                        <ul className="submenu" style={{ marginTop: '5px' }}>
                            <li onClick={() => handleItemClick(<ProductRegister />, 'cadastro')}>Cadastro de Produtos</li>
                            <li onClick={() => handleItemClick(<CustomerRegister />, 'cadastro')}>Cadastro de Clientes</li>
                            <li onClick={() => handleItemClick(<TableRegister />, 'cadastro')}>Cadastro de Mesa</li>
                        </ul>
                    )}
                </div>

                <div
                    className="buttonSideBar"
                    onClick={() => toggleSection('movimentos')}
                    onMouseEnter={() => handleMouseEnter('movimentos')}
                    onMouseLeave={() => handleMouseLeave('movimentos')}
                >
                    <h2>
                        <img src={iconSources.movimentos} alt="Movimentos" className="icon" />MOVIMENTOS
                    </h2>
                    {activeSection === 'movimentos' && (
                        <ul className="submenu" style={{ marginTop: '5px' }}>
                            <li onClick={() => handleItemClick(<OrderMoviments />, 'movimentos')}>Movimentação de Pedidos</li>
                            <li onClick={() => handleItemClick(<PriceChange />, 'movimentos')}>Alteração de Preços</li>
                            <li onClick={() => handleItemClick(<StockMoviments />, 'movimentos')}>Movimentação de Estoque</li>
                            <li onClick={() => handleItemClick(<ProductEdit />, 'movimentos')}>Alteração de Produtos</li> {/* Nova opção */}
                            <li onClick={() => handleItemClick(<CustomerEdit />, 'movimentos')}>Alteração de Cliente</li> {/* Nova opção */}
                        </ul>
                    )}
                </div>

                <div
                    className="buttonSideBar"
                    onClick={() => toggleSection('relatorios')}
                    onMouseEnter={() => handleMouseEnter('relatorios')}
                    onMouseLeave={() => handleMouseLeave('relatorios')}
                >
                    <h2>
                        <img src={iconSources.relatorios} alt="Relatórios" className="icon" />RELATÓRIOS
                    </h2>
                    {activeSection === 'relatorios' && (
                        <ul className="submenu" style={{ marginTop: '5px' }}>
                            <li onClick={() => handleItemClick(<OrderReport />, 'relatorios')}>Relatório de Pedidos</li>
                            <li onClick={() => handleItemClick(<ProductReport />, 'relatorios')}>Relatório de Produtos</li>
                            <li onClick={() => handleItemClick(<CustomerReport />, 'relatorios')}>Relatório de Clientes</li>
                        </ul>
                    )}
                </div>
                <div className="buttonSideBar logoutButton">
                    <h2>SAIR</h2>
                </div>
            </div>
            <div className="content">
                <p>{selectedMessage}</p>
            </div>
        </div>
    );
}
