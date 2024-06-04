import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import './static/CasosTable.css';
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
    const [filterYears, setFilterYears] = useState([]);
    const [filterClasses, setFilterClasses] = useState([]);
    const [filterUrgency, setFilterUrgency] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
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
            (filterYears.length === 0 || filterYears.some(year => caso.aluno.turma.startsWith(year))) &&
            (filterClasses.length === 0 || filterClasses.some(cls => caso.aluno.turma.endsWith(cls))) &&
            (filterUrgency.length === 0 || filterUrgency.includes(caso.urgencia.toLowerCase())) &&
            (filterStatus.length === 0 || filterStatus.includes(caso.status.toLowerCase()))
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
    }, [searchTerm, sortOption, filterYears, filterClasses, filterUrgency, filterStatus, casos]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleYearChange = (event) => {
        const { value } = event.target;
        setFilterYears(prev =>
            prev.includes(value) ? prev.filter(year => year !== value) : [...prev, value]
        );
    };

    const handleClassChange = (event) => {
        const { value } = event.target;
        setFilterClasses(prev =>
            prev.includes(value) ? prev.filter(cls => cls !== value) : [...prev, value]
        );
    };

    const handleUrgencyChange = (event) => {
        const { value } = event.target;
        setFilterUrgency(prev =>
            prev.includes(value) ? prev.filter(urgency => urgency !== value) : [...prev, value]
        );
    };

    const handleStatusChange = (event) => {
        const { value } = event.target;
        setFilterStatus(prev =>
            prev.includes(value) ? prev.filter(status => status !== value) : [...prev, value]
        );
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleViewClick = (id) => {
        navigate(`/casos/${id}`);
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
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
            <div className="filter-container">
                <div className="filter-box">
                    <TextField
                        label="Nome"
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
                            <MenuItem value="urgencyHighToLow">Prioridade (Alta - Baixa)</MenuItem>
                            <MenuItem value="urgencyLowToHigh">Prioridade (Baixa - Alta)</MenuItem>
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
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Filtros</DialogTitle>
                <DialogContent>
                    <div className="filter-section">
                        <div className="filter-group">
                            <h4>Ano:</h4>
                            {['5', '6', '7', '8', '9'].map(year => (
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
                        <div className="filter-group">
                            <h4>Prioridade:</h4>
                            {['alta', 'media', 'baixa'].map(urgency => (
                                <FormControlLabel
                                    key={urgency}
                                    control={<Checkbox checked={filterUrgency.includes(urgency)} onChange={handleUrgencyChange} value={urgency} />}
                                    label={urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                                />
                            ))}
                        </div>
                        <div className="filter-group">
                            <h4>Status:</h4>
                            {['aberto', 'fechado', 'em andamento'].map(status => (
                                <FormControlLabel
                                    key={status}
                                    control={<Checkbox checked={filterStatus.includes(status)} onChange={handleStatusChange} value={status} />}
                                    label={status.charAt(0).toUpperCase() + status.slice(1)}
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
            {error && <p>{error}</p>}
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
                            {filteredCasos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((caso) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={caso.id}>
                                        {columns.map((column) => {
                                            const value = caso[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <Button onClick={() => handleViewClick(caso.id)}>Visualizar</Button>
                                        </TableCell>
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
