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
import './static/CasosTable.css';
import { Icon } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import WarningIcon from '@mui/icons-material/Warning';
import ArticleIcon from '@mui/icons-material/Article';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Typography from '@mui/material/Typography';

// Definição das colunas da tabela, cada coluna possui um id, um label, uma largura mínima, e um ícone opcional
const columns = [
    { id: 'aluno', label: 'ALUNO', minWidth: 100, format: (aluno) => aluno.nome.toUpperCase(), Icon: ContactsIcon },
    { id: 'turma', label: 'TURMA', minWidth: 100, Icon: GroupsIcon },
    { id: 'status', label: 'STATUS', minWidth: 100, Icon: FeedbackIcon },
    { id: 'urgencia', label: 'PRIORIDADE', minWidth: 100, Icon: WarningIcon },
    { id: 'actions', label: 'AÇÕES', minWidth: 170, Icon: ArticleIcon }
];

// Definição da ordem de urgência para a classificação
const urgencyOrder = { 'BAIXA': 1, 'MEDIA': 2, 'ALTA': 3, 'NÃO INFORMADO': 0 };

function CasosTable() {
    const [casos, setCasos] = useState([]); // Estado para armazenar os casos
    const [filteredCasos, setFilteredCasos] = useState([]); // Estado para armazenar os casos filtrados
    const [error, setError] = useState(null); // Estado para armazenar erros
    const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de busca
    const [filterYears, setFilterYears] = useState([]); // Estado para armazenar os filtros por ano
    const [filterClasses, setFilterClasses] = useState([]); // Estado para armazenar os filtros por classe
    const [filterUrgency, setFilterUrgency] = useState([]); // Estado para armazenar os filtros por urgência
    const [sortOption, setSortOption] = useState(""); // Estado para armazenar a opção de ordenação
    const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar a abertura do diálogo de filtros
    const cookies = new Cookies();
    const token = cookies.get('token'); // Obtém o token dos cookies
    const navigate = useNavigate(); // Hook para navegação

    // Efeito para buscar os casos da API quando o componente é montado
    useEffect(() => {
        fetch('http://127.0.0.1:8000/casos', {
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
            setCasos(data.caso); // Armazena os casos no estado
            setFilteredCasos(data.caso); // Inicializa os casos filtrados
        })
        .catch(error => {
            setError(error.message); // Armazena erros no estado
        });
    }, [token]);

    // Efeito para filtrar e ordenar os casos sempre que os filtros ou a ordenação são alterados
    useEffect(() => {
        let results = casos.filter(caso => 
            caso.aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterYears.length === 0 || filterYears.some(year => caso.aluno.turma.startsWith(year))) &&
            (filterClasses.length === 0 || filterClasses.some(cls => caso.aluno.turma.endsWith(cls))) &&
            (filterUrgency.length === 0 || filterUrgency.some(urgency => caso.urgencia.toLowerCase() === urgency.toLowerCase()))
        );

        // Ordena os resultados com base na opção de ordenação selecionada
        if (sortOption === "nameAsc") {
            results.sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome));
        } else if (sortOption === "nameDesc") {
            results.sort((a, b) => b.aluno.nome.localeCompare(a.aluno.nome));
        } else if (sortOption === "urgencyHighToLow") {
            results.sort((a, b) => urgencyOrder[b.urgencia] - urgencyOrder[a.urgencia]);
        } else if (sortOption === "urgencyLowToHigh") {
            results.sort((a, b) => urgencyOrder[a.urgencia] - urgencyOrder[b.urgencia]);
        }

        setFilteredCasos(results); // Armazena os resultados filtrados e ordenados no estado
    }, [searchTerm, sortOption, filterYears, filterClasses, filterUrgency, casos]);

    // Função para lidar com a mudança no campo de busca
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Função para lidar com a mudança na opção de ordenação
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    // Função para lidar com a mudança no filtro de anos
    const handleYearChange = (event) => {
        const { value } = event.target;
        setFilterYears(prev =>
            prev.includes(value) ? prev.filter(year => year !== value) : [...prev, value]
        );
    };

    // Função para lidar com a mudança no filtro de classes
    const handleClassChange = (event) => {
        const { value } = event.target;
        setFilterClasses(prev =>
            prev.includes(value) ? prev.filter(cls => cls !== value) : [...prev, value]
        );
    };

    // Função para lidar com a mudança no filtro de urgência
    const handleUrgencyChange = (event) => {
        const { value } = event.target;
        setFilterUrgency(prev =>
            prev.includes(value) ? prev.filter(urgency => urgency !== value) : [...prev, value]
        );
    };

    // Função para lidar com o clique no botão de visualização
    const handleViewClick = (id) => {
        navigate(`/paginaAluno/${id}`);
    };

    // Função para abrir o diálogo de filtros
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    // Função para fechar o diálogo de filtros
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Estado para controlar a paginação
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Função para mudar a página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Função para mudar a quantidade de linhas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            {/* Cabeçalho da página */}
            <div className='title' style={{ display: "flex", justifyContent: "space-between" }}>
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
                    Controle de Casos
                </Typography>
                {/* Contêiner de filtros */}
                <div className="filter-container">
                    <div className="filter-box">
                        {/* Campo de busca */}
                        <TextField
                            label="Busque Pelo Nome"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="compact-input"
                        />
                        {/* Controle de seleção para ordenar os resultados */}
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
                        {/* Botão para abrir o diálogo de filtros */}
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
            {/* Diálogo de filtros */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
                        <div className="filter-group">
                            <h4>Prioridade:</h4>
                            {['BAIXA', 'MEDIA', 'ALTA', 'NÃO INFORMADO'].map(urgency => (
                                <FormControlLabel
                                    key={urgency}
                                    control={<Checkbox checked={filterUrgency.includes(urgency)} onChange={handleUrgencyChange} value={urgency} />}
                                    label={urgency.charAt(0).toUpperCase() + urgency.slice(1)}
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
            {/* Contêiner da tabela */}
            <Paper className="table-container">
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        {/* Cabeçalho da tabela */}
                        <TableHead>
                            <TableRow className="table-header">
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="center"
                                        style={{ minWidth: column.minWidth }}
                                        className="header-cell"
                                        sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', color: '#333' }}
                                    >
                                        <div className="icon-label" style={{ paddingTop: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <div className='icon' style={{ paddingRight: "3px", lineHeight: "0" }}>
                                                {column.Icon && <Icon component={column.Icon} sx={{ fontSize: 18 }} />}
                                            </div>
                                            <div>{column.label}</div>
                                        </div>
                                        {column.items && column.items.length > 0 && (
                                            <div className="column-items">
                                                {column.items.map(item => (
                                                    <div key={item}>{item}</div>
                                                ))}
                                            </div>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        {/* Corpo da tabela */}
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
                                                            Visualizar ficha
                                                        </Button>
                                                    );
                                                } else {
                                                    value = column.id === 'index' ? index + page * rowsPerPage : caso[column.id];
                                                }

                                                // Determina as classes para status e urgência
                                                const classNames = [];
                                                if (column.id === 'status') {
                                                    classNames.push('status', value.toLowerCase());
                                                } else if (column.id === 'urgencia') {
                                                    classNames.push('urgencia', value.toLowerCase());
                                                } else if (column.id === 'actions') {
                                                    classNames.push('actions');
                                                } else if (column.id === 'turma') {
                                                    classNames.push('turma');
                                                }

                                                var isStatus = column.id === 'status';
                                                var isUrgency = column.id === 'urgencia';
                                                return (
                                                    <TableCell key={column.id} align="center" className={classNames.join(' ')}>
                                                        {/* Renderiza o conteúdo da célula baseado no tipo de dado */}
                                                        {(() => {
                                                            if (isStatus && value === 'EM ABERTO') {
                                                                return <div className="status-dot-aberto">{value}</div>;
                                                            } else if (isStatus && value === 'FINALIZADO') {
                                                                return <div className="status-dot-finalizado">{value}</div>;
                                                            } else if (isUrgency && value === 'ALTA') {
                                                                return <div className="urgency-dot-alta">{value}</div>;
                                                            } else if (isUrgency && value === 'MEDIA') {
                                                                return <div className="urgency-dot-media">{value}</div>;
                                                            } else if (isUrgency && value === 'BAIXA') {
                                                                return <div className="urgency-dot-baixa">{value}</div>;
                                                            } else if (isUrgency && value === 'NÃO INFORMADO') {
                                                                return <div className="urgency-dot-nao-informado">{value}</div>;
                                                            } else if (column.format && typeof value === 'object') {
                                                                return column.format(value);
                                                            } else {
                                                                return value;
                                                            }
                                                        })()}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Controle de paginação */}
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
