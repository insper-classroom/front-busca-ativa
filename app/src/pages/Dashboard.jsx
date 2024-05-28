import React from 'react';
import { Container, Typography, Grid, Paper, AppBar, Toolbar } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';



export default function Dashboard() {
  const data = [
    { id: "a", value: 10, name: 'series A' },
    { id: "b", value: 15, name: 'series B' },
    { id: "c", value: 20, name: 'series C' },
  ];

  return (

    <Container>
      <Typography variant="h1">Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h4" component="h4">
              Status
            </Typography>
            <PieChart width={400} height={300}>
              <Pie dataKey="value" data={data} cx={200} cy={150} outerRadius={60} label={(entry) => entry.name}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                align="center" 
                verticalAlign="bottom" 
                layout="horizontal" 
                iconType="circle" 
                wrapperStyle={{ paddingTop: 10 }} 
              />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h4" component="h4">
              Prioridade
            </Typography>
            <PieChart width={400} height={300}>
              <Pie dataKey="value" data={data} cx={200} cy={150} outerRadius={60} label={(entry) => entry.name}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                align="center" 
                verticalAlign="bottom" 
                layout="horizontal" 
                iconType="circle" 
                wrapperStyle={{ paddingTop: 10 }} 
              />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h4" component="h4">
              Status
            </Typography>
            <PieChart width={400} height={300}>
              <Pie dataKey="value" data={data} cx={200} cy={150} outerRadius={60} label={(entry) => entry.name}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                align="center" 
                verticalAlign="bottom" 
                layout="horizontal" 
                iconType="circle" 
                wrapperStyle={{ paddingTop: 10 }} 
              />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h4" component="h4">
              Buscas Ativas por turma
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h4" component="h4">
              Buscas bem sucessidas
            </Typography>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
