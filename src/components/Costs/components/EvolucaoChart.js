import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { accessAuthApi } from '../../../services/authService';

function AreaGradient({ color, id }) {''
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function EvolucaoChart() {
  const theme = useTheme();
  const [data, setData] = React.useState([]);
  const [meses, setMeses] = React.useState([]);
  const [ultimoMes, setUltimoMes] = React.useState(0);
  const [variacao, setVariacao] = React.useState(0);

  React.useEffect(() => {
    accessAuthApi('GET', '/costs/evolutionchart')
      .then(response => response.data)
      .then(dados => {
        const allDates = new Set();
        const seriesData = [];

        // Collect all unique dates
        Object.values(dados).forEach(category => {
          category.forEach(entry => allDates.add(entry.Data));
        });

        const sortedDates = Array.from(allDates).sort();

        // Prepare data for each category
        Object.entries(dados).forEach(([category, values]) => {
          const dataMap = new Map(values.map(entry => [entry.Data, entry.Valor]));
          const formattedData = sortedDates.map(date => dataMap.get(date) || null);
          seriesData.push({ 
            id: category, 
            label: category,
            showMark: false,
            curve: 'linear',
            area: true,
            data: formattedData });
        });

        setMeses(sortedDates.map(date => new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })));
        setData(seriesData);

        // Calculate ultimoMes and variacao
        const lastMonthValues = seriesData.map(serie => serie.data[serie.data.length - 1] || 0);
        const secondLastMonthValues = seriesData.map(serie => serie.data[serie.data.length - 2] || 0);
        const totalLastMonth = lastMonthValues.reduce((sum, val) => sum + val, 0);
        const totalSecondLastMonth = secondLastMonthValues.reduce((sum, val) => sum + val, 0);

        setUltimoMes(totalLastMonth);
        setVariacao(((totalLastMonth - totalSecondLastMonth) / totalSecondLastMonth) * 100 || 0);
      })
      .catch(error => console.error('Erro ao fazer requisição:', error));
  }, []);


  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];
  const chipColor = variacao>0 ? 'error' : variacao<0 ? 'success' : 'warning';
  const percentFormatter = (v) => (v === null ? '' : `${v.toFixed(3)}%`);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Evolução
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
            <Typography variant="h4" component="p">
              {ultimoMes.toFixed(2) + '%'}
            </Typography>
            <Chip size="small" color={chipColor} label={variacao.toFixed(2) + '%'} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Evolução % dos custos recorrentes em relação da entrada dos Últimos 12 meses
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: meses,
            },
          ]}
          series={data.map((serie) => ({ ...serie, valueFormatter: percentFormatter }))}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-Dívidas': {
              fill: "url('#Dívidas')",
            },
            '& .MuiAreaElement-series-Educação': {
              fill: "url('#Educação')",
            },
            '& .MuiAreaElement-series-Saúde': {
              fill: "url('#Saúde')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          {data.map((serie, index) => (
            <AreaGradient key={index} color={colorPalette[index % 3]} id={serie.id} />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
