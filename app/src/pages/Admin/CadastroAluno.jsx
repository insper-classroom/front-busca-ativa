import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Grid } from '@mui/material';
import HeaderAdmin from './HeaderAdmin';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './static/Cadastro.css';

const cookies = new Cookies();

const AlunoForm = () => {
    const token = cookies.get('token');
    
    const [formData, setFormData] = useState({
        nome: '',
        turma: '',
        ra: '',
        endereco: '',
        telefone: '',
        telefone2: '',
        responsavel: '',
        responsavel2: '',
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alunoData = {
      nome: formData.nome,
      turma: formData.turma,
      ra: formData.ra,
      endereco: formData.endereco,
      telefone: formData.telefone,
      telefone2: formData.telefone2,
      responsavel: formData.responsavel,
      responsavel2: formData.responsavel2,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/alunosBuscaAtiva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authroization': `Bearer ${token}`
        },
        body: JSON.stringify(alunoData),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      setFormData({
        nome: '',
        turma: '',
        ra: '',
        endereco: '',
        telefone: '',
        telefone2: '',
        responsavel: '',
        responsavel2: '',
      });
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao realizar cadastro');
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className='geral'>
        <Grid container spacing={2} className="login-container">
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            <Box sx={{ paddingRight: "80%" }}>
              <Link to="/usuarios" className='ArrowBackIcon'>
                <ArrowBackIcon />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={8} style={{ textAlign: 'center', paddingRight: "35%" }}>
            <br />
            <Container maxWidth="xs">
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography component="h1" variant="h5">
                  Cadastro de Aluno
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nome"
                    label="Nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    autoComplete="nome"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="turma"
                    label="Turma"
                    name="turma"
                    value={formData.turma}
                    onChange={handleChange}
                    autoComplete="turma"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="ra"
                    label="RA"
                    name="ra"
                    value={formData.ra}
                    onChange={handleChange}
                    autoComplete="ra"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="endereco"
                    label="Endereço"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    autoComplete="endereco"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="telefone"
                    label="Telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    autoComplete="telefone"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="telefone2"
                    label="Telefone 2"
                    name="telefone2"
                    value={formData.telefone2}
                    onChange={handleChange}
                    autoComplete="telefone2"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="responsavel"
                    label="Responsável"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleChange}
                    autoComplete="responsavel"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="responsavel2"
                    label="Responsável 2"
                    name="responsavel2"
                    value={formData.responsavel2}
                    onChange={handleChange}
                    autoComplete="responsavel2"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Cadastrar
                  </Button>
                </Box>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AlunoForm;
