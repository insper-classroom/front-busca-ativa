import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import HeaderAdmin from './HeaderAdmin';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const cookies = new Cookies();

function DadosAlunos() {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedAluno, setEditedAluno] = useState({});
  const token = cookies.get('token');

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
        setEditedAluno(data);
      })
      .catch(error => {
        console.error('Error fetching aluno:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAluno(prevAluno => ({
      ...prevAluno,
      [name]: value,
    }));
  };

  const handleSave = () => {
    fetch(`http://localhost:8000/alunoBuscaAtiva/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editedAluno),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save aluno changes');
        }
        setEditMode(false);
        fetchAluno();
      })
      .catch(error => {
        console.error('Error saving aluno changes:', error);
      });
  };

  return (
    <div className='user-control'>
      <HeaderAdmin />
      <Paper sx={{ padding: '16px', margin: '16px' }}>
        {aluno ? (
          <div>
            <h2>Detalhes do Aluno</h2>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
            <TextField
            name="nome"
            label="Nome"
            variant="filled"
            value={editedAluno.nome || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            <TextField
            name="turma"
            label="Turma"
            variant="filled"
            value={editedAluno.turma || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            <TextField
            name="RA"
            label="RA"
            variant="filled"
            value={editedAluno.RA || ''}
            InputProps={{
                readOnly: true,
            }}
            />    
            <TextField
            name="endereco"
            label="Endereço"
            variant="filled"
            value={editedAluno.endereco || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            <TextField
            name="telefone"
            label="Telefone"
            variant="filled"
            value={editedAluno.telefone || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            <TextField
            name="telefone2"
            label="Telefone 2"
            variant="filled"
            value={editedAluno.telefone2 || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            <TextField
            name="responsavel"
            label="Responsável"
            variant="filled"
            value={editedAluno.responsavel || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            <TextField
            name="responsavel2"
            label="Responsável 2"
            variant="filled"
            value={editedAluno.responsavel2 || ''}
            onChange={handleInputChange}
            InputProps={{
                readOnly: !editMode,
            }}
            />
            </Box>
            {editMode ? (
              <Button variant="contained" onClick={handleSave}>Salvar</Button>
            ) : (
              <Button variant="contained" onClick={() => setEditMode(true)}>Editar</Button>
            )}
            <Button variant="contained" component={Link} to="/alunos">Voltar</Button>
          </div>
        ) : (
          <div>Carregando...</div>
        )}
      </Paper>
    </div>
  );
}

export default DadosAlunos;
