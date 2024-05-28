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

    </header>
  );
};

export default Header;
