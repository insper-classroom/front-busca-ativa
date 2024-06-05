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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';

const columns = [
  { id: 'email', label: 'EMAIL', minWidth: 100 },
  { id: 'nome', label: 'NOME', minWidth: 100 },
  { id: 'permissao', label: 'PERMISSÃO', minWidth: 100 },
  { id: 'edit', label: 'EDITAR', minWidth: 100 },
  { id: 'delete', label: 'DELETAR', minWidth: 100 },
];

const cookies = new Cookies();

function UserControl() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPermissions, setFilterPermissions] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
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

    if (sortOption === "nameAsc") {
      results.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (sortOption === "nameDesc") {
      results.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    setFilteredUsers(results);
  }, [searchTerm, filterPermissions, sortOption, users]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePermissionChange = (event) => {
    const { value } = event.target;
    setFilterPermissions(prev =>
      prev.includes(value) ? prev.filter(perm => perm !== value) : [...prev, value]
    );
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const rows = filteredUsers.map(user => {
    return { id: user._id, email: user.email, nome: user.nome, permissao: user.permissao };
  });

  return (
    <div className='user-control'>
      <HeaderAdmin />
      <div className='title' style={{display:"flex", justifyContent:"space-between"}}>
        <Typography 
        variant="h4" 
        component="h4" 
        style={{ 
          marginBottom: '10px', 
          textAlign: 'center', // Alinhando o texto ao centro
          fontFamily: 'Roboto, sans-serif', 
          fontWeight: 'bold', // Definindo o peso da fonte como negrito
          textTransform: 'uppercase', // Transformando o texto em maiúsculas
          paddingLeft: "2%"
        }}
      >
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
                  control={<Checkbox checked={filterPermissions.includes(permission)} onChange={handlePermissionChange} value={permission} />}
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
      <Paper className="tabela-usuarios">
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
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'edit' ? (
                            <Button
                              variant="contained"
                              sx={{ backgroundColor: '#007bff', color: 'white' }}
                              startIcon={<CreateIcon />}
                            >
                              Editar
                            </Button>
                          ) : column.id === 'delete' ? (
                            <Button
                              variant="contained"
                              sx={{ backgroundColor: 'red', color: 'white' }}
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(row.id)}
                            >
                              Deletar
                            </Button>
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
        <Link to='/usuarios/criar' className='create-user'>
          <Button variant="contained" disableElevation>Criar novo usuário</Button>
        </Link>
      </div>
    </div>
  );
}

export default UserControl;
