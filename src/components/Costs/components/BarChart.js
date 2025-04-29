import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';

export default function CostsBarChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  const [series, setSeries] = React.useState([]);
  const [xAxis, setXAxis] = React.useState([]);
  const [financeiro, setFinanceiro] = React.useState(0);

  React.useEffect(() => {
    accessAuthApi('GET', '/costs/barchart')
      .then(response => {
        const dados = response.data;
        const categorias = dados.map(dado => dado.nome);
        const valores = dados.map(dado => dado.valor);
        const sumValores = valores.reduce((acumulado, valor) => acumulado + valor, 0);
        setFinanceiro(sumValores);
        setXAxis([
          {
            scaleType: 'band',
            categoryGapRatio: 0.5,
            data: categorias,
            hidetTooltip: true
          },
        ]);

        // Crie duas séries: uma para os valores e outra para os somatórios
        setSeries([
          {
            id: 'financeiro',
            label: 'Valor Financeiro',
            data: valores,
            stack: 'A',
            valueFormatter:(value) => value?value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):0,
          },
        ]);

      })
      .catch(error => {
        console.error(error);
      });
  }, []);

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
              {financeiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            {/* <Chip size="small" color="error" label="-8%" /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Valor acumulado no mês corrente
          </Typography>
        </Stack>
        <BarChart
          borderRadius={5}
          colors={colorPalette}
          xAxis={xAxis}
          series={series}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          tooltip={{ }}
          slotProps={{
            legend: {
              hidden: true,
            }
          }}
        />
      </CardContent>
    </Card>
  );
}