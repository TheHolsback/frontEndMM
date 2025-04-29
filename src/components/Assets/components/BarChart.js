import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';
import { useParams } from 'react-router-dom';

export default function PageViewsBarChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];
  const { id_carteira } = useParams();
  
  const endpoint = id_carteira ? `/assets/barchart/${id_carteira}/` : '/assets/barchart';
  
  const [series, setSeries] = React.useState([]);
  
  React.useEffect(() => {
    accessAuthApi('GET', endpoint)
      .then(response => {
        const dados = response.data;
        setSeries(dados);
    })
    .catch(error => {
      console.error(error);
    });
  }, [endpoint]);

  const ativos = series.map((dado) => dado.nome);
  const valores = series.map((dado) => dado.financeiro);
  const valorLiquido = valores.reduce((acumulado, valor) => acumulado + valor, 0);

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
            {valorLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            {/* <Chip size="small" color="error" label="-8%" /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Valor acumulado em cada ativo
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: ativos,
            },
          ]}
          series={[
            {
              id: 'financeiro',
              label: 'Valor Financeiro',
              data: valores,
              stack: 'A',
              valueFormatter:(value) => value?value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):0,
            },
          ]}
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
