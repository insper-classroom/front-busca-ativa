import { Button, Container, Grid, colors } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



export function PaginaAluno() {

    const [idAluno, setIdAluno] = useState()
    const [dataAluno, setDataAluno] = useState()
    const [dataCasos, setDataCasos] = useState([])
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        loadAluno()
        loadCasos()
      }, [])

    function loadAluno(){

        fetch('http://localhost:8000/alunoBuscaAtiva/66550f9be52fb814fe1fef1f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            }).then(response => {
            return response.json()
            }).then(data => {
            setDataAluno(data)
            }).catch(response => {
            alert('Erro ao achar aluno!')
            alert(response.status)
            })
    

    }

    function loadCasos(){
        
            fetch('http://localhost:8000/casos?aluno_id=66550f9be52fb814fe1fef1f',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                }).then(response => {
                return response.json()
                }).then(data => {
                    console.log(data)
                setDataCasos(data.caso)
                }).catch(response => {
                alert('Erro ao achar os casos do aluno!')
                alert(response.status)
                })
    }


    return (
        <div className='card'>
            <Grid container columnSpacing={2} rowSpacing={1}>
                <Grid item xs={12} style={{textAlign: "center", paddingTop:"50px"}}>
                    Informações do Aluno
                </Grid>
                <Grid item xs={12} style={{paddingTop: "40px", margin: "0px 100px"}}>
                    <Grid container spacing={2} style={{textAlign: "center", border: "1px solid black", borderRadius:"10px"}}>
                        <Grid item xs={4}>Nome: {dataAluno?.nome}</Grid>
                        <Grid item xs={4}>Turma: {dataAluno?.turma}</Grid>
                        <Grid item xs={4}>RA: {dataAluno?.RA}</Grid>
                        <Grid item xs={6}>Endereço: {dataAluno?.endereco}</Grid>
                        <Grid item xs={6}>Telefone: {dataAluno?.telefone}</Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{textAlign: "center", paddingTop:"50px", margin: "0px 100px"}}>
                    <Accordion style={{border:"1px solid black"}}>
                        <AccordionSummary
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                        Casos Antigos
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                            dataCasos.map((caso, index) => {
                            return(
                            <Accordion key={index}>
                                <AccordionSummary>
                                    Caso {caso.data}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2} style={{ textAlign: "center", border: "1px solid black", borderRadius: "10px" }}>
                                        <Grid item xs={6} style={{padding:"0px"}}>
                                            <Button>Ver ficha</Button>
                                        </Grid>
                                        <Grid item xs={6} style={{padding:"0px"}}>
                                            <Button>Gerar Relátorio</Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            )
                            })
                        
                            }
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded style={{border:"1px solid black"}}>
                        <AccordionSummary
                        aria-controls="panel3-content"
                        id="panel3-header"
                        >
                        Caso Atual
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2} style={{ textAlign: "center", border: "1px solid black", borderRadius: "10px" }}>
                                <Grid item xs={12} style={{textAlign:"center"}}>Ficha do Aluno</Grid>
                                <Grid item xs={12} style={{textAlign:"center"}}>Histórico da Busca Ativa</Grid>
                                <Grid item xs={12}>Ligações</Grid>
                                <Grid container item xs={12} style={{alignContent:"rigth", background:"lightgrey", borderRadius: "10px" }}>
                                    <Grid item xs={3} style={{textAlign:"left"}}>ABAE Responsável</Grid>
                                    <Grid item xs={8}>Obersavações</Grid>
                                    <Grid item xs={3} style={{textAlign:"left"}}>
                                    <input></input>
                                    </Grid>
                                    <Grid item xs={8} >
                                    <input style={{height:"50px"}}></input>
                                    </Grid>
                                    <Grid item xs={8} style={{textAlign:"left"}}>
                                    <input style={{height:"50px"}}></input>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </div>
    );
    
    
}
