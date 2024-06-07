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
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ComputerIcon from '@mui/icons-material/Computer';

import HeaderAdmin from '../../Admin/HeaderAdmin';
import HeaderAgente from '../../Agente/HeaderAgente';
import './static/ListaAluno.css';

const columns = [
  { id: 'nome', label: 'NOME', minWidth: 100 },
  { id: 'turma', label: 'TURMA', minWidth: 100 },
  { id: 'RA', label: 'RA', minWidth: 100 },
  { id: 'view', label: 'VISUALIZAR DADOS', minWidth: 150 },
  { id: 'delete', label: 'DELETAR', minWidth: 100 },
];

/**
 * Função para criar um objeto de dados de aluno.
 * @param {string} id - ID do aluno.
 * @param {string} nome - Nome do aluno.
 * @param {string} turma - Turma do aluno.
 * @param {string} RA - Registro Acadêmico do aluno.
 * @returns {object} - Objeto contendo os dados do aluno.
 */
function createData(id, nome, turma, RA) {
  return { id, nome, turma, RA };
}

const cookies = new Cookies();

/**
 * Componente para listar e gerenciar alunos.
 * Permite buscar, filtrar, ordenar, visualizar e deletar alunos.
 */
function ListaAluno() {
  const [users, setUsers] = useState([]); // Estado para armazenar a lista de alunos
  const [filteredUsers, setFilteredUsers] = useState([]); // Estado para armazenar a lista filtrada de alunos
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de busca
  const [filterYears, setFilterYears] = useState([]); // Estado para armazenar os anos filtrados
  const [filterClasses, setFilterClasses] = useState([]); // Estado para armazenar as turmas filtradas
  const [sortOption, setSortOption] = useState(""); // Estado para armazenar a opção de ordenação
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar a abertura do diálogo de filtros
  const token = cookies.get('token'); // Obtenção do token de autenticação
  const permissao = cookies.get('permissao'); // Obtenção da permissão do usuário
  const navigate = useNavigate(); // Hook de navegação do React Router

  // Hook para buscar a lista de alunos ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para buscar a lista de alunos
  const fetchUsers = () => {
    fetch('https://sibae-5d2fe0c3da99.herokuapp.com/alunoBuscaAtiva', {
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

  // Hook para filtrar e ordenar a lista de alunos com base nos critérios de busca e filtros
  useEffect(() => {
    let results = users.filter(user =>
      (user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || user.RA.includes(searchTerm)) &&
      (filterYears.length === 0 || filterYears.some(year => user.turma.startsWith(year))) &&
      (filterClasses.length === 0 || filterClasses.some(cls => user.turma.endsWith(cls)))
    );

    if (sortOption === "nameAsc") {
      results.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (sortOption === "nameDesc") {
      results.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    setFilteredUsers(results);
  }, [searchTerm, filterYears, filterClasses, sortOption, users]);

  // Função para lidar com a mudança no campo de busca
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Função para lidar com a mudança no filtro de anos
  const handleYearChange = (event) => {
    const { value } = event.target;
    setFilterYears(prev =>
      prev.includes(value) ? prev.filter(year => year !== value) : [...prev, value]
    );
  };

  // Função para lidar com a mudança no filtro de turmas
  const handleClassChange = (event) => {
    const { value } = event.target;
    setFilterClasses(prev =>
      prev.includes(value) ? prev.filter(cls => cls !== value) : [...prev, value]
    );
  };

  // Função para lidar com a mudança na opção de ordenação
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Função para navegar para a página de visualização dos dados do aluno
  const handleView = (id) => {
    navigate(`/alunos/${id}`);
  };

  // Função para deletar um aluno
  const handleDelete = (id) => {
    fetch(`https://sibae-5d2fe0c3da99.herokuapp.com/alunoBuscaAtiva/${id}`, {
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

  // Função para abrir o diálogo de filtros
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Função para fechar o diálogo de filtros
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const [page, setPage] = useState(0); // Estado para armazenar a página atual da tabela
  const [rowsPerPage, setRowsPerPage] = useState(10); // Estado para armazenar o número de linhas por página

  // Função para atualizar a página da tabela
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Função para atualizar o número de linhas por página na tabela
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Cria as linhas da tabela com base nos usuários filtrados
  const rows = filteredUsers.map(user => {
    return createData(user._id, user.nome, user.turma, user.RA);
  });

  return (
    <div className='user-control'>
      {permissao === 'AGENTE' ? <HeaderAgente /> : <HeaderAdmin />}
      <div className='title'>
        <Typography 
          variant="h4" 
          component="h4" 
          style={{ 
            marginBottom: '10px', 
            textAlign: 'center', 
            fontFamily: 'Roboto, sans-serif', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            paddingLeft: "2%"
          }}
        >
          Controle de Alunos
        </Typography>
        <div className="filter-container">
          <div className="filter-box">
            <TextField
              label="Busque pelo nome ou RA"
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
      <Dialog className='tabela-aluno' open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Filtros</DialogTitle>
        <DialogContent>
          <div className="filter-section">
            <div className="filter-group">
              <h4>Ano:</h4>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(year => (
                <FormControlLabel
                  key={year}
                  control={<Checkbox checked={filterYears.includes(year)} onChange={handleYearChange} value={year} />}
                  label={`${year}° Ano`}
                />
              ))}
            </div>
            <div className="filter-group">
              <h4>Turma:</h4>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(cls => (
                <FormControlLabel
                  key={cls}
                  control={<Checkbox checked={filterClasses.includes(cls)} onChange={handleClassChange} value={cls} />}
                  label={cls}
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
      <Paper className="tabela-aluno">
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
                    {column.id === 'RA' ? (
                      <div className='icon-admin'>
                        <ContactsIcon />
                        {column.label}
                      </div>
                    ) : column.id === "turma" ? (
                      <div className="icon-email">
                        <GroupsIcon />
                        {column.label}
                      </div>
                    ) : column.id === "nome" ? (
                      <div className="icon-nome">
                        <BadgeIcon />
                        {column.label}
                      </div>
                    ) : column.id === "view" ? (
                      <div className="icon-edit">
                        <TextSnippetIcon />
                        {column.label}
                      </div>
                    ) : column.id === "delete" ? (
                      <div className="icon-delete">
                        <DeleteIcon />
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
                .map((row, index) => (
                  <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={row.id} 
                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'view' ? (
                            <Button 
                              variant="contained" 
                              color="primary" 
                              style={{ backgroundColor: '#007bff', color: 'white' }}
                              startIcon={<ComputerIcon />}
                              onClick={() => handleView(row.id)}
                            >
                              Visualizar dados
                            </Button>
                          ) : column.id === 'delete' ? (
                            <Button 
                              variant="contained" 
                              className='delete-button'
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(row.id)}
                              sx = {{ backgroundColor: 'red', color: 'white' }}
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
        <Link to='/alunos/criar' className='create-user'>
          <Button variant="contained" disableElevation>Criar novo aluno</Button>
        </Link>
      </div>
    </div>
  );
}

export default ListaAluno;
