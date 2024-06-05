import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import HeaderAdmin from './HeaderAdmin';
import Cookies from 'universal-cookie';

import './static/Dashboard.css';

export default function Dashboard() {
  const [casos, setCasos] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [urgenciaData, setUrgenciaData] = useState([]);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get('token');  // Obtenha o token após inicializar `Cookies`

  useEffect(() => {
    fetch('http://localhost:8000/casos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }
      return response.json();
    })
    .then(data => {
      setCasos(data.caso);
      processCaseData(data.caso);
    })
    .catch(error => {
      setError(error.message);
    });
  }, [token]);

  const processCaseData = (casos) => {
    const statusCounts = { 'EM ABERTO': 0, 'FINALIZADO': 0 };
    const urgenciaCounts = { 'ALTA': 0, 'MEDIA': 0, 'BAIXA': 0 };

    casos.forEach(caso => {
      statusCounts[caso.status]++;
      urgenciaCounts[caso.urgencia]++;
    });

    const statusData = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    const urgenciaData = Object.keys(urgenciaCounts).map(key => ({
      name: key,
      value: urgenciaCounts[key]
    }));

    setStatusData(statusData);
    setUrgenciaData(urgenciaData);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div>
      <HeaderAdmin />
      <Container className='dashboard'>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h4" component="h4">
                Status
              </Typography>
              <PieChart width={400} height={300}>
                <Pie dataKey="value" data={statusData} cx={200} cy={150} outerRadius={60} label={(entry) => entry.name}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend align="center" verticalAlign="bottom" layout="horizontal" iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
              </PieChart>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h4" component="h4">
                Prioridade
              </Typography>
              <PieChart width={400} height={300}>
                <Pie dataKey="value" data={urgenciaData} cx={200} cy={150} outerRadius={60} label={(entry) => entry.name}>
                  {urgenciaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend align="center" verticalAlign="bottom" layout="horizontal" iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
              </PieChart>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
