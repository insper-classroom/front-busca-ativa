import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Grid, TextField, Button, Paper, Box, Typography, Container } from '@mui/material';

import HeaderAdmin from '../../Admin/HeaderAdmin';
import HeaderAgente from '../../Agente/HeaderAgente';

import './static/DadosAluno.css';

const cookies = new Cookies();

function DadosAluno() {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedAluno, setEditedAluno] = useState({});
  const token = cookies.get('token');
  const permissao = cookies.get('permissao');

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
    <div>
      {permissao === 'AGENTE' ? <HeaderAgente /> : <HeaderAdmin />}
      <br />
      <div className='geral'>
        <Grid container spacing={2} className="login-container">
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Container maxWidth="md" sx={{marginTop: '6%'}}>
              <Paper sx={{ padding: '25px', margin: '25px' }}>
                {aluno ? (
                  <Box component="form" noValidate autoComplete="off">
                    <br/>
                    <Typography component="h1" variant="h5" className="form-title">
                      Detalhes do Aluno
                    </Typography>
                    <br/>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="nome"
                          label="Nome"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.nome || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="turma"
                          label="Turma"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.turma || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="RA"
                          label="RA"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.RA || ''}
                          InputProps={{
                            readOnly: true,
                            style: { backgroundColor: 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="endereco"
                          label="Endereço"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.endereco || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="telefone"
                          label="Telefone"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.telefone || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="telefone2"
                          label="Telefone 2"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.telefone2 || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="responsavel"
                          label="Responsável"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.responsavel || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="responsavel2"
                          label="Responsável 2"
                          variant="outlined"
                          fullWidth
                          value={editedAluno.responsavel2 || ''}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            style: { backgroundColor: editMode ? 'white' : 'inherit' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" component={Link} to="/alunos">Voltar</Button>
                      {editMode ? (
                        <Button variant="contained" onClick={handleSave}>Salvar</Button>
                      ) : (
                        <Button variant="contained" onClick={() => setEditMode(true)}>Editar</Button>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <div>Carregando...</div>
                )}
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </div>
      <br />
    </div>
  );
}

export default DadosAluno;
