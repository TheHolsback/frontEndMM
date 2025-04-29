import * as React from 'react';
import { DataGrid,  GridFooter } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import { Box, Button,Chip, TextField, InputAdornment, Typography } from '@mui/material';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';

function renderStatus(status) {
  const colors = {
    Ativo: 'success',
    Concluido: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

function CustomFooterComponent(props) {
  const theme = useTheme();
  const investimento = React.useMemo(() => {
        return props.rows.reduce((acc, row) => acc + row.valor, 0);
  }, [props.rows]);
  const livre = props.all-investimento;
  const porcInvest = (investimento/props.entrada.income)*100;
  const porcLivre = (livre/props.entrada.income)*100;
  return (
    <Box sx={{backgroundColor: theme.palette.background.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx = {{ marginLeft: 2 }}>
        {!props.showNext && (
          <Box sx = {{ marginLeft: 1, display: 'flex', direction: 'row', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<SkipNextRoundedIcon/>}
              onClick={props.handleGoals}
            >
              Calcular Ativos
            </Button>
            <Typography variant='h6' color='grey' sx={{ml:3}}>
              Investimento:
            </Typography>
            <Chip 
              size='.' 
              color={investimento<0?'error':investimento>0?'success':'default'}
              label={investimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              sx={{ml:1}}
            />
            <Chip 
            size='.' 
            color='default'
            label={`${porcInvest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`} 
            sx={{ml:0.5}}
            />
            <Typography variant='h6' color='grey' sx={{ml:3}}>
              Livre:
            </Typography>
            <Chip 
              size='.' 
              color={livre<0?'error':livre>0?'success':'default'}
              label={livre.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              sx={{ml:1}}
            />
            <Chip 
              size='.' 
              color='default'
              label={`${porcLivre.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`} 
              sx={{ml:0.5}}
            />
          </Box>
        )}
      </Box>
      <GridFooter {...props} />
    </Box>
  );
}

const ValorInput = ({ rowId, valorInicial, onValorUpdate }) => {
  const [valor, setValor] = React.useState(valorInicial.toFixed(2));

  const handleValorChange = (event) => {
    const novoValor = event.target.value.replace(',', '.');
    setValor(novoValor);
    onValorUpdate(rowId, parseFloat(novoValor));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 1.5 }}>
      <TextField
        type="text"
        value={valor}
        onChange={handleValorChange}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }
        }}
        sx={{
          width: '100%',
        }}
      />
    </Box>
  );
};

export default function GoalsDataGrid({loadInfo,infoData, onConfirm, sendInfo, onSendData, entrada }) {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [all,setAll] = React.useState(0);

  const columns = [
    { field: 'nome', headerName: 'Nome', autoWidth: true,},
    { field: 'finalizado', headerName: 'Status',autoWidth: true,renderCell: (params) => renderStatus(params.value),},
    { field: 'descricao', headerName: 'Descrição', flex:2,},
    { field: 'prioridade', headerName: 'Prioridade', autoWidth: true,align: 'center', },
    { field: 'data_final', headerName: 'Data Final', flex: 1,align: 'center', headerAlign:'center' },
    { field: 'valor', 
      headerName: 'Valor', 
      flex: 1.5,
      renderCell: (params) => (
        <ValorInput
          rowId={params.id}
          valorInicial={params.value}
          onValorUpdate={(id, novoValor) => {
            setRows((rows) =>
              rows.map((row) =>
                row.id === id ? { ...row, valor: novoValor } : row
              )
            );
          }}
        />
      ),
    },
  ];
  
  React.useEffect(() => {
    setRows(infoData);
    if (!all){
      setAll(entrada.income-entrada.goalsInput);
    };
    setLoading(!loadInfo);
  }, [infoData,loadInfo]);

  React.useEffect(()=>{
    onSendData('goals',rows);
  },[sendInfo]);

  const handleGoals = () => {
    const resultado = rows.map((row) => {
      if (row.valor > 0) {
        return { id: row.id, valor: row.valor };
      } else {
        return null;
      }
    }).filter((item) => item !== null);
    onConfirm(resultado);
  };

  return (
    <DataGrid
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="comfortable"
      loading={loading}
      slots={{
        // toolbar: GridToolbar,
        footer: CustomFooterComponent,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        footer: { showNext:loading, handleGoals, rows, all, entrada},
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
    );
}
