import React from 'react';
import { Link } from 'react-router-dom';
import './static/HeaderProfessor.css';
import logoBranco from '../../components/img/logoBranco.png';
import Logout from '../../functions/Logout';

/**
 * Componente de cabeçalho para a área do professor.
 * Exibe a logo, o título e os links de navegação.
 */
const HeaderProfessor = () => {

  /**
   * Função para determinar a classe CSS do link ativo.
   * @param {string} path - Caminho da rota.
   * @returns {string} - Retorna 'active' se o caminho da rota atual for igual ao parâmetro, caso contrário, retorna uma string vazia.
   */
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
          <li>
            <Logout />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderProfessor;
