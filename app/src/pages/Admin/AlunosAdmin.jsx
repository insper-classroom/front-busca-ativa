import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const columns = [
    { id: 'nome', label: 'NOME', minWidth: 100, editable: true },
    { id: 'turma', label: 'TURMA', minWidth: 100, editable: true },
    { id: 'ra', label: 'RA', minWidth: 100, editable: true },
    { id: 'status', label: 'STATUS', minWidth: 100, editable: true },
    { id: 'urgencia', label: 'URGÊNCIA', minWidth: 100, editable: true },
  ];

function createData(id, nome, turma, ra, status, urgencia) {
    return { id, nome, turma, ra, status, urgencia };
}

function AlunosAdmin() {
    const [alunos, setAlunos] = useState([]);
    const token = cookies.get('token');

    useEffect(() => {
        fetchAlunos();
    }, []); 

    const fetchAlunos = async () => {
        fetch('http://localhost:8000/alunos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            setAlunos(data);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }

    const rows = alunos.map(aluno => {
        return createData(aluno.id, aluno.nome, aluno.turma, aluno.ra, aluno.status, aluno.urgencia);
    });

    return (
        <div>
            <HeaderAdmin />

        </div>
    );
}

export default AlunosAdmin;