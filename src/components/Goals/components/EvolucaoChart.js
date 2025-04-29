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

function AreaGradient({ color, id }) {
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
  const [series, setSeries] = React.useState([]);
  const [xAxis, setXAxis] = React.useState([]);
  const [sx, setSx] = React.useState({});
  const [variacao, setVariacao] = React.useState(0);
  const [fim, setFim] = React.useState(0);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  React.useEffect(() => {
    accessAuthApi('GET', '/goals/evolutionchart')
    .then(response => response.data)
    .then(dados => {
      const datas = [];
      const dates =[];
      let start = 0;
      let end = 0;
      Object.keys(dados).forEach(key => {
        dados[key].forEach(item => {
          const date = new Date(item.Data);
          const formattedDate = date.toLocaleString('pt-BR', {timeZone: 'UTC',day: 'numeric', month: 'numeric', year: 'numeric' });
          if (!dates.includes(formattedDate)) {
            dates.push(formattedDate);
          }
        });

        const data = {
          id: key,
          label: key,
          showMark: false,
          curve: 'linear',
          stack: 'total',
          area: true,
          stackOrder: 'ascending',
          data: dados[key].map(item => item.Valor*100),
        };
        datas.push(data);
        
        start += dados[key][0].Valor;

        end += dados[key][dados[key].length - 1].Valor;
      
      });

      const sxData = Object.keys(dados).reduce((acc, key, index) => {
        acc[`& .MuiAreaElement-series-${key}`] = {
          fill: `url('#${key}')`,
        };
        return acc;
      }, {});      
      
      setSeries(datas);
      setXAxis(dates);
      setSx(sxData);
      setVariacao(end-start);
      setFim(end);
    })
    .catch(error => console.error('Erro ao fazer requisição:', error));
  }, []);

  const chipColor = variacao>0 ? 'success' : variacao<0 ? 'error' : 'warning';
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
              {`${(fim*100).toFixed(3)}%`}
            </Typography>
            <Chip size="small" color={chipColor} label={(100*variacao).toFixed(3) + '%'}/>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Evolução em % dos objetivos dos Últimos 6 meses
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: xAxis,
            },
          ]}
          series={series.map((serie) => ({ ...serie, valueFormatter: percentFormatter }))}
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
        {series.map((serie, index) => (
            <AreaGradient key={index} color={colorPalette[index%3]} id={serie.id} />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
