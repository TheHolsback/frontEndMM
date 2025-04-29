import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../Dashboard/internals/components/Copyright';
import ChartUserByCountry from './components/ChartUserByCountry';
import AddGoal from './components/AddGoal';
import GoalsDataGrid from './components/GoalsDataGrid';
import HighlightedCard from './components/HighlightedCard';
import GoalsBarChart from './components/BarChart';
import EvolucaoChart from './components/EvolucaoChart';
import StatCard from './components/StatCard';
import { accessAuthApi } from '../../services/authService';

export default function Goals() {
  const [data, setData] = React.useState([]);
    
  React.useEffect(() => {
    accessAuthApi('GET', '/goals/statcard')
      .then(response => response.data)
      .then(data => {
        const formattedData = [
          {
            title: 'Maior Evolução - ' + data.best.nome,
            value: data.best.dados[data.best.dados.length - 1].financeiro,
            interval: `${data.best.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nÚltimos 20 dias úteis`,
            trend: data.best.var < 0 ? 'down' : data.best.var > 0 ? 'up' : 'neutral',
            trendVar: (100*data.best.var).toFixed(2)+'%',
            data: data.best.dados.map(item => item.financeiro),
            dates: data.best.dados.map((item) => {
              const date = new Date(item.data);
              return date.toLocaleString('pt-BR', {timeZone: 'UTC',day: 'numeric', month: 'numeric', year: 'numeric' });
            }),
          },
          {
            title: 'Menor Evolução - ' +data.worst.nome,
            value: data.worst.dados[data.worst.dados.length - 1].financeiro,
            interval: `${data.worst.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nÚltimos 20 dias úteis`,
            trend: data.worst.var < 0 ? 'down' : data.worst.var > 0 ? 'up' : 'neutral',
            trendVar:(100*data.worst.var).toFixed(2)+'%',
            data: data.worst.dados.map(item => item.financeiro),
            dates: data.worst.dados.map((item) => {
              const date = new Date(item.data);
              return date.toLocaleString('pt-BR', {timeZone: 'UTC',day: 'numeric', month: 'numeric', year: 'numeric' });
            })
          },
          {
            title: 'Todos os Objetivos',
            value: data.all.dados[data.all.dados.length - 1].financeiro,
            interval: `${data.all.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nÚltimos 20 dias úteis`,
            trend: data.all.var < 0 ? 'down' : data.all.var > 0 ? 'up' : 'neutral',
            trendVar:(100*data.all.var).toFixed(2)+'%',
            data: data.all.dados.map(item => item.financeiro),
            dates: data.all.dados.map((item) => {
              const date = new Date(item.data);
              return date.toLocaleString('pt-BR', {timeZone: 'UTC',day: 'numeric', month: 'numeric', year: 'numeric' });
            })
          },
        ];
        setData(formattedData);
      })
      .catch(error => {
        console.error('Erro ao fazer requisição:',error);
        window.location.reload();
      });
  }, []);
  
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Objetivos
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EvolucaoChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GoalsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Detalhes dos Objetivos
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <GoalsDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <AddGoal />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
