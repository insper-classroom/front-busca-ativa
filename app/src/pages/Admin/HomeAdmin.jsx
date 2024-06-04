import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import CasosTable from './CasosTable'; // Importando o componente CasosTable
import './static/HomeAdmin.css';

function HomeAdmin() {
    return (
        <div className="home-admin">
            <HeaderAdmin />
            <div className="search-container">
                <h1>Bem vindo ADMIN</h1>
                <CasosTable /> {/* Utilizando o componente CasosTable */}
            </div>
        </div>
    );
}

export default HomeAdmin;