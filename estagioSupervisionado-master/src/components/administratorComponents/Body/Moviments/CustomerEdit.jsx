import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './styleMoviment/customerEdit.css'; // Certifique-se de que o arquivo CSS existe

async function fetchAllCustomers() {
    const response = await fetch(`http://localhost:3000/api/clientes`);
    if (response.ok) {
        const customers = await response.json();
        return customers;
    } else {
        throw new Error('Erro ao obter lista de clientes');
    }
}

async function fetchCustomer(customerId) {
    const response = await fetch(`http://localhost:3000/api/cliente/${customerId}`);
    if (response.ok) {
        const customers = await response.json();
        return customers[0]; // Assume que sempre há um único cliente no array retornado
    } else {
        throw new Error('Erro ao obter cliente');
    }
}

async function updateCustomer(customerId, updatedCustomer) {
    const response = await fetch(`http://localhost:3000/api/cliente/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
    });

    if (response.ok) {
        const customer = await response.json();
        return customer;
    } else {
        throw new Error('Erro ao atualizar cliente');
    }
}

export default function CustomerEdit() {
    const [customerId, setCustomerId] = useState('');
    const [customers, setCustomers] = useState([]);
    const [updatedCustomer, setUpdatedCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        document: '',
        address: '',
        password: '', // Novo campo de senha
        active: true, // Novo campo para status
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const customers = await fetchAllCustomers();
                setCustomers(customers);
            } catch (error) {
                console.error(error.message);
            }
        };
        loadCustomers();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUpdatedCustomer({ ...updatedCustomer, [id]: value });
    };

    const handleStatusChange = (status) => {
        setUpdatedCustomer({ ...updatedCustomer, active: status });
    };

    const handleCustomerIdChange = (selectedOption) => {
        setCustomerId(selectedOption.value);
        handleFetchCustomer(selectedOption.value);
    };

    const handleFetchCustomer = async (id) => {
        try {
            const customer = await fetchCustomer(id);
            setUpdatedCustomer({
                name: customer.name || '',
                phone: customer.phone || '',
                email: customer.email || '',
                document: customer.document || '',
                address: customer.address || '',
                password: '', // Limpa a senha ao carregar o cliente
                active: customer.active || false,
            });
            setMessage(`Cliente ${customer.name} carregado para edição.`);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const customer = await updateCustomer(customerId, updatedCustomer);
            setMessage(`Cliente atualizado com sucesso: ${customer.name}`);
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="customerEditContainer">
            <div className="boxCustomerEdit">
                <h1 style={{color:"black", paddingBottom: "20px"}}>Alteração de Cliente</h1>
                <div className="fetchCustomerContainer">
                    <Select
                        id="fetchCustomerId"
                        value={Array.isArray(customers) && customers.find(customer => customer.id === customerId)} 
                        onChange={handleCustomerIdChange}
                        options={Array.isArray(customers) ? customers.map(customer => ({ value: customer.id, label: `${customer.name} (ID: ${customer.id})` })) : []}  
                        placeholder="Selecione um cliente"
                        className="customerData"
                    />
                </div>
                <form onSubmit={handleSubmit}>

                    <div className="inputGroup" style={{paddingTop: "20px"}}>
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            value={updatedCustomer.name}
                            onChange={handleInputChange}
                            placeholder="Nome"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={updatedCustomer.password}
                            onChange={handleInputChange}
                            placeholder="Senha"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="phone">Telefone</label>
                        <input
                            type="text"
                            id="phone"
                            value={updatedCustomer.phone}
                            onChange={handleInputChange}
                            placeholder="Telefone"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={updatedCustomer.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="document">Documento</label>
                        <input
                            type="text"
                            id="document"
                            value={updatedCustomer.document}
                            onChange={handleInputChange}
                            placeholder="Documento"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="address">Endereço</label>
                        <input
                            type="text"
                            id="address"
                            value={updatedCustomer.address}
                            onChange={handleInputChange}
                            placeholder="Endereço"
                            required
                            className="customerData"
                        />
                    </div>
                    <div className="inputGroup">
                        <label>Status</label>
                        <div className="statusButtons">
                            <button
                                type="button"
                                onClick={() => handleStatusChange(true)}
                                className={updatedCustomer.active ? 'buttonActive' : 'buttonInactive'}
                            >
                                Ativo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange(false)}
                                className={!updatedCustomer.active ? 'buttonActive' : 'buttonInactive'}
                            >
                                Inativo
                            </button>
                        </div>
                    </div>
                    <button type="submit">Atualizar Cliente</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
