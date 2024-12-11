import React, { useState, useEffect } from 'react';
import './StyleTableRegister.css';

export default function TableRegister() {
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const [status, setStatus] = useState('Ativo');

    // Função para buscar todas as mesas
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/mesas');
                if (!response.ok) throw new Error('Erro ao buscar mesas');
                const data = await response.json();
                setTables(data);
            } catch (error) {
                console.error('Erro ao buscar mesas:', error);
            }
        };

        fetchTables();
    }, []);

    // Função para adicionar uma nova mesa
    const handleAddTable = async () => {
        if (!tableNumber) {
            alert('Por favor, insira um número para a mesa.');
            return;
        }

        if (tables.some((table) => table.identifier === tableNumber)) {
            alert('Uma mesa com esse número já existe.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/mesa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: tableNumber, status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Erro ao criar a mesa: ${errorData.error}`);
                return;
            }

            const newTable = await response.json();
            setTables((prevTables) => [...prevTables, newTable]);
            setTableNumber('');
        } catch (error) {
            console.error('Erro ao adicionar mesa:', error);
            alert('Erro ao adicionar mesa.');
        }
    };

    // Função para alternar o status da mesa
    const toggleTableStatus = async (id) => {
        const table = tables.find((t) => t.id === id);
        if (!table) return;

        const newStatus = table.status === 'Ativo' ? 'Inativo' : 'Ativo';

        try {
            const response = await fetch(`http://localhost:3000/api/mesa/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Erro ao atualizar o status da mesa: ${errorData.error}`);
                return;
            }

            const updatedTable = await response.json();
            setTables((prevTables) =>
                prevTables.map((t) => (t.id === id ? updatedTable : t))
            );
        } catch (error) {
            console.error('Erro ao atualizar status da mesa:', error);
            alert('Erro ao atualizar status da mesa.');
        }
    };

    return (
        <div className="table-register-container">
            <h1 className="table-register-title">Cadastro de Mesas</h1>
            <div className="table-register-form">
                <label className="table-register-label">Número da Mesa:</label>
                <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="table-register-input"
                />
                <button onClick={handleAddTable} className="table-register-button">
                    Adicionar Mesa
                </button>
            </div>
            <div>
                <h2 className="table-register-subtitle">Mesas</h2>
                <ul className="table-register-list">
                    {tables.map((table) => (
                        <li key={table.id} className="table-register-item">
                            <span>Mesa {table.identifier}</span>
                            <div className="table-register-actions">
                                <span className={`table-status ${table.status === 'Ativo' ? 'active' : 'inactive'}`}>
                                    {table.status}
                                </span>
                                <button
                                    onClick={() => toggleTableStatus(table.id)}
                                    className="table-status-toggle-button"
                                >
                                    {table.status === 'Ativo' ? `Inativar Mesa ${table.identifier}` : `Ativar Mesa ${table.identifier}`}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
