import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { accessAuthApi } from '../../../services/authService';
import { useParams } from 'react-router-dom';

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
  const [gradients, setGradients] = React.useState([]);
  const [media, setMedia] = React.useState(0);

  const { id_carteira } = useParams();

  const endpoint = id_carteira ? `/assets/evolutionchart/${id_carteira}/` : '/assets/evolutionchart';

  const colorPalette = React.useMemo(() => [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ], [theme]);

  React.useEffect(() => {
    accessAuthApi('GET', endpoint)
      .then(response => response.data)
      .then(dados => {
        const seriesData = dados.map((item, index) => ({
          id: item.nome,
          label: item.nome,
          showMark: false,
          curve: 'linear',
          // stack: 'none',
          area: true,
          // stackOrder: 'none',
          data: item.historico.map((historico) => historico.valor),
        }));

        const xAxisData = [
          {
            scaleType: 'point',
            data: dados[0].historico.map((item) => {
              const date = new Date(item.data);
              return date.toLocaleString('pt-BR', {timeZone: 'UTC',day:'numeric' ,month: 'numeric', year: 'numeric' })
            }),
          },
        ];
        const sxData = dados.reduce((acc, item, index) => {
          acc[`& .MuiAreaElement-series-${item.nome}`] = {
            fill: `url('#${item.nome}')`,
          };
          return acc;
        }, {});

        const gradientsData = dados.map((item, index) => (
          <AreaGradient key={item.nome} color={colorPalette[index%3]} id={item.nome} />
        ));

        const crescimentoMedio = seriesData.reduce((acc, serie) => {
          const primeiroValor = serie.data[0];
          const ultimoValor = serie.data[serie.data.length - 1];
          const variacao = (ultimoValor - primeiroValor) / primeiroValor;
          return acc + variacao;
        }, 0) / seriesData.length;

        setSeries(seriesData);
        setXAxis(xAxisData);
        setSx(sxData);
        setGradients(gradientsData);
        setMedia(crescimentoMedio);
      })
    .catch(error => {
        console.error(error);
        // Trate o erro aqui
      });
  }, [endpoint,colorPalette]);

  // const chipColor = media<0 ? 'error' : media>0 ? 'success' : 'warning';

  const currencyFormatter = (value) => value?value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'';
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
            {`${(media*100).toFixed(2)}%`}
            </Typography>
            {/* <Chip size="small" color={chipColor} label={(media*100).toFixed(2) + '%'} /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Evolução dos ativos nos Últimos 6 meses
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={xAxis}
          series={series.map((serie) => ({ ...serie, valueFormatter: currencyFormatter }))}
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
          {gradients}
        </LineChart>
      </CardContent>
    </Card>
  );
}
