import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderProfessor from './HeaderProfessor';
import Cookies from 'universal-cookie';
import { TextField, Button, Container, Typography } from '@mui/material';

const cookies = new Cookies();
function AdicionarTarefa() {
    const [aluno, setAluno] = useState({});
    const [titulo, setTitulo] = useState('');
    const [observacoes, setObservacoes] = useState('');
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
            setAluno(prevState => ({
                ...prevState,
                tarefas: [...prevState.tarefas, data]
            }));
            setTitulo('');
            setObservacoes('');
        })
        .catch(error => {
            console.error('Error adding task:', error);
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
                        Adicionar Tarefa
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
                </Container>
            </div>
        </div>
    );
}

export default AdicionarTarefa;