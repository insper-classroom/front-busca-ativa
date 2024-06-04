import React, { useState, useEffect } from 'react';
import HeaderAdmin from './HeaderAdmin';
import Cookies from 'universal-cookie';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './static/UserControl.css';

const cookies = new Cookies();

const columns = [
    { id: 'nome', label: 'NOME', minWidth: 100, editable: true },
    { id: 'turma', label: 'TURMA', minWidth: 100, editable: true },
    { id: 'RA', label: 'RA', minWidth: 100, editable: true },
    { id: 'edit', label: 'EDITAR', minWidth: 100 },
    { id: 'delete', label: 'DELETAR', minWidth: 100 },
];

function createData(id, nome, turma, RA) {
    return { id, nome, turma, RA };
}

function AlunosAdmin() {
    const [alunos, setAlunos] = useState([]);
    const [page, setPage] = useState(0);
    const [editingUserId, setEditingUserId] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editedUsersData, setEditedUsersData] = useState({});
    const token = cookies.get('token');

    useEffect(() => {
        fetchAlunos();
    }, []);

    const fetchAlunos = () => {
        fetch('http://localhost:8000/alunosBuscaAtiva', {
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
    };

    const rows = alunos.map(aluno => createData(aluno.id, aluno.nome, aluno.turma, aluno.RA));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/alunosBuscaAtiva/${id}`, {
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
            setAlunos(alunos.filter(aluno => aluno.id !== id));
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    };

    const handleSave = (id) => {
        fetch(`http://localhost:8000/alunosBuscaAtiva/${id}`, {
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
            fetchAlunos();
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

    const handleInputChange = (e, columnId, rowId) => {
        const { value } = e.target;
        setEditedUsersData(prevData => ({
            ...prevData,
            [rowId]: {
                ...prevData[rowId],
                [columnId]: value
            }
        }));
    };

    const isEditing = (id) => {
        return id === editingUserId;
    };

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
                                        sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', color: '#333' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const { id } = column;
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
                                                    isEditing(row.id) ? (
                                                        <Box
                                                            component="form"
                                                            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                                                            noValidate
                                                            autoComplete="off"
                                                        >
                                                            <TextField
                                                                id={id}
                                                                label={id}
                                                                variant="filled"
                                                                value={editedUsersData[row.id] ? editedUsersData[row.id][id] : value}
                                                                onChange={(e) => handleInputChange(e, id, row.id)}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        value
                                                    )
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
                    <Button variant="contained" disableElevation>Criar novo Aluno</Button>
                </Link>
            </div>
        </div>
    );
}

export default AlunosAdmin;
