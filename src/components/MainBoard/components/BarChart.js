import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';

export default function MainBarChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  const labelColors = {
    up: 'success',
    down: 'error',
    neutral: 'default',
  };

  const [series, setSeries] = React.useState([]);
  const [xAxis, setxAxis] = React.useState([]);
  const [livre,setLivre] = React.useState(0);
  const [variacao,setVariacao] = React.useState(0);

  React.useEffect(() => {
    accessAuthApi('GET', '/main_board/barchart')
      .then(response => {
        const data = response.data;
        const dataSeries = [
          {
            id: 'livre',
            label: 'Livre',
            data: data.valor_livre,
            stack: 'A',
          },
          {
            id: 'custos',
            label: 'Custos',
            data: data.valor_custos,
            stack: 'A',
          },
          {
            id: 'objetivos',
            label: 'Objetivos',
            data: data.valor_objetivos,
            stack: 'A',
          },
        ];
      const free = data.valor_objetivos[0]+data.valor_livre[0]-data.valor_custos[0];
      const free2 = data.valor_objetivos[1]+data.valor_livre[1]-data.valor_custos[1];
      const vari = ((free/free2)-1)*100;
      
      const dataXAxis=[{
        scaleType: 'band',
        categoryGapRatio: 0.5,
        data: data.mes.map(m =>{
          const date = new Date(m);
          return date.toLocaleString('pt-BR', {timeZone: 'UTC', month: 'short',year:'numeric'});
          })
        },
        ];
        setSeries(dataSeries);
        setxAxis(dataXAxis);
        setLivre(free);
        setVariacao(vari);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const color = labelColors[variacao>0?'up':variacao<0?'down':'default'];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
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
            <Typography variant="h4" component="p">
              {livre.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            <Chip size="small" color={color} label={`${variacao.toFixed(2)}%`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Separação do Patrimônio
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={xAxis}
          series={series}
          height={250}
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
