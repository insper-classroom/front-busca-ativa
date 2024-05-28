import React from 'react';
import StudentRow from './StudentRow';
import './static/StudentTable.css';

const StudentTable = () => {
  // Exemplo de dados de alunos
  const students = [
    { name: 'João Pedro da Silva', class: '6°B', ra: '00000-00', status: 'Novo', urgency: 'Baixa' },
    // Adicione mais dados conforme necessário
  ];

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Turma</th>
          <th>RA</th>
          <th>Status</th>
          <th>Urgência</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <StudentRow key={index} student={student} />
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
