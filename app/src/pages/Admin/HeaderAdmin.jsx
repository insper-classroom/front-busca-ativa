import React from 'react';
import { Link } from 'react-router-dom';
import './static/HeaderAdmin.css';
import logoBranco from '../../components/img/logoBranco.png';
import Logout from '../../functions/Logout';

const HeaderAdmin = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoBranco} alt="Logo" className="logo" />
        <h1>Busca Ativa Escolar</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/usuarios">Usuários</Link>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
