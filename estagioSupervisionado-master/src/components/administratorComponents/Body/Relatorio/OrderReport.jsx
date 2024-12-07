
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RedirectButton from './redirectButton';  // Importa o botão de navegação
import ByPaymentType from './ordersReports/byPaymentType';  // Importa o componente do relatório

function OrderReport() {
  return (
    <Router>
      <div>
        <h1>App de Relatórios de Pedidos</h1>
        <RedirectButton />  {/* Botão para redirecionar */}

        <Routes>
          <Route path="/report/byPaymentType" element={<ByPaymentType />} />  {/* Define a rota para o relatório */}
          {/* Outras rotas podem ser configuradas aqui */}
          <Route path="/report/byPayment" element={<ByPaymentType />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default OrderReport;