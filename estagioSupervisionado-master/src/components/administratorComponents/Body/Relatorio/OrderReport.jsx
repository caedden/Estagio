import React, { useState } from 'react';
import RedirectButton from './redirectButton';  
import ByPaymentType from './ordersReports/byPaymentType'; 
import PaymentType from './ordersReports/byPayment'; 

function OrderReport() {
  const [reportType, setReportType] = useState(null);  // Estado para controlar qual relatório mostrar

  return (
    <div>
      <h1>App de Relatórios de Pedidos</h1>

      {/* Botão para selecionar qual relatório exibir */}
      <RedirectButton setReportType={setReportType} />  

      {/* Exibindo os componentes conforme o estado reportType */}
      {reportType === 'byPaymentType' && <ByPaymentType />}
      {reportType === 'byPayment' && <PaymentType />}
    </div>
  );
}

export default OrderReport;
