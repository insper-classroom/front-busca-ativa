import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderProfessor from './HeaderProfessor';
import Cookies from 'universal-cookie';
import { TextField, Button, Container, Typography, Card, CardContent, CardActions, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const cookies = new Cookies();

function Tarefas() {
    const [aluno, setAluno] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [showAddTask, setShowAddTask] = useState(false);
    const token = cookies.get('token');
    const { id } = useParams();

    const handleSubmit = (event) => {
        event.preventDefault();
        adicionarTarefa();
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
            setShowAddTask(false);
        })
        .catch(error => {
            console.error('Error adding task:', error);
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
            setTarefas(tarefas.filter(tarefa => tarefa._id !== tarefaId));
        })
        .catch(error => {
            console.error('Error deleting tarefa:', error);
        });
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
                        onClick={() => setShowAddTask(!showAddTask)}
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
                            <Button type="submit" variant="contained" color="primary">
                                Enviar
                            </Button>
                        </form>
                    )}
                    {tarefas.length > 0 ? (
                        tarefas.map((tarefa, index) => (
                            <Card key={index} style={{ marginBottom: '20px' }}>
                                <CardContent>
                                    <Typography variant='h6'>Tarefa: {tarefa.titulo}</Typography>
                                    <Typography variant='h6'>Observação: {tarefa.observacoes}</Typography>
                                    <Typography variant='h6'>Status: {tarefa.status}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        startIcon={<DeleteIcon />}
                                        onClick={() => deleteTarefa(tarefa._id)}
                                    >
                                        Deletar
                                    </Button>
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