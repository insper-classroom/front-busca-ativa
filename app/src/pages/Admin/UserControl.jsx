import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import HeaderAdmin from './HeaderAdmin';
import './static/UserControl.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const columns = [
  { id: 'email', label: 'EMAIL', minWidth: 100, editable: true },
  { id: 'nome', label: 'NOME', minWidth: 100, editable: true },
  { id: 'permissao', label: 'PERMISSÃO', minWidth: 100, editable: true },
  { id: 'edit', label: 'EDITAR', minWidth: 100, editable: false },
  { id: 'delete', label: 'DELETAR', minWidth: 100, editable: false },
];

function createData(id, email, nome, permissao) {
  return { id, email, nome, permissao };
}

const cookies = new Cookies();

function UserControl() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUsersData, setEditedUsersData] = useState({});
  const token = cookies.get('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:8000/usuarios', {
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
    fetch(`http://localhost:8000/usuarios/${id}`, {
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
  
  const handleSave = (id) => {
    fetch(`http://localhost:8000/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editedUsersData[id]),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save user changes');
        }
        setEditingUserId(null);
        setEditedUsersData(prevData => {
          const newData = { ...prevData };
          delete newData[id]; 
          return newData;
        });
        fetchUsers();
      })
      .catch(error => {
        console.error('Error saving user changes:', error);
      });
  };
  const handleEdit = (id, userData) => {
    setEditingUserId(id);
    setEditedUsersData(prevData => ({
      ...prevData,
      [id]: { ...userData },
    }));
  };

  const isEditing = (id) => {
    return id === editingUserId;
  };

  const handleInputChange = (e, field, id) => {
    const { value } = e.target;
    setEditedUsersData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

  const handlePermissionChange = (e, id) => {
    const { value } = e.target;
    setEditedUsersData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        permissao: value,
      },
    }));
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = users.map(user => {
    return createData(user._id, user.email, user.nome, user.permissao);
  });

  return (
    <div className='user-control'>
      <HeaderAdmin />
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
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                      const { id, label, editable } = column;
                      const value = row[id];
                      return (
                        <TableCell key={id} align={column.align}>
                          {id === 'edit' ? (
                            isEditing(row.id) ? (
                              <Button onClick={() => handleSave(row.id)}>Salvar</Button>
                            ) : (
                              <Button onClick={() => handleEdit(row.id, row)}>Editar</Button> 
                            )
                          ) : id === 'delete' ? (
                            <Button onClick={() => handleDelete(row.id)}>Deletar</Button>
                          ) : (
                            editable ? (
                              id === 'permissao' ? (
                                isEditing(row.id) ? (
                                  <select
                                    value={editedUsersData[row.id] ? editedUsersData[row.id][id] : value}
                                    onChange={(e) => handlePermissionChange(e, row.id)}
                                  >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="PROFESSOR">PROFESSOR</option>
                                    <option value="AGENTE">AGENTE</option>
                                  </select>
                                ) : (
                                  value
                                )
                              ) : (
                                isEditing(row.id) ? (
                                  <input
                                    type="text"
                                    value={editedUsersData[row.id] ? editedUsersData[row.id][id] : value}
                                    onChange={(e) => handleInputChange(e, id, row.id)} // Passa o id da linha
                                  />
                                ) : (
                                  value
                                )
                              )
                            ) : (
                              value
                            )
                          )}
                        </TableCell>
                      );
                    })}
                    </TableRow>
                  );
                })}
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
            <Link to='/usuarios/criar' className='create-user'><Button  variant="contained" disableElevation>Criar novo usuário</Button></Link>
      </div>
    </div>
  );
}

export default UserControl;