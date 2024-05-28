import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Typography, Alert } from '@mui/material';
import Header from './header'; // ajuste o caminho conforme necessário
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        cookies.set("token", data.token, { path: "/" });
        window.location.href = "/home";
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setError("Credenciais não conferem. Confirme seu email e senha.");
      }
    } catch (error) {
      console.log(error);
      setError("Ocorreu um erro ao tentar fazer login.");
    }
  };

  return (
    <div>
      <Header /> {/* Adicione o componente Header aqui */}
      <Container className='login-container' style={{ marginTop: '20px' }}>
        <div className='login-wrapper'>
          <div className='login-text'>
            <Typography variant="h4" component="h1" id="login-text">Login</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                type="password"
                name="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                variant="outlined"
                margin="normal"
              />
              <div className='login-button'>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Entrar
                </Button>
              </div>
              {error && <Alert severity="error" className='Alert'>{error}</Alert>}
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
