import React from 'react';
import { Link } from 'react-router-dom';
import logoBranco from '../../components/img/logoBranco.png';
import Logout from '../../functions/Logout';

const HeaderAgente = () => {

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoBranco} alt="Logo" className="logo" />
        <h1>Busca Ativa Escolar</h1>
      </div>
      <nav>
        <ul>
        <li className={getLinkClass('/home')}>
          <Link to="/home">Home</Link>
        </li>
        <li className={getLinkClass('/alunos')}>
            <Link to="/alunos">Alunos</Link>
        </li>
        <li>
          <Logout />
        </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderAgente;
