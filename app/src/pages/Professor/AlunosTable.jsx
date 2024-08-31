import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer"; // Corrigido aqui
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from '@mui/material';

import AssignmentIcon from '@mui/icons-material/Assignment';
import ComputerIcon from '@mui/icons-material/Computer';
import GroupsIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SearchIcon from '@mui/icons-material/Search';

import './static/AlunosTable.css';

const columns = [
    { id: 'nome', label: 'Nome', minWidth: 100 },
    { id: 'turma', label: 'Turma', minWidth: 100 },
    { id: 'RA', label: 'R.A', minWidth: 100 },
    { id: 'tarefas', label: 'TAREFAS', minWidth: 170 },
];

/**
 * Componente de tabela de alunos.
 * Exibe uma tabela com informações dos alunos e permite filtrar, ordenar e navegar para outras páginas.
 */
function AlunosTable() {
    const [alunos, setAlunos] = useState([]);  // Estado para armazenar a lista de alunos
    const [filteredAlunos, setFilteredAlunos] = useState([]);  // Estado para armazenar os alunos filtrados
    const [error, setError] = useState(null);  // Estado para armazenar erros
    const [searchTerm, setSearchTerm] = useState('');  // Estado para armazenar o termo de busca
    const [filterYears, setFilterYears] = useState([]);  // Estado para armazenar os anos filtrados
    const [filterClasses, setFilterClasses] = useState([]);  // Estado para armazenar as turmas filtradas
    const [sortOption, setSortOption] = useState('');  // Estado para armazenar a opção de ordenação
    const [dialogOpen, setDialogOpen] = useState(false);  // Estado para controlar a abertura do diálogo de filtros
    const cookies = new Cookies();  // Instância de Cookies para obter o token de autenticação
    const token = cookies.get('token');  // Obtenção do token
    const navigate = useNavigate();  // Hook para navegação

    // Hook para buscar a lista de alunos ao montar o componente
    useEffect(() => {
        fetch('http://127.0.0.1:8000/alunoBuscaAtiva', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch alunos');  // Lança erro se a resposta não for bem-sucedida
            }
            return response.json();
        })
        .then(data => {
            setAlunos(data);  // Armazena os alunos no estado
            setFilteredAlunos(data);  // Inicializa os alunos filtrados
        })
        .catch(error => {
            setError(error.message);  // Armazena a mensagem de erro no estado
        });
    }, [token]);

    // Hook para filtrar e ordenar os alunos com base nos critérios
    useEffect(() => {
        let results = alunos.filter(aluno => 
            aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterYears.length === 0 || filterYears.some(year => aluno.turma.startsWith(year))) &&
            (filterClasses.length === 0 || filterClasses.some(cls => aluno.turma.endsWith(cls)))
        );

        // Ordena os resultados conforme a opção selecionada
        if (sortOption === 'nameAsc') {
            results.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (sortOption === 'nameDesc') {
            results.sort((a, b) => b.nome.localeCompare(a.nome));
        }

        setFilteredAlunos(results);  // Armazena os alunos filtrados no estado
    }, [searchTerm, filterYears, filterClasses, sortOption, alunos]);

    // Função para atualizar o termo de busca
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Função para atualizar os anos filtrados
    const handleYearChange = (event) => {
        const { value } = event.target;
        setFilterYears(prev =>
            prev.includes(value) ? prev.filter(year => year !== value) : [...prev, value]
        );
    };

    // Função para atualizar as turmas filtradas
    const handleClassChange = (event) => {
        const { value } = event.target;
        setFilterClasses(prev =>
            prev.includes(value) ? prev.filter(cls => cls !== value) : [...prev, value]
        );
    };

    // Função para atualizar a opção de ordenação
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    // Função para navegar para a página de visualização do aluno
    const handleViewClick = (id) => {
        navigate(`/alunos/${id}`);
    };

    // Função para navegar para a página de adição de tarefas do aluno
    const handleAddTaskClick = (id) => {
        navigate(`/tarefas/${id}`);
    };

    // Função para abrir o diálogo de filtros
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    // Função para fechar o diálogo de filtros
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const [page, setPage] = useState(0);  // Estado para armazenar a página atual da tabela
    const [rowsPerPage, setRowsPerPage] = useState(10);  // Estado para armazenar o número de linhas por página

    // Função para atualizar a página da tabela
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Função para atualizar o número de linhas por página na tabela
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <div className="filter-container" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div className='title'>
                    <Typography 
                        variant="h4" 
                        component="h4" 
                        style={{ 
                            marginBottom: '10px', 
                            fontFamily: 'Roboto, sans-serif', 
                            fontWeight: 'bold', 
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',  // Ensure the text stays on one line
                            paddingLeft: '20px'  // Add some padding to the left
                        }}
                    >
                        Controle de Tarefas
                    </Typography>
                </div>
                <div className="filter-box" style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label="Nome"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="compact-input"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        style={{ marginRight: '10px', width: '300px' }}  // Add some spacing between inputs
                    />
                    <FormControl variant="outlined" size="small" className="compact-input" style={{ marginRight: '10px' }}>
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
                        style={{ color: 'white', width: '80px', height: '38px'}}
                    >
                        Filtros
                    </Button>
                </div>
            </div>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Filtros</DialogTitle>
                <DialogContent>
                    <div className="filter-section">
                        <div className="filter-group">
                            <h4>Ano:</h4>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(year => ( // Adicionados anos 1, 2, 3 e 4
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
            <Paper className="table-container">
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow className="table-header">
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                                    >
                                        {column.id === 'RA' ? (
                                        <div className='icon-admin' style={{ paddingTop: "4px", display: "flex" }}>
                                            <ContactsIcon style={{ paddingRight: "3px" }} />
                                            {column.label}
                                        </div>
                                        ) : column.id === "turma" ? (
                                        <div className="icon-email" style={{ paddingTop: "4px", display: "flex" }}>
                                            <GroupsIcon style={{ paddingRight: "3px" }} />
                                            {column.label}
                                        </div>
                                        ) : column.id === "nome" ? (
                                        <div className="icon-nome" style={{ paddingTop: "4px", display: "flex" }}>
                                            <BadgeIcon style={{ paddingRight: "3px" }} />
                                            {column.label}
                                        </div>
                                        ) : column.id === "tarefas" ? (
                                        <div className="icon-edit" style={{ paddingTop: "4px", display: "flex" }}>
                                            <ComputerIcon style={{ paddingRight: "3px" }} />
                                            {column.label}
                                        </div>
                                        ) : column.id === "actions" ? (
                                        <div className="icon-delete" style={{ paddingTop: "4px", display: "flex" }}>
                                            <AssignmentIndIcon style={{ paddingRight: "3px" }} />
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
                            {filteredAlunos
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((aluno, index) => {
                                    return (
                                        <TableRow 
                                            hover 
                                            role="checkbox" 
                                            tabIndex={-1} 
                                            key={aluno._id} 
                                            className="table-row" 
                                            sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                                        >
                                            {columns.map((column) => {
                                                let value = aluno[column.id];
                                                if (column.id === 'tarefas') {
                                                    value = (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleAddTaskClick(aluno._id)}
                                                            className="button"
                                                            style={{ backgroundColor: '#007bff', color: 'white', width: '200px' }}
                                                            startIcon={<ComputerIcon />}
                                                        >
                                                            TAREFAS
                                                        </Button>
                                                    );
                                                } 
                                                return (
                                                    <TableCell key={column.id} align={column.align} className="table-cell">
                                                        {column.format ? column.format(value) : value}
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
                    count={filteredAlunos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default AlunosTable;
