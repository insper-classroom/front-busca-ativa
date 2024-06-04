import React from 'react';
import './static/header.css';
import logoBranco from '../components/img/logoBranco.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoBranco} alt="Logo" className="logo" />
        <h1>Busca Ativa Escolar</h1>
      </div>
      <nav>
        <ul>
          <li>Relatórios</li>
          <li>Lista de Alunos</li>
          <li>Admin</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
