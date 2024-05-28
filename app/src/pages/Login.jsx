import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Typography, Alert, Grid, Box } from '@mui/material';
import Header from './headerLogin'; // ajuste o caminho conforme necessário
import { useNavigate } from 'react-router-dom';
import logo from '../components/img/logo.png';

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
      <Grid container spacing={2} style={{paddingTop:'5%'}}>
        
        <Grid item xs={5} style={{textAlign:'center'}}>
          <img src={logo} alt="Logo Busca Ativa" style={{ width: '100%', marginTop: '5%', width: 350, height: 300 }} />
          <Typography variant="h6" component="h6" style={{textAlign: 'justify', paddingLeft:"10%"}}>A Busca Ativa Escolar é uma iniciativa do UNICEF, Undime, Congemas e Conasems que ajuda governos a identificar e reintegrar crianças fora da escola. Utilizando uma metodologia social e uma ferramenta tecnológica, facilita o planejamento de políticas públicas com dados concretos. Reúne áreas como Educação, Saúde e Assistência Social, melhorando a comunicação e o acompanhamento dos casos. A ferramenta é acessível em qualquer dispositivo, auxiliando na gestão das informações sobre cada criança.</Typography>
        </Grid>
        <Grid item xs={2} style={{paddingTop:'5%', textAlign:'center'}}>
          <Box
            sx={{
              height: '90%',
              width: '2px',
              backgroundColor: 'black',
              
            }}
            style={{marginLeft:'40%'}}
          />
        </Grid>
        <Grid item xs={5} style={{alignItems:"center", justifyContent:"center", paddingRight:'90px', marginTop: '20px', paddingTop:'15vh'}}>
          <Container className='login-container'>
            <div className='login-wrapper'>
              <div className='login-text' style={{textAlign:'center'}}>
                <Typography variant="h4" component="h1" id="login-text" style={{paddingBottom:"5%"}}>Login</Typography>
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
                      style = {{marginTop: '10%'}}
                    >
                      Entrar
                    </Button>
                  </div>
                  {error && <Alert severity="error" className='Alert'>{error}</Alert>}
                </form>
              </div>
            </div>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}
