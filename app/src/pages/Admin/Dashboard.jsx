import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { BarChart } from '@mui/x-charts/BarChart';
import HeaderAdmin from './HeaderAdmin';
import Cookies from 'universal-cookie';
import './static/Dashboard.css';

/**
 * Componente principal do Dashboard.
 * Responsável por exibir gráficos e dados estatísticos sobre os casos registrados.
 */
export default function Dashboard() {
  const [casos, setCasos] = useState([]);  // Estado para armazenar os casos
  const [statusData, setStatusData] = useState([]);  // Estado para armazenar dados de status dos casos
  const [urgenciaData, setUrgenciaData] = useState([]);  // Estado para armazenar dados de urgência dos casos
  const [turmaData, setTurmaData] = useState([]);  // Estado para armazenar dados de turma dos casos
  const [error, setError] = useState(null);  // Estado para armazenar erros
  const cookies = new Cookies();  // Instância de Cookies para obter o token
  const token = cookies.get('token');  // Obtenção do token

  // Hook para buscar os dados dos casos quando o componente é montado
  useEffect(() => {
    fetch('http://127.0.0.1:8000/casos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch cases');  // Lançamento de erro se a resposta não for bem sucedida
      }
      return response.json();
    })
    .then(data => {
      setCasos(data.caso);  // Armazena os casos no estado
      processCaseData(data.caso);  // Processa os dados dos casos para os gráficos
    })
    .catch(error => {
      setError(error.message);  // Armazena a mensagem de erro no estado
    });
  }, [token]);

  // Função para processar os dados dos casos e preparar para os gráficos
  const processCaseData = (casos) => {
    const statusCounts = { 'EM ABERTO': 0, 'FINALIZADO': 0 };  // Contagem de status dos casos
    const urgenciaCounts = { 'ALTA': 0, 'MEDIA': 0, 'BAIXA': 0, 'NAO INFORMADO': 0 };  // Contagem de urgência dos casos
    const turmaCounts = {};  // Contagem de casos por turma

    // Iteração pelos casos para preencher as contagens
    casos.forEach(caso => {
      statusCounts[caso.status]++;
      urgenciaCounts[caso.urgencia]++;
      const turma = caso.aluno.turma;
      if (!turmaCounts[turma]) {
        turmaCounts[turma] = 0;
      }
      turmaCounts[turma]++;
    });

    // Prepara os dados para os gráficos de status, urgência e turma
    const statusData = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    const urgenciaData = Object.keys(urgenciaCounts).map(key => ({
      name: key,
      value: urgenciaCounts[key]
    }));

    const turmaData = Object.keys(turmaCounts).map(key => ({
      name: key,
      value: turmaCounts[key]
    }));

    // Armazena os dados preparados no estado
    setStatusData(statusData);
    setUrgenciaData(urgenciaData);
    setTurmaData(turmaData);
  };

  const COLORS = ['#007bff', '#FBD542', '#008000', '#05263E'];  // Cores para os gráficos

  return (
    <div>
      <HeaderAdmin />  
      <Container className='dashboard'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography 
              variant="h4" 
              component="h4" 
              style={{ 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 'bold', 
                textTransform: 'uppercase', 
                color: '#333', 
              }}
            >
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6" component="h6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                Total de Casos: {casos.length} 
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h5" component="h5" style={{ marginBottom: '20px' }}>
                Status dos Casos
              </Typography>
              <PieChart width={300} height={300}>
                <Pie dataKey="value" data={statusData} cx={200} cy={150} outerRadius={80} label={(entry) => entry.name}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  // Define as cores das fatias do gráfico
                  ))}
                </Pie>
                <Tooltip />  
                <Legend align="center" verticalAlign="bottom" layout="horizontal" iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
              </PieChart>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h5" component="h5" style={{ marginBottom: '20px' }}>
                Prioridade dos Casos
              </Typography>
              <PieChart width={400} height={300}>
                <Pie dataKey="value" data={urgenciaData} cx={200} cy={150} outerRadius={80} label={(entry) => entry.name}>
                  {urgenciaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend align="center" verticalAlign="bottom" layout="horizontal" iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
              </PieChart>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h5" component="h5" style={{ marginBottom: '20px' }}>
                Casos por Turma
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: turmaData.map(item => item.name) }]}
                  series={[{ data: turmaData.map(item => item.value) }]}
                  width={600}
                  height={400}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
