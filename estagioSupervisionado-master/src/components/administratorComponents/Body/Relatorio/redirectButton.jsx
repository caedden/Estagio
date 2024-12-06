import React from 'react';
import { useNavigate } from 'react-router-dom';  // Importa o hook useNavigate para navegação

const RedirectButton = () => {
    const navigate = useNavigate();  // Hook que permite navegação programática

    const handleClick = () => {
        navigate('/report/byPaymentType');  // Redireciona para o componente ByPaymentType
    };
    const handleClickByType = () => {
        navigate('/report/byPayment');  // Redireciona para o componente ByPaymentType
    };
    return (
        <div>
            <td>
                <button onClick={handleClick}>Ir para Relatório por Tipo de Pagamento e data</button>

            </td>
            <br />
            <td>
                <button onClick={handleClickByType}>Ir para Relatório por Tipo de Pagamento</button>

            </td>

        </div>

    );
};

export default RedirectButton;