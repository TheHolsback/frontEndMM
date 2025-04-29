import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../Dashboard/internals/components/Copyright';
import ChartUserByCountry from './components/ChartUserByCountry';
import CustomizedTreeView from './components/CustomizedTreeView';
import CustomizedDataGrid from './components/CustomizedDataGrid';
import HighlightedCard from './components/HighlightedCard';
import MainBarChart from './components/BarChart';
import EvolucaoChart from './components/EvolucaoChart';
import StatCard from './components/StatCard';
import { accessAuthApi } from '../../services/authService';

export default function MainGrid() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    accessAuthApi('GET', '/main_board/statcard')
      .then(response => response.data)
      .then(data => {
        const formattedData = [
          {
            title: 'Melhor Rendimento - ' + data.best.nome,
            value: data.best.dados[data.best.dados.length - 1].valor.toFixed(4),
            interval: 'Últimos 20 dias úteis',
            trend: data.best.var < 0 ? 'down' : data.best.var > 0 ? 'up' : 'neutral',
            trendVar: (100*data.best.var).toFixed(2)+'%',
            data: data.best.dados.map(item => item.valor),
            dates: data.best.dados.map((item) => {
              const date = new Date(item.data);
              return date.toLocaleString('pt-BR', {timeZone: 'UTC',day: 'numeric', month: 'numeric', year: 'numeric' });
            }),
          },
          {
            title: 'Pior Rendimento - ' +data.worst.nome,
            value: data.worst.dados[data.worst.dados.length - 1].valor.toFixed(4),
            interval: 'Últimos 20 dias úteis',
            trend: data.worst.var < 0 ? 'down' : data.worst.var > 0 ? 'up' : 'neutral',
            trendVar:(100*data.worst.var).toFixed(2)+'%',
            data: data.worst.dados.map(item => item.valor),
            dates: data.worst.dados.map((item) => {
              const date = new Date(item.data);
              return date.toLocaleString('pt-BR', {timeZone: 'UTC',day: 'numeric', month: 'numeric', year: 'numeric' });
            })
          },
          {
            title: data.income.nome,
            value: data.income.dados[data.income.dados.length - 1].valor.toFixed(2),
            interval: 'Últimos 24 dados',
            trend: 'neutral',
            trendVar:(100*data.income.var).toFixed(2)+'%',
            data: data.income.dados.map(item => item.valor),
            dates: data.income.dados.map((item) => {
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
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
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
          <MainBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Últimas Movimentações
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid />
        </Grid>
        {/* <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
