import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminScreen from "./components/administratorComponents/AdminScreen/adminScreen";
import SideBarLeft from "./components/administratorComponents/sidebarLeft/SideBarLeft";
import LoginScreen from "./components/componentsForAll/Login/LoginScreen";
import Menu from "./components/userComponents/Body/Menu";
import NavBar from "./components/userComponents/Header/NavBar";
import RegistrationScreen from "./components/userComponents/registrationScreeen/registrationScreen";
import OrderMoviments from './components/administratorComponents/Body/Moviments/OrderMoviments';  
import OrdersList from './components/administratorComponents/Body/Moviments/OrdersList'; 
import OrdersReport from './components/administratorComponents/Body/Relatorio/OrderReport';

export default function App() {
  // Estilos globais para a aplicação
  const appStyles = {
    backgroundColor: '#1E2A47',  // Cor de fundo geral
    color: '#333',  // Cor do texto
    fontFamily: 'Arial, sans-serif',  // Fonte legível
    height: '100vh',  // Garantir que ocupe toda a altura da página
    margin: 0,  // Remover margens
    padding: 0,  // Remover padding
  };

  return (
    <Router>
      <div style={appStyles}> {/* Aplicando os estilos inline no contêiner principal */}
        <Routes>
          {/* Defina as rotas para cada página */}
          <Route path="/" element={<AdminScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/register" element={<RegistrationScreen />} />
          
          {/*  rota de "OrderMoviments" e "OrdersList" */}
          <Route path="/orderMoviments" element={<OrderMoviments />} />
          <Route path="/ordersList" element={<OrdersList />} />
          <Route path="/OrdersReport/*" element={<OrdersReport />} />
        </Routes>
      </div>
    </Router>
  );
}