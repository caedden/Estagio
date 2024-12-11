import React from 'react';

const RedirectButton = ({ setReportType }) => {
  // Função para definir qual relatório exibir
  const handleClickByType = () => {
    setReportType('byPaymentType'); // Atualiza o estado para exibir o componente ByPaymentType
  };

  const handleClickByPayment = () => {
    setReportType('byPayment'); // Atualiza o estado para exibir o componente PaymentType
  };

  return (
    <div>
      <button onClick={handleClickByType}>Exibir Relatório por Tipo de Pagamento</button>
      <br />
      <button onClick={handleClickByPayment}>Exibir Relatório de Pagamentos</button>
    </div>
  );
};

export default RedirectButton;
