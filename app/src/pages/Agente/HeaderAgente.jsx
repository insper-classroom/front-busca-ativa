import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoBranco from '../../components/img/logoBranco.png';
import Logout from '../../functions/Logout';
import './static/HeaderAgente.css'; // Certifique-se de que o CSS correspondente esteja importado

/**
 * Componente de cabeçalho para o agente.
 */
const HeaderAgente = () => {
  const location = useLocation(); // Hook para obter a localização atual

  /**
   * Função para determinar a classe do link ativo com base no caminho atual.
   * @param {string} path - O caminho do link.
   * @returns {string} - A classe CSS 'active' se o caminho corresponder à localização atual.
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
