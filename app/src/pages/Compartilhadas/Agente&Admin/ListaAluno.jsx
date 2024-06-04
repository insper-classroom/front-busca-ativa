import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';

import HeaderAdmin from '../../Admin/HeaderAdmin';
import HeaderAgente from '../../Agente/HeaderAgente';

const columns = [
  { id: 'nome', label: 'Nome', minWidth: 100, editable: true },
  { id: 'turma', label: 'Turma', minWidth: 100, editable: true },
  { id: 'RA', label: 'RA', minWidth: 100, editable: false },
  { id: 'view', label: 'VISUALIZAR DADOS', minWidth: 150, editable: false },
  { id: 'delete', label: 'DELETAR', minWidth: 100, editable: false },
];

function createData(id, nome, turma, RA) {
  return { id, nome, turma, RA };
}

const cookies = new Cookies();

function ListaAluno() {
  const [users, setUsers] = useState([]);
  const token = cookies.get('token');
  const permissao = cookies.get('permissao');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:8000/alunoBuscaAtiva', {
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
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/alunoBuscaAtiva/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        setUsers(users.filter(user => user._id !== id));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleView = (id) => {
    navigate(`/alunos/${id}`);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = users.map(user => {
    return createData(user._id, user.nome, user.turma, user.RA);
  });

  return (
    <div className='user-control'>
      {permissao === 'agente' ? <HeaderAgente /> : <HeaderAdmin />}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', color: '#333' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const { id, editable } = column;
                      const value = row[id];
                      return (
                        <TableCell key={id} align={column.align}>
                          {id === 'view' ? (
                            <Button onClick={() => handleView(row.id)}>Visualizar dados</Button>
                          ) : id === 'delete' ? (
                            <Button onClick={() => handleDelete(row.id)}>Deletar</Button>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div className='button-container'>
        <Link to='/alunos/criar' className='create-user'>
          <Button variant="contained" disableElevation>Criar novo aluno</Button>
        </Link>
      </div>
    </div>
  );
}

export default ListaAluno;
