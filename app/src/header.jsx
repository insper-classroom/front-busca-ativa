import React from 'react';
import './static/Header.css';
import logoBranco from './img/logoBranco.png';  // Importando a imagem corretamente

const Header = () => {
  return (
    <header className="header">
      <h1>Busca Ativa Escolar</h1>
      <nav>
        <ul>
          <li>Relatórios</li>
          <li>Lista de Alunos</li>
          <li>Admin</li>
        </ul>
      </nav>
      <img src={logoBranco} alt="Logo" className="logo" /> {/* Adicionando a imagem do logo */}
    </header>
  );
};

export default Header;