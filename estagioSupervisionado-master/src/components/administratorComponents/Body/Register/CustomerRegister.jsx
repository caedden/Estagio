import React, { useState } from 'react';
import './StyleCustomerRegister.css';

export default function CustomerRegister() {
    const [customerData, setCustomerData] = useState({
        name: '',
        password: '',
        phone: '',
        email: '',
        document: '',
        street: '', // A variável 'street' é para o endereço
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCustomerData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const isDuplicateClient = async (email, phone, document) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cliente/documento/${document}`);

            // Se a resposta for 404, significa que o cliente não existe, então prossegue normalmente.
            if (response.status === 404) {
                return false;  // Não há duplicação, então podemos prosseguir
            }

            // Para outros status, tentamos obter os dados
            const clients = await response.json();

            // Verifica se já existe um cliente com o mesmo email, telefone ou documento
            return clients.some(
                (client) => client.email === email || client.phone === phone || client.document === document
            );
        } catch (error) {
            console.error('Erro ao verificar duplicados:', error);
            alert('Erro ao verificar duplicação de cliente.');
            return false;  // Em caso de erro, não há duplicação
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, password, phone, email, document, street } = customerData;

        // Verifique se todos os campos obrigatórios foram preenchidos
        if (!name || !phone || !email || !document || !street) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        // Verifique se o cliente já existe
        const isDuplicate = await isDuplicateClient(email, phone, document);
        if (isDuplicate) {
            alert('Cliente já cadastrado!');
            return;
        }

        // Formatação dos dados para enviar ao backend
        const newClientData = {
            name,
            document,
            password,
            phone,
            address: street || null, // Envia o endereço como null se não preenchido
            email,
        };

        try {
            const response = await fetch('http://localhost:3000/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClientData), // Envio dos dados para o backend
            });

            const result = await response.json();

            if (response.ok) {
                alert('Cliente cadastrado com sucesso!');
                // Limpar o formulário após sucesso
                setCustomerData({
                    name: '',
                    password: '',
                    phone: '',
                    email: '',
                    document: '',
                    street: '',
                });
            } else {
                alert(`Erro ao cadastrar cliente: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao enviar os dados do cliente:', error);
            alert('Erro ao cadastrar cliente.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="registerContainer">
                    <div className="boxRegister">
                        <div>
                            <h1>Cadastro de Clientes</h1>
                        </div>

                        <div>
                            <p>Nome:</p>
                            <input
                                className="customerData"
                                type="text"
                                id="name"
                                value={customerData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p>Senha:</p>
                            <input
                                className="customerData"
                                type="text"
                                id="password"
                                value={customerData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p>Telefone:</p>
                            <input
                                className="customerData"
                                type="tel"
                                id="phone"
                                value={customerData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p>Email:</p>
                            <input
                                className="customerData"
                                type="email"
                                id="email"
                                value={customerData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p>Documento:</p>
                            <input
                                className="customerData"
                                type="number"
                                id="document"
                                value={customerData.document}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p>Endereço:</p>
                            <input
                                className="customerData"
                                style={{ marginBottom: '20px' }}
                                type="text"
                                id="street"
                                value={customerData.street}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                borderRadius: '5px',
                                width: '100px',
                                height: '30px',
                                backgroundColor: '#80ed99',
                                cursor: 'pointer',
                            }}
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
