import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './static/UserControl.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const columns = [
    { id: 'aluno', label: 'Aluno', minWidth: 100, format: (aluno) => aluno.nome },
    { id: 'turma', label: 'Turma', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'urgencia', label: 'Urgência', minWidth: 100 },
    { id: 'data', label: 'Data', minWidth: 170, format: (value) => new Date(value).toLocaleString() },
    { id: 'actions', label: 'Ações', minWidth: 170 }
];

function CasosTable() {
    const [casos, setCasos] = useState([]);
    const [filteredCasos, setFilteredCasos] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [filterUrgency, setFilterUrgency] = useState("");
    const cookies = new Cookies();
    const token = cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/casos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch cases');
            }
            return response.json();
        })
        .then(data => {
            setCasos(data.caso);
            setFilteredCasos(data.caso);
        })
        .catch(error => {
            setError(error.message);
        });
    }, [token]);

    useEffect(() => {
        let results = casos.filter(caso => 
            caso.aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterYear === "" || caso.aluno.turma.startsWith(filterYear)) &&
            (filterClass === "" || caso.aluno.turma.endsWith(filterClass)) &&
            (filterUrgency === "" || caso.urgencia.toLowerCase() === filterUrgency.toLowerCase())
        );

        if (sortOption === "nameAsc") {
            results.sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome));
        } else if (sortOption === "nameDesc") {
            results.sort((a, b) => b.aluno.nome.localeCompare(a.aluno.nome));
        } else if (sortOption === "urgencyHighToLow") {
            results.sort((a, b) => b.urgencia.localeCompare(a.urgencia));
        } else if (sortOption === "urgencyLowToHigh") {
            results.sort((a, b) => a.urgencia.localeCompare(b.urgencia));
        }

        setFilteredCasos(results);
    }, [searchTerm, sortOption, filterYear, filterClass, filterUrgency, casos]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleYearChange = (event) => {
        setFilterYear(event.target.value);
    };

    const handleClassChange = (event) => {
        setFilterClass(event.target.value);
    };

    const handleUrgencyChange = (event) => {
        setFilterUrgency(event.target.value);
    };

    const handleViewClick = (id) => {
        navigate(`/casos/${id}`);
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

    return (
        <div>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Busque Pelo Nome"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel>Ordenar Por</InputLabel>
                        <Select
                            value={sortOption}
                            onChange={handleSortChange}
                            label="Ordenar Por"
                        >
                            <MenuItem value=""><em>Nada</em></MenuItem>
                            <MenuItem value="nameAsc">Nome (A-Z)</MenuItem>
                            <MenuItem value="nameDesc">Nome (Z-A)</MenuItem>
                            <MenuItem value="urgencyHighToLow">Prioridade (Alta - Baixa)</MenuItem>
                            <MenuItem value="urgencyLowToHigh">Prioridade (Baixa - Alta)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel>Ano escolar</InputLabel>
                        <Select
                            value={filterYear}
                            onChange={handleYearChange}
                            label="Year"
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="5">5° Ano</MenuItem>
                            <MenuItem value="6">6° Ano</MenuItem>
                            <MenuItem value="7">7° Ano</MenuItem>
                            <MenuItem value="8">8° Ano</MenuItem>
                            <MenuItem value="9">9° Ano</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel>Classe</InputLabel>
                        <Select
                            value={filterClass}
                            onChange={handleClassChange}
                            label="Class"
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(cls => (
                                <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel>Prioridade</InputLabel>
                        <Select
                            value={filterUrgency}
                            onChange={handleUrgencyChange}
                            label="Urgency"
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            <MenuItem value="alta">Alta</MenuItem>
                            <MenuItem value="media">Média</MenuItem>
                            <MenuItem value="baixa">Baixa</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
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
                            {filteredCasos
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((caso, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={caso._id}>
                                            {columns.map((column) => {
                                                let value;
                                                if (column.id === 'turma') {
                                                    value = caso.aluno.turma;
                                                } else if (column.id === 'actions') {
                                                    value = (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleViewClick(caso._id)}
                                                        >
                                                            Visualizar
                                                        </Button>
                                                    );
                                                } else {
                                                    value = column.id === 'index' ? index + page * rowsPerPage : caso[column.id];
                                                }
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'object' ? column.format(value) : value}
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
                    count={filteredCasos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default CasosTable;