import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Container, Box } from '@mui/material';
import HeaderAdmin from './HeaderAdmin';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    senha: '',
    confirmarSenha: '',
    permissoes: 'professor',
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
    if (formData.senha !== formData.confirmarSenha) {
      alert('Senhas não coincidem!');
      return;
    }

    const userData = {
      email: formData.email,
      nome: formData.nome,
      permissoes: formData.permissoes,
      senha: formData.senha,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      // Limpar o formulário após o sucesso
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
      <div>
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
                <MenuItem value="adm">Administrador</MenuItem>
                <MenuItem value="agente">Agente</MenuItem>
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
        </div>
    </div>
  );
};

export default RegisterForm;
