import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';

export default function GoalsBarChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.light,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.dark,
  ];

  const [data, setData] = React.useState({});

  React.useEffect(() => {
    accessAuthApi('GET', '/goals/barchart')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const series = [
    {
      id: 'acumulado',
      label: 'Acumulado',
      data: Object.keys(data).map(key => data[key][0].Acumulado),
      valueFormatter:(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      stack: 'A',
    },
    {
      id: 'restante',
      label: 'Restante',
      data: Object.keys(data).map(key => data[key][0].Restante),
      valueFormatter:(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      stack: 'A',
    },
  ];

  const xAxis = [
    {
      scaleType: 'band',
      categoryGapRatio: 0.5,
      data: Object.keys(data),
    },
  ];
  const yAxis=[
    {
      valueFormatter: (value) => {
        if (value>=100000){
          return `${(value / 1000).toLocaleString()}k`
        }else{
          return `${value}`
        }
      },
    },
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%', height:'100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Resumo Financeiro
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Valor acumulado em cada objetivo
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={xAxis}
          yAxis={yAxis}
          series={series}
          height={275}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}