import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Container, Box, Grid } from '@mui/material';
import HeaderAdmin from './HeaderAdmin';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './static/Cadastro.css';


const cookies = new Cookies();

const RegisterForm = () => {
  const token = cookies.get('token');

  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    senha: '',
    confirmarSenha: '',
    permissoes: 'professor',
  });

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para tratar o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verifica se as senhas coincidem
    if (formData.senha !== formData.confirmarSenha) {
      alert('Senhas não coincidem!');
      return;
    }

    const userData = {
      email: formData.email,
      nome: formData.nome,
      permissao: formData.permissoes,
      password: formData.senha,
    };

    try {
      // Faz a requisição para o cadastro do usuário

      const response = await fetch('http://127.0.0.1:8000/usuarios', {

      
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      // Trata a resposta da requisição
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      
      // Reseta o formulário
      setFormData({
        email: '',
        nome: '',
        senha: '',
        confirmarSenha: '',
        permissoes: 'professor',
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
          <Grid item xs={1} style={{paddingLeft:"40px", paddingTop:"3%" }}>
            <Link to="/usuarios" style={{ textDecoration: 'none', color:"#007bff" }}>
              <ArrowBackIcon className="back-arrow" />
            </Link>
          </Grid>
          <Grid item xs={10} style={{textAlign:'center'}}>
            <br/>
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
                  Cadastro
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    autoFocus
                  />
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
                    name="senha"
                    label="Senha"
                    type="password"
                    id="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmarSenha"
                    label="Confirmar Senha"
                    type="password"
                    id="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    autoComplete="confirm-password"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    select
                    label="Permissões"
                    name="permissoes"
                    value={formData.permissoes}
                    onChange={handleChange}
                  >
                    <MenuItem value="professor">Professor</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="agente">Agente/Funcionário</MenuItem>
                  </TextField>
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

export default RegisterForm;
