import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import HeaderAdmin from './HeaderAdmin';
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
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';

import './static/UserControl.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterPermissions, setFilterPermissions] = useState([]);
  const [sortOption, setSortOption] = useState('');
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
        Authorization: `Bearer ${token}`,
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
        setFilteredUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    let results = users.filter(user =>
      (user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPermissions.length === 0 || filterPermissions.includes(user.permissao))
    );

    if (sortOption === 'nameAsc') {
      results.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (sortOption === 'nameDesc') {
      results.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    setFilteredUsers(results);
  }, [searchTerm, filterPermissions, sortOption, users]);

  const handleDelete = id => {
    fetch(`http://localhost:8000/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

  const handleSave = id => {
    fetch(`http://localhost:8000/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = event => {
    setSortOption(event.target.value);
  };

  const handleEdit = (id, userData) => {
    setEditingUserId(id);
    setEditedUsersData(prevData => ({
      ...prevData,
      [id]: { ...userData },
    }));
  };

  const isEditing = id => {
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

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = filteredUsers.map(user => {
    return createData(user._id, user.email, user.nome, user.permissao);
  });

  return (
    <div className='user-control'>
      <HeaderAdmin />
      <div className='title'>
        <Typography variant="h4" component="h4">
          Controle de Usuários
        </Typography>
        <div className="filter-container">
          <div className="filter-box">
            <TextField
              label="Busque pelo nome ou email"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              className="compact-input"
            />
            <FormControl variant="outlined" size="small" className="compact-input">
              <InputLabel>Ordenar Por</InputLabel>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                label="Ordenar Por"
              >
                <MenuItem value=""><em>Nada</em></MenuItem>
                <MenuItem value="nameAsc">Nome (A-Z)</MenuItem>
                <MenuItem value="nameDesc">Nome (Z-A)</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              size="small"
              className="button"
              onClick={handleOpenDialog}
            >
              Filtros
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Filtros</DialogTitle>
        <DialogContent>
          <div className="filter-section">
            <div className="filter-group">
              <h4>Permissão:</h4>
              {['ADMIN', 'AGENTE', 'PROFESSOR'].map(permission => (
                <FormControlLabel
                  key={permission}
                  control={<Checkbox checked={filterPermissions.includes(permission)} onChange={(e) => setFilterPermissions(prev => prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission])} value={permission} />}
                  label={permission}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
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
                    sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', color: '#333', alignItems: 'center' }}
                  >
                    {column.id === 'permissao' ? (
                      <div className='icon-admin'>
                        <SupervisorAccountIcon className="icon" />
                        {column.label}
                      </div>
                    ) : column.id === "email" ? (
                      <div className="icon-email">
                        <EmailIcon className="icon" />
                        {column.label}
                      </div>
                    ) : column.id === "nome" ? (
                      <div className="icon-nome">
                        <BadgeIcon className="icon" />
                        {column.label}
                      </div>
                    ) : column.id === "edit" ? (
                      <div className="icon-edit">
                        <CreateIcon className="icon" />
                        {column.label}
                      </div>
                    ) : column.id === "delete" ? (
                      <div className="icon-delete">
                        <DeleteIcon className="icon" />
                        {column.label}
                      </div>
                    ) : (
                      column.label
                    )}
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
                                <Button
                                  variant='contained'
                                  sx={{ backgroundColor: '#007bff', color: 'white' }}
                                  startIcon={<CreateIcon />}
                                  onClick={() => handleSave(row.id)}>Salvar</Button>
                              ) : (
                                <Button
                                  variant='contained'
                                  sx={{ backgroundColor: '#007bff', color: 'white' }}
                                  startIcon={<CreateIcon />}
                                  onClick={() => handleEdit(row.id, row)}>Editar</Button>
                              )
                            ) : id === 'delete' ? (
                              <Button
                                variant="contained"
                                sx={{ backgroundColor: 'red', color: 'white' }}
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(row.id)}>Deletar</Button>
                            ) : (
                              editable ? (
                                id === 'permissao' ? (
                                  isEditing(row.id) ? (
                                    <Box sx={{ maxWidth: 150 }}>
                                      <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">PERMISSAO</InputLabel>
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="Permissão"
                                          value={editedUsersData[row.id] ? editedUsersData[row.id][id] : value}
                                          onChange={(e) => handlePermissionChange(e, row.id)}
                                        >
                                          <MenuItem value={"AGENT"}>AGENT</MenuItem>
                                          <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                          <MenuItem value={"PROFESSOR"}>PROFESSOR</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Box>
                                  ) : (
                                    value
                                  )
                                ) : (
                                  isEditing(row.id) ? (
                                    <Box
                                      component="form"
                                      sx={{
                                        '& > :not(style)': { m: 1, width: '20ch' },
                                      }}
                                      noValidate
                                      autoComplete="on"
                                    >
                                      <TextField
                                        id="filled-basic"
                                        label={id === 'email' ? 'Email' : id === 'nome' ? 'Nome' : ''}
                                        variant="filled"
                                        value={editedUsersData[row.id] ? editedUsersData[row.id][id] : value}
                                        onChange={(e) => handleInputChange(e, id, row.id)}
                                        sx={{ width: '20ch' }}
                                      />
                                    </Box>
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
        <Link to='/usuarios/criar' className='create-user'>
          <Button variant="contained" disableElevation>Criar novo usuário</Button>
        </Link>
      </div>
    </div>
  );
}

export default UserControl;
