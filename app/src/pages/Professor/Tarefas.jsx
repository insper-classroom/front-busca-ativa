import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderProfessor from './HeaderProfessor';
import Cookies from 'universal-cookie';
import { TextField, Button, Container, Typography, Card, CardContent, CardActions, IconButton, Select, MenuItem, InputLabel } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const cookies = new Cookies();

function Tarefas() {
    const [aluno, setAluno] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [status, setStatus] = useState('');
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const token = cookies.get('token');
    const { id } = useParams();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (editingTaskId) {
            editarTarefa();
        } else {
            adicionarTarefa();
        }
    };

    useEffect(() => {
        fetchAluno();
    }, [id]);

    const fetchAluno = () => {
        fetch(`http://localhost:8000/alunoBuscaAtiva/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch aluno');
            }
            return response.json();
        })
        .then(data => {
            setAluno(data);
            setTarefas(data.tarefas || []);
        })
        .catch(error => {
            console.error('Error fetching aluno:', error);
        });
    };

    const adicionarTarefa = () => {
        const novaTarefa = {
            titulo: titulo,
            observacoes: observacoes
        };

        fetch(`http://localhost:8000/tarefas/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(novaTarefa)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            return response.json();
        })
        .then(data => {
            setTarefas([...tarefas, data]);
            setTitulo('');
            setObservacoes('');
            setStatus('Em andamento');
            setShowAddTask(false);
            fetchAluno();
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
    };

    const editarTarefa = () => {
        const tarefaAtualizada = {
            titulo: titulo,
            observacoes: observacoes,
            status: status
        };

        fetch(`http://localhost:8000/tarefas/${id}/${editingTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tarefaAtualizada)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        })
        .then(data => {
            setTarefas(tarefas.map(tarefa => tarefa._id === editingTaskId ? data : tarefa));
            setTitulo('');
            setObservacoes('');
            setStatus('Em andamento');
            setEditingTaskId(null);
            setShowAddTask(false);
            fetchAluno();
        })
        .catch(error => {
            console.error('Error updating task:', error);
        });
    };

    const deleteTarefa = (tarefaId) => {
        fetch(`http://localhost:8000/tarefas/${id}/${tarefaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete tarefa');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchAluno();
        })
        .catch(error => {
            console.error('Error deleting tarefa:', error);
        });
    };

    const startEditing = (tarefa) => {
        setTitulo(tarefa.titulo);
        setObservacoes(tarefa.observacoes);
        setStatus(tarefa.status);
        setEditingTaskId(tarefa._id);
        setShowAddTask(true);
    };

    const cancelEditing = () => {
        setTitulo('');
        setObservacoes('');
        setStatus('');
        setEditingTaskId(null);
        setShowAddTask(false);
    };

    return (
        <div>
            <HeaderProfessor />
            <div className='user-control'>
                <Container>
                    <Button variant="contained" color="secondary" onClick={() => window.history.back()}>
                        Voltar
                    </Button>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Tarefas
                    </Typography>
                    <Typography variant="h6">
                        Nome: {aluno.nome}
                    </Typography>
                    <Typography variant="h6">
                        Turma: {aluno.turma}
                    </Typography>
                    <Typography variant="h6">
                        RA: {aluno.RA}
                    </Typography>
                    <Typography variant="h6">
                        Endereço: {aluno.endereco}
                    </Typography>
                    <Typography variant="h6">
                        Telefone: {aluno.telefone}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            if (editingTaskId) {
                                cancelEditing();
                            } else {
                                setShowAddTask(!showAddTask);
                            }
                        }}
                        style={{ marginBottom: '20px' }}
                    >
                        {showAddTask ? 'Cancelar' : 'Adicionar Tarefa'}
                    </Button>
                    {showAddTask && (
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <TextField
                            label="Tarefa"
                            variant="outlined"
                            fullWidth
                            required
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Observações"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        {editingTaskId && (
                            <>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    style={{ marginBottom: '20px' }}
                                >
                                    <MenuItem value="Em andamento">Em andamento</MenuItem>
                                    <MenuItem value="Finalizado">Finalizado</MenuItem>
                                </Select>
                            </>
                        )}
                        <Button type="submit" variant="contained" color="primary" startIcon={editingTaskId ? <SaveIcon /> : null}>
                            {editingTaskId ? 'Salvar' : 'Enviar'}
                        </Button>
                    </form>
                    )}
                    {tarefas.length > 0 ? (
                        tarefas.slice().reverse().map((tarefa, index) => (
                            <Card key={index} style={{ marginBottom: '20px' }}>
                                <CardContent>
                                    <Typography variant='h6'>Tarefa: {tarefa.titulo}</Typography>
                                    <Typography variant='h6'>Observação: {tarefa.observacoes}</Typography>
                                    <Typography variant='h6'>Status: {tarefa.status}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        color="primary"
                                        onClick={() => startEditing(tarefa)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => deleteTarefa(tarefa._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography variant='h6'>O aluno não possui nenhuma tarefa no momento</Typography>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default Tarefas;