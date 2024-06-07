import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import CasosTable from '../Compartilhadas/Agente&Admin/CasosTable';
import './static/HomeAdmin.css';

/**
 * Componente de página inicial para a área administrativa.
 * Exibe o cabeçalho e a tabela de casos.
 */
function HomeAdmin() {
    return (
        <div className="home-admin">
            <HeaderAdmin /> {/* Componente de cabeçalho */}
            <div className="search-container">
                <CasosTable /> {/* Componente que exibe a tabela de casos */}
            </div>
        </div>
    );
}

export default HomeAdmin;
