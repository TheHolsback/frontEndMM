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
  const [sx, setSx] = React.useState({});
  const [variacao, setVariacao] = React.useState(0);

  React.useEffect(() => {
    accessAuthApi('GET', '/main_board/evolutionchart')
      .then(response => response.data)
      .then(dados => {
        const allMonths = new Set();
        const series = [];

        // Coleta todos os meses únicos
        Object.values(dados).forEach(items => {
          items.forEach(item => {
            const date = new Date(item.Data);
            const formattedMonth = date.toLocaleString('pt-BR', { timeZone: 'UTC', month: 'short', year: 'numeric' });
            allMonths.add(formattedMonth);
          });
        });

        const sortedMonths = Array.from(allMonths).sort((a, b) => {
          const [monthA, yearA] = a.split(' ');
          const [monthB, yearB] = b.split(' ');
          return new Date(yearA, new Date(`${monthA} 1`).getMonth()) - new Date(yearB, new Date(`${monthB} 1`).getMonth());
        });

        // Preenche os dados para cada série
        Object.keys(dados).forEach(key => {
          const dataMap = new Map();
          dados[key].forEach(item => {
            const date = new Date(item.Data);
            const formattedMonth = date.toLocaleString('pt-BR', { timeZone: 'UTC', month: 'short', year: 'numeric' });
            dataMap.set(formattedMonth, item.Valor);
          });

          const filledData = sortedMonths.map(month => dataMap.get(month) || 0);
          series.push({
            id: key,
            label: key,
            showMark: false,
            curve: 'linear',
            area: true,
            data: filledData,
          });
        });

        setData(series);
        setMeses(sortedMonths);

        const sxData = Object.keys(dados).reduce((acc, key) => {
          acc[`& .MuiAreaElement-series-${key}`] = {
            fill: `url('#${key}')`,
          };
          return acc;
        }, {});
        setSx(sxData);

        // Calcula a variação
        const ultimoMes = sortedMonths[sortedMonths.length - 1];
        const penultimoMes = sortedMonths[sortedMonths.length - 2];
        let entradaUltimoMes = 0, saidaUltimoMes = 0, entradaPenultimoMes = 0, saidaPenultimoMes = 0;

        Object.keys(dados).forEach(key => {
          dados[key].forEach(item => {
            const date = new Date(item.Data);
            const formattedMonth = date.toLocaleString('pt-BR', { timeZone: 'UTC', month: 'short', year: 'numeric' });
            if (formattedMonth === penultimoMes) {
              if (key === 'Entrada') entradaPenultimoMes = item.Valor;
              if (key === 'Custos') saidaPenultimoMes = item.Valor;
            } else if (formattedMonth === ultimoMes) {
              if (key === 'Entrada') entradaUltimoMes = item.Valor;
              if (key === 'Custos') saidaUltimoMes = item.Valor;
            }
          });
        });

        setUltimoMes(saidaUltimoMes*100 / entradaUltimoMes);
        const variacaoCalculada = (saidaUltimoMes / entradaUltimoMes) - (saidaPenultimoMes / entradaPenultimoMes);
        setVariacao(variacaoCalculada);
      })
      .catch(error => console.error('Erro ao fazer requisição:', error));
  }, []);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];
  const chipColor = variacao < 0 ? 'success' : variacao > 0 ? 'error' : 'warning';
  const percentFormatter = (v) => (v === null ? '' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

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
              {`${ultimoMes.toFixed(2)}%`}
            </Typography>
            <Chip size="small" color={chipColor} label={(variacao * 100).toFixed(2) + '%'} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Evolução % dos custos em relação as entradas dos Últimos 12 meses
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
          sx={sx}
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
