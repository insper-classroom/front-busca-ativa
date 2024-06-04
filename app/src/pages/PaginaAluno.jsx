import { Button, Container, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Box, Popper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';

export function PaginaAluno() {
    const [idAluno, setIdAluno] = useState();
    const [dataAluno, setDataAluno] = useState();
    const [dataCasos, setDataCasos] = useState([]);
    const [urgencia, setUrgencia] = useState('');
    const [status, setStatus] = useState('');
    const cookies = new Cookies();
    const token = cookies.get('token');

    const [formData, setFormData] = useState({
        abae: '',
        data: dayjs(),
        telefone: '',
        observacao: '',
    });

    useEffect(() => {
        loadAluno();
        loadCasos();
    }, []);


    function loadAluno() {
        //TODO pegar o id do aluno  
        fetch('http://localhost:8000/alunoBuscaAtiva/665f7299a799887b997bcb72', {
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

    function loadCasos() {
        //TODO pegar o id do aluno
        fetch('http://localhost:8000/casos?aluno_id=665f7299a799887b997bcb72', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.caso.urgencia)
                setDataCasos(data.caso);
                setStatus(data.caso.status)
                setUrgencia(data.caso.urgencia)
            })
            .catch(response => {
                alert('Erro ao achar os casos do aluno!');
                alert(response.status);
            });
    }

    const [anchorLig, setAnchorLig] = useState(null);
    const [anchorVis, setAnchorVis] = useState(null);
    const openLig = Boolean(anchorLig);
    const openVis = Boolean(anchorVis);

    function clickLigacao(event) {
        setAnchorLig(anchorLig ? null : event.currentTarget);
    }

    function clickVisita(event) {
        setAnchorVis(anchorVis ? null : event.currentTarget);
    }

    const handleChangeStatus = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        clickSU(newStatus, urgencia);
    };

    const handleChangeUrgencia = (event) => {
        const newUrgencia = event.target.value
        setUrgencia(newUrgencia);
        clickSU(status, newUrgencia)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            data: date,
        });
    };

    function clickSU(newStatus, newUrgencia) {
        const casoData = {
            urgencia: newUrgencia,
            status: newStatus,
        }
   

        fetch('http://localhost:8000/casos/' + dataCasos._id , {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(casoData),
        }).then(response => {
            if (!response.ok){
              throw new Error('Erro ao atualizar informações do caso');
            }
            alert('Informações atualizadas com sucesso');
    
        }).catch(response => {
            alert('Erro ao atualizar informações do caso');
            alert(response.status);
        })
    }
    

    
    const handleSubmitLig = async (e) => {
        e.preventDefault();
        const casoData = {
            abae: formData.abae,
            data: formData.data,
            telefone: formData.telefone,
            observacao: formData.observacao,
            //TODO pegar o id do aluno
            aluno: "665f7299a799887b997bcb72",
            ligacao: true,
            visita: false,

        };
        try {
            const response = await fetch('http://127.0.0.1:8000/casos' + dataCasos._id, {
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
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar o caso');
        }
    };

    const handleSubmitVis = async (e) => {
        e.preventDefault();
        const casoData = {
            abae: formData.abae,
            data: formData.data,
            observacao: formData.observacao,
            //TODO pegar o id do aluno
            aluno: "665f7299a799887b997bcb72",
            ligacao: false,
            visita: true,

        };
        try {
            const response = await fetch('http://127.0.0.1:8000/casos', {
                method: 'POST',
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
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar o caso');
        }
    };

    return (
        <div className='card'>
            <Grid container columnSpacing={2} rowSpacing={1}>
                <Grid item xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
                    Informações do Aluno
                </Grid>
                <Grid item xs={12} style={{ paddingTop: "40px", margin: "0px 100px" }}>
                    <Grid container spacing={2} style={{ textAlign: "center", border: "1px solid black", borderRadius: "10px" }}>
                        <Grid item xs={4}>Nome: {dataAluno?.nome}</Grid>
                        <Grid item xs={4}>Turma: {dataAluno?.turma}</Grid>
                        <Grid item xs={4}>RA: {dataAluno?.RA}</Grid>
                        <Grid item xs={6}>Endereço: {dataAluno?.endereco}</Grid>
                        <Grid item xs={6}>Telefone: {dataAluno?.telefone}</Grid>
                        
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center", paddingTop: "50px", margin: "0px 100px" }}>
                    <Grid container spacing={2} style={{ textAlign: "center", border: "1px solid black", borderRadius: "10px" }}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>Ficha do Aluno</Grid>
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
                                >
                                    <MenuItem value={"BAIXA"}>Baixa</MenuItem>
                                    <MenuItem value={"MEDIA"}>Média</MenuItem>
                                    <MenuItem value={"ALTA"}>Alta</MenuItem>
                                    <MenuItem value={"NAO INFORMADO"}>Não Informado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={clickLigacao}>Adicionar Ligação</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={clickVisita}>Adicionar Visita</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Popper open={openLig} anchorEl={anchorLig} placement="bottom" modifiers={[{ name: 'offset', options: { offset: [0, 40] } }]} >
                                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} style={{borderRadius:"10px"}}>
                                    <Grid container item xs={12} style={{ alignContent: "rigth", background: "lightgrey", borderRadius: "10px", padding: "10px" }}>
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
                                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} style={{borderRadius:"10px"}} >
                                    <Grid container item xs={12} style={{ alignContent: "rigth", background: "lightgrey", borderRadius: "10px", padding: "10px" }}>
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
                        <Grid item xs={12} style={{ textAlign: "center" }}>Histórico da Busca Ativa</Grid>
                    </Grid>
                    
                </Grid>
            </Grid>
        </div>
    );
}
