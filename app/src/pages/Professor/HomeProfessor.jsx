import React from 'react';
import HeaderProfessor from './HeaderProfessor';
import AlunosTable from './AlunosTable';

import './static/HomeProfessor.css';

function HomeProfessor() {
    return (
        <div>
            <div>
                <HeaderProfessor />
            </div>
            <div className="search-container">
            <h1 className="ola">Hello, professor!</h1>
            <AlunosTable />
            </div>
        </div>
    );
}

export default HomeProfessor;