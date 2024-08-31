// Importa os módulos necessários do React, Material-UI, universal-cookie, react-router-dom, e ícones
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Grid } from '@mui/material';
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HeaderAdmin from '../../Admin/HeaderAdmin';
import HeaderAgente from '../../Agente/HeaderAgente';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Ative o plugin
dayjs.extend(customParseFormat);

// Inicializa o objeto de cookies
const cookies = new Cookies();



// Componente funcional CadastroAluno
const CadastroAluno = () => {
  // Recupera o token e a permissão do usuário armazenados nos cookies
  const token = cookies.get('token');
  const permissao = cookies.get('permissao');
  
  // Hook de navegação do React Router
  const navigate = useNavigate();

  // Estado inicial do formulário usando useState
  const [formData, setFormData] = useState({
    nome: '',
    turma: '',
    RA: '',
    endereco: '',
    faltas: '',
    dataNascimento: dayjs(),
    telefone: '',
    telefone2: '',
    responsavel: '',
    responsavel2: '',
  });

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,

    });
  };
  // Função para lidar com mudanças no campo de data
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dataNascimento: date,
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const alunoData = {
      nome: formData.nome,
      turma: formData.turma,
      RA: formData.RA,
      endereco: formData.endereco,
      faltas: formData.faltas,
      dataNascimento: formData.dataNascimento,
      telefone: formData.telefone,
      telefone2: formData.telefone2,
      responsavel: formData.responsavel,
      responsavel2: formData.responsavel2,
    };

    try {
      // Envia os dados do formulário para a API usando fetch
      const response = await fetch('http://127.0.0.1:8000/alunoBuscaAtiva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alunoData),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      
      // Reseta o estado do formulário
      setFormData({
        nome: '',
        turma: '',
        RA: '',
        endereco: '',
        telefone: '',
        faltas: '',
        dataNascimento: dayjs(),
        telefone2: '',
        responsavel: '',
        responsavel2: '',
      });

      // Redireciona para a página de alunos após o cadastro bem-sucedido
      navigate('/alunos');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao realizar cadastro');
    }
  };

  return (
    <div>
      {/* Renderiza o cabeçalho apropriado com base na permissão do usuário */}
      {permissao === 'AGENTE' ? <HeaderAgente /> : <HeaderAdmin />}
      <br />
      <div className='geral'>
        <Grid container spacing={2} className="login-container">
          <Grid item xs={1} style={{paddingLeft:"40px", paddingTop:"3%" }}>
            <Link to="/usuarios" style={{ textDecoration: 'none', color:"#007bff" }}>
              <ArrowBackIcon className="back-arrow" />
            </Link>
          </Grid>
          <Grid item xs={10} style={{ textAlign: 'center' }}>
            <Container maxWidth="md">
              <Box component="form" onSubmit={handleSubmit} className="form-container">
                <Typography component="h1" variant="h5" className="form-title">
                  Cadastro de Aluno
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      className="form-field"
                      margin="normal"
                      fullWidth
                      id="RA"
                      label="RA"
                      name="RA"
                      value={formData.ra}
                      onChange={handleChange}
                      autoComplete="RA"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
                      margin="normal"
                      required
                      fullWidth
                      id="faltas"
                      label="Faltas"
                      name="faltas"
                      value={formData.faltas}
                      onChange={handleChange}
                      autoComplete="faltas"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateField', 'DateField']}>
                        <DateField
                          label="Data de Nascimento"
                          value={formData.dataNascimento}
                          onChange={handleDateChange}
                          format='DD/MM/YYYY'
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
                      margin="normal"
                      required
                      fullWidth
                      id="dataNascimento"
                      label="Data de Nascimento"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      autoComplete="dataNascimento"
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
                      margin="normal"
                      fullWidth
                      id="telefone2"
                      label="Telefone 2"
                      name="telefone2"
                      value={formData.telefone2}
                      onChange={handleChange}
                      autoComplete="telefone2"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="form-field"
                      margin="normal"
                      fullWidth
                      id="responsavel2"
                      label="Responsável 2"
                      name="responsavel2"
                      value={formData.responsavel2}
                      onChange={handleChange}
                      autoComplete="responsavel2"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="form-button"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Cadastrar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </div>
      <br/>
    </div>
  );
};

// Exporta o componente para uso em outras partes da aplicação
export default CadastroAluno;
