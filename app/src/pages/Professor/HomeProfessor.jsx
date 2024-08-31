import React from 'react';
import HeaderProfessor from './HeaderProfessor';
import AlunosTable from './AlunosTable';
import './static/HomeProfessor.css';

/**
 * Componente de página inicial para a área do professor.
 * Exibe o cabeçalho e a tabela de alunos.
 */
function HomeProfessor() {
    return (
        <div>
            <div>
                <HeaderProfessor /> {/* Componente de cabeçalho para o professor */}
            </div>
            <div className="user-control">
                <AlunosTable /> {/* Componente que exibe a tabela de alunos */}
            </div>
        </div>
    );
}

export default HomeProfessor;
