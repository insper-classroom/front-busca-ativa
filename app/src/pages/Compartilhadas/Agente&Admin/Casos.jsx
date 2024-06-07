import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Popper
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import HeaderAdmin from '../../Admin/HeaderAdmin';
import HeaderAgente from '../../Agente/HeaderAgente';
import './static/Casos.css';

// Inicializa cookies
const cookies = new Cookies();

// Função principal do componente
export default function Casos() {
  const { id } = useParams(); // Obtém o id da URL
  const permissao = cookies.get('permissao'); // Obtém a permissão do usuário dos cookies
  const token = cookies.get('token'); // Obtém o token dos cookies
  const [idAluno, setIdAluno] = useState(null); // Estado para armazenar o id do aluno
  const [dataAluno, setDataAluno] = useState({}); // Estado para armazenar os dados do aluno
  const [dataCasos, setDataCasos] = useState({}); // Estado para armazenar os dados dos casos
  const [urgencia, setUrgencia] = useState(''); // Estado para armazenar a urgência do caso
  const [status, setStatus] = useState(''); // Estado para armazenar o status do caso
  const [ligacoes, setLigacoes] = useState([]); // Estado para armazenar as ligações
  const [visitas, setVisitas] = useState([]); // Estado para armazenar as visitas
  const [atendimentos, setAtendimentos] = useState([]); // Estado para armazenar os atendimentos
  const [usuario, setUsuario] = useState(''); // Estado para armazenar o nome do usuário
  const [selectedRowsLig, setSelectedRowsLig] = useState([]); // Estado para armazenar as linhas selecionadas das ligações
  const [selectedRowsVis, setSelectedRowsVis] = useState([]); // Estado para armazenar as linhas selecionadas das visitas
  const [selectedRowsAtendimento, setSelectedRowsAtendimento] = useState([]); // Estado para armazenar as linhas selecionadas dos atendimentos
  const [anchorLig, setAnchorLig] = useState(null); // Estado para armazenar o âncora das ligações
  const [anchorVis, setAnchorVis] = useState(null); // Estado para armazenar o âncora das visitas
  const [anchorAtendimento, setAnchorAtendimento] = useState(null); // Estado para armazenar o âncora dos atendimentos
  const [valueTabs, setValueTabs] = useState("0"); // Estado para armazenar o valor das abas
  const [formData, setFormData] = useState({
    abae: '',
    data: dayjs(),
    telefone: '',
    observacao: '',
    func: '',
    responsavel: '',
  }); // Estado para armazenar os dados do formulário

  const openLig = Boolean(anchorLig); // Verifica se o popper de ligação está aberto
  const openVis = Boolean(anchorVis); // Verifica se o popper de visita está aberto
  const openAtendimento = Boolean(anchorAtendimento); // Verifica se o popper de atendimento está aberto

  // Definição das colunas da DataGrid para ligações
  const columnsLig = [
    { field: 'data', headerName: 'Data', width: 200 },
    { field: 'abae', headerName: 'ABAE Responsável', width: 200 },
    { field: 'telefone', headerName: 'Telefone', width: 200 },
    { field: 'observacao', headerName: 'Observações', width: 200 },
  ];

  // Mapeamento das linhas da DataGrid para ligações
  const rowsLig = ligacoes.map((lig, index) => ({
    id: index,
    data: lig.data ? new Date(lig.data).toLocaleDateString('pt-BR') : '',
    abae: lig.abae,
    telefone: lig.telefone,
    observacao: lig.observacao
  }));

  // Definição das colunas da DataGrid para visitas
  const columnsVis = [
    { field: 'data', headerName: 'Data', width: 200 },
    { field: 'abae', headerName: 'ABAE Responsável', width: 200 },
    { field: 'observacao', headerName: 'Observações', width: 200 },
  ];

  // Mapeamento das linhas da DataGrid para visitas
  const rowsVis = visitas.map((vis, index) => ({
    id: index,
    data: vis.data ? new Date(vis.data).toLocaleDateString('pt-BR') : '',
    abae: vis.abae,
    observacao: vis.observacao
  }));

  // Definição das colunas da DataGrid para atendimentos
  const columnsAtendimento = [
    { field: 'data', headerName: 'Data', width: 200 },
    { field: 'func', headerName: 'Feito por', width: 200 },
    { field: 'responsavel', headerName: 'Responsável', width: 200 },
    { field: 'observacao', headerName: 'Observações', width: 200 },
  ];

  // Mapeamento das linhas da DataGrid para atendimentos
  const rowsAtendimento = atendimentos.map((atendimento, index) => ({
    id: index,
    data: atendimento.data ? new Date(atendimento.data).toLocaleDateString('pt-BR') : '',
    func: atendimento.func,
    responsavel: atendimento.responsavel,
    observacao: atendimento.observacao,
  }));

  // Carrega o usuário, id do aluno e dados do aluno quando o componente é montado ou o id muda
  useEffect(() => {
    loadUsuario();
    loadIdAluno();
  }, [id]);

  // Carrega os dados dos casos e do aluno quando o id do aluno é carregado
  useEffect(() => {
    if (idAluno) {
      loadCasos();
      loadAluno();
    }
  }, [idAluno]);

  // Função para carregar o id do aluno a partir do id do caso
  function loadIdAluno() {
    fetch(`https://sibae-5d2fe0c3da99.herokuapp.com/alunoBuscaAtiva/caso/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setIdAluno(data._id);
      })
      .catch(response => {
        alert('Erro ao achar o aluno!');
        alert(response.status);
      });
  }

  // Função para carregar os dados dos casos
  function loadCasos() {
    fetch(`https://sibae-5d2fe0c3da99.herokuapp.com/casos?aluno_id=${idAluno}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setDataCasos(data.caso[0]);
        setStatus(data.caso[0].status);
        setUrgencia(data.caso[0].urgencia);
        setLigacoes(data.caso[0].ligacoes);
        setVisitas(data.caso[0].visitas);
        setAtendimentos(data.caso[0].atendimentos);
      })
      .catch(response => {
        alert('Erro ao achar os casos do aluno!');
        alert(response.status);
      });
  }

  // Função para carregar os dados do aluno
  function loadAluno() {
    fetch(`https://sibae-5d2fe0c3da99.herokuapp.com/alunoBuscaAtiva/${idAluno}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setDataAluno(data);
      })
      .catch(response => {
        alert('Erro ao achar aluno!');
        alert(response.status);
      });
  }

  // Função para carregar os dados do usuário
  function loadUsuario() {
    fetch('https://sibae-5d2fe0c3da99.herokuapp.com/usuarios-dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ "token": token })
    }).then(response => response.json())
      .then(data => {
        setUsuario(data.nome);
      });
  }

  // Função para gerar relatório
  function gerarRealatorio() {
    fetch('https://sibae-5d2fe0c3da99.herokuapp.com/casos/gerar-relatorio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "dre": "DRE-IP",
        "unidade_escolar": "EMEF - LUIZ GONZAGA DO NASCIMENTO JUNIOR - GONZAGUINHA",
        "endereco": "Das Laranjeiras, 1029 - IPIRANGA",
        "contato": dataAluno.telefone,
        "turma": dataAluno.turma,
        "estudante": dataAluno.nome,
        "ra": dataAluno.RA,
        "usuario": usuario,
        "ligacoes": selectedRowsLig,
        "visitas": selectedRowsVis,
        "atendimentos": selectedRowsAtendimento
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    setSelectedRowsLig([]);
    setSelectedRowsVis([]);
    setSelectedRowsAtendimento([]);
  }

  // Função para atualizar status e urgência do caso
  function clickSU(newStatus, newUrgencia) {
    const casoData = {
      urgencia: newUrgencia,
      status: newStatus,
    };

    fetch('https://sibae-5d2fe0c3da99.herokuapp.com/casos/' + dataCasos._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(casoData),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Erro ao atualizar informações do caso');
      }
      alert('Informações atualizadas com sucesso');
    }).catch(response => {
      alert('Erro ao atualizar informações do caso');
      alert(response.status);
    });
  }

  // Função para submeter uma nova ligação
  const handleSubmitLig = async (e) => {
    e.preventDefault();
    const casoData = {
      abae: formData.abae,
      data: formData.data,
      telefone: formData.telefone,
      observacao: formData.observacao,
      ligacao: true,
      visita: false,
    };
    try {
      const response = await fetch('https://sibae-5d2fe0c3da99.herokuapp.com/casos/' + dataCasos._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(casoData),
      });

      if (!response.ok) {
        throw new Error('Erro no cadastramento do caso');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      setFormData({
        abae: '',
        data: dayjs(),
        telefone: '',
        observacao: '',
      });
      loadCasos();
      loadAluno();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar o caso');
    }
  };

  // Função para submeter uma nova visita
  const handleSubmitVis = async (e) => {
    e.preventDefault();
    const casoData = {
      abae: formData.abae,
      data: formData.data,
      observacao: formData.observacao,
      visita: true,
      ligacao: false
    };
    try {
      const response = await fetch('https://sibae-5d2fe0c3da99.herokuapp.com/casos/' + dataCasos._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(casoData),
      });

      if (!response.ok) {
        throw new Error('Erro no cadastramento do caso');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      setFormData({
        abae: '',
        data: dayjs(),
        observacao: '',
      });
      loadCasos();
      loadAluno();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar o caso');
    }
  };

  // Função para submeter um novo atendimento
  const handleSubmitAtendimento = async (e) => {
    e.preventDefault();
    const casoData = {
      func: formData.func,
      data: formData.data,
      responsavel: formData.responsavel,
      observacao: formData.observacao,
      atendimento: true,
    };
    try {
      const response = await fetch('https://sibae-5d2fe0c3da99.herokuapp.com/casos/' + dataCasos._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(casoData),
      });

      if (!response.ok) {
        throw new Error('Erro no cadastramento do caso');
      }

      const data = await response.json();
      console.log('Cadastro realizado com sucesso:', data);
      alert('Cadastro realizado com sucesso');
      setFormData({
        abae: '',
        data: dayjs(),
        observacao: '',
      });
      loadCasos();
      loadAluno();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar o caso');
    }
  };

  // Funções para abrir e fechar os poppers
  function clickAtendimento(event) {
    setAnchorAtendimento(anchorAtendimento ? null : event.currentTarget);
  }

  function clickLigacao(event) {
    setAnchorLig(anchorLig ? null : event.currentTarget);
  }

  function clickVisita(event) {
    setAnchorVis(anchorVis ? null : event.currentTarget);
  }

  // Função para lidar com a mudança de status
  const handleChangeStatus = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    clickSU(newStatus, urgencia);
  };

  // Função para lidar com a mudança de urgência
  const handleChangeUrgencia = (event) => {
    const newUrgencia = event.target.value;
    setUrgencia(newUrgencia);
    clickSU(status, newUrgencia);
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para lidar com a mudança de data no formulário
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      data: date,
    });
  };

  // Função para lidar com a mudança de abas
  const handleChangeTabs = (event, newValue) => {
    setValueTabs(newValue);
  };

  return (
    <div className='card'>
      {/* Renderiza o cabeçalho com base na permissão do usuário */}
      {permissao === 'AGENTE' ? <HeaderAgente /> : <HeaderAdmin />}
      <Grid container columnSpacing={2} rowSpacing={1} justifyContent="center" style={{ backgroundColor: '#f5f5f5', marginTop: '7%', borderRadius: '10px', padding: '20px' }}>
        <Grid container spacing={2} style={{ width: '86.7%', marginLeft: "9px", textAlign: "left", border: "1px solid black", borderRadius: "10px", backgroundColor: '#e0e0e0' }}>
          <Grid item xs={12} style={{ textAlign: "center", fontWeight: 'bold', fontSize: '1.2rem' }}>Informações do Aluno</Grid>
          <Grid item xs={3} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px', margin: '10px' }}>Nome: {dataAluno?.nome}</Grid>
          <Grid item xs={3} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px', margin: '10px' }}>Turma: {dataAluno?.turma}</Grid>
          <Grid item xs={3} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px', margin: '10px' }}>RA: {dataAluno?.RA}</Grid>
          <Grid item xs={6} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px', margin: '10px' }}>Endereço: {dataAluno?.endereco}</Grid>
          <Grid item xs={3} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px', margin: '10px' }}>Telefone: {dataAluno?.telefone}</Grid>
        </Grid>
        <Grid item xs={12} style={{ width: '90%', textAlign: "center", paddingTop: "50px", margin: "0px 100px" }}>
          <Grid container spacing={2} style={{ textAlign: "center", border: "1px solid black", borderRadius: "10px", backgroundColor: '#e0e0e0', padding: '20px' }}>
            <Grid item xs={12} style={{ textAlign: "center", fontWeight: 'bold', fontSize: '1.2rem' }}>Ficha do Aluno</Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  label="Status"
                  value={status}
                  onChange={handleChangeStatus}
                  defaultValue={dataCasos.status}
                  style={{ backgroundColor: 'white' }}
                >
                  <MenuItem value={"FINALIZADO"}>Finalizado</MenuItem>
                  <MenuItem value={"EM ABERTO"}>Em aberto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="urgencia-select-label">Urgência</InputLabel>
                <Select
                  labelId="urgencia-select-label"
                  id="urgencia-select"
                  label="Urgência"
                  value={urgencia}
                  onChange={handleChangeUrgencia}
                  defaultValue={dataCasos.urgencia}
                  style={{ backgroundColor: 'white' }}
                >
                  <MenuItem value={"BAIXA"}>Baixa</MenuItem>
                  <MenuItem value={"MEDIA"}>Média</MenuItem>
                  <MenuItem value={"ALTA"}>Alta</MenuItem>
                  <MenuItem value={"NAO INFORMADO"}>Não Informado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={clickLigacao}>Adicionar Ligação</Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={clickVisita}>Adicionar Visita</Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={clickAtendimento}>Adicionar Atendimento aos Pais</Button>
            </Grid>
            <Grid item xs={12}>
              <Popper open={openLig} anchorEl={anchorLig} placement="bottom" modifiers={[{ name: 'offset', options: { offset: [0, 40] } }]}>
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} style={{ borderRadius: "10px" }}>
                  <Grid container item xs={12} style={{ alignContent: "right", background: "lightgrey", borderRadius: "10px", padding: "10px" }}>
                    <Container maxWidth="xs">
                      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">
                          Informações sobre a ligação
                        </Typography>
                        <Box component="form" onSubmit={handleSubmitLig} sx={{ mt: 3 }}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="abae"
                            label="ABAE Responsável"
                            name="abae"
                            value={formData.abae}
                            onChange={handleChange}
                            autoComplete="ABAE Responsável"
                          />
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DateField
                              label="Data da Ligação"
                              value={formData.data}
                              onChange={(newDate) => handleDateChange(newDate)}
                            />
                          </LocalizationProvider>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="telefone"
                            label="Telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            autoComplete="Telefone"
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="observacao"
                            label="Observação"
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            autoComplete="Observação"
                          />
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Salvar
                          </Button>
                        </Box>
                      </Box>
                    </Container>
                  </Grid>
                </Box>
              </Popper>
            </Grid>
            <Grid item xs={12}>
              <Popper open={openVis} anchorEl={anchorVis} placement="bottom" modifiers={[{ name: 'offset', options: { offset: [0, 40] } }]}>
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} style={{ borderRadius: "10px" }}>
                  <Grid container item xs={12} style={{ alignContent: "right", background: "lightgrey", borderRadius: "10px", padding: "10px" }}>
                    <Container maxWidth="xs">
                      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">
                          Informações sobre a visita
                        </Typography>
                        <Box component="form" onSubmit={handleSubmitVis} sx={{ mt: 3 }}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="abae"
                            label="ABAE Responsável"
                            name="abae"
                            value={formData.abae}
                            onChange={handleChange}
                            autoComplete="ABAE Responsável"
                          />
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DateField
                              label="Data da Visita"
                              value={formData.data}
                              onChange={(newDate) => handleDateChange(newDate)}
                            />
                          </LocalizationProvider>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="observacao"
                            label="Observação"
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            autoComplete="Observação"
                          />
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Salvar
                          </Button>
                        </Box>
                      </Box>
                    </Container>
                  </Grid>
                </Box>
              </Popper>
            </Grid>
            <Grid item xs={12}>
              <Popper open={openAtendimento} anchorEl={anchorAtendimento} placement="bottom" modifiers={[{ name: 'offset', options: { offset: [0, 40] } }]}>
                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} style={{ borderRadius: "10px" }}>
                  <Grid container item xs={12} style={{ alignContent: "right", background: "lightgrey", borderRadius: "10px", padding: "10px" }}>
                    <Container maxWidth="xs">
                      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">
                          Informações sobre o Atendimento aos Pais
                        </Typography>
                        <Box component="form" onSubmit={handleSubmitAtendimento} sx={{ mt: 3 }}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="func"
                            label="Atendimento feito por"
                            name="func"
                            value={formData.func}
                            onChange={handleChange}
                            autoComplete="Atendimento feito por"
                          />
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DateField
                              label="Data do Atendimento"
                              value={formData.data}
                              onChange={(newDate) => handleDateChange(newDate)}
                            />
                          </LocalizationProvider>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="responsavel"
                            label="Responsável Presente"
                            name="responsavel"
                            value={formData.responsavel}
                            onChange={handleChange}
                            autoComplete="Responsável Presente"
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="observacao"
                            label="Observação"
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            autoComplete="Observação"
                          />
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Salvar
                          </Button>
                        </Box>
                      </Box>
                    </Container>
                  </Grid>
                </Box>
              </Popper>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>Histórico da Busca Ativa</Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button variant="contained" onClick={gerarRealatorio}>Gerar Relatório</Button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center", backgroundColor: '#d3d3d3', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
              para conseguir gerar um relatório, você precisa selecionar alguma ligação, visita ou atendimento aos pais
            </Grid>
            <Grid item xs={12}>
              <TabContext value={valueTabs}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChangeTabs} aria-label="tabs example">
                    <Tab label="Ligação" value="0" />
                    <Tab label="Visita" value="1" />
                    <Tab label="Atendimento aos Pais" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="0">
                  <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
                    <DataGrid
                      rows={rowsLig}
                      columns={columnsLig}
                      pageSize={5}
                      checkboxSelection
                      onRowSelectionModelChange={(ids) => {
                        const auxselectedRowsLig = ids.map((id) => rowsLig.find((row) => row.id === id));
                        setSelectedRowsLig(auxselectedRowsLig);
                      }}
                      rowSelectionModel={selectedRowsLig.map((row) => row.id)}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value="1">
                  <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
                    <DataGrid
                      rows={rowsVis}
                      columns={columnsVis}
                      pageSize={5}
                      checkboxSelection
                      onRowSelectionModelChange={(ids) => {
                        const auxselectedRowsVis = ids.map((id) => rowsVis.find((row) => row.id === id));
                        setSelectedRowsVis(auxselectedRowsVis);
                      }}
                      rowSelectionModel={selectedRowsVis.map((row) => row.id)}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
                    <DataGrid
                      rows={rowsAtendimento}
                      columns={columnsAtendimento}
                      pageSize={5}
                      checkboxSelection
                      onRowSelectionModelChange={(ids) => {
                        const auxselectedRowsAtendimento = ids.map((id) => rowsAtendimento.find((row) => row.id === id));
                        setSelectedRowsAtendimento(auxselectedRowsAtendimento);
                      }}
                      rowSelectionModel={selectedRowsAtendimento.map((row) => row.id)}
                    />
                  </Box>
                </TabPanel>
              </TabContext>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
