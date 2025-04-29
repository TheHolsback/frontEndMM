import * as React from 'react';
import { DataGrid, GridFooter } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import { Box, Button, Chip, TextField, InputAdornment, Typography } from '@mui/material';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';

function renderStatus(status,color) {
  const colors = {
    Ativo: 'success',
    Expirado: 'default',
    Usado: 'error',
  };

  return <Chip label={status} color={colors[color]} size="small" />;
}

const ValorInput = ({ rowId, valorUsado, valorInicial, onValorUpdate }) => {
  var valorUsadoFloat = 0;
  if (valorUsado){
    valorUsadoFloat = parseFloat(valorUsado.replace(/R\$|\./g, '').replace(",", "."));
  }else{
    valorUsadoFloat = 0;
  };

  const [valor, setValor] = React.useState(valorInicial.toFixed(2));
  const [isError,setIsError] = React.useState(valorUsadoFloat>valorInicial);

  const handleValorChange = (event) => {
    const novoValor = event.target.value.replace(',', '.');
    setValor(novoValor);
    onValorUpdate(rowId, parseFloat(novoValor));
    setIsError(valorUsadoFloat>novoValor);
  };

  return (
    <TextField
      error={isError}
      helperText={isError ? "Valor inválido" : ""}
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
        "& .MuiInputBase-root": {
          height: 40,
        },
        "& .MuiOutlinedInput-root": {    
          "&.Mui-error": {
            borderColor: "red", // Define borda vermelha manualmente
          },
        },
        "& .MuiFormHelperText-root": {
          marginTop: "-2px", // Move o texto um pouco mais para cima
        },
        paddingTop: 1.5,
      }}
    />
  );
};

function CustomFooterComponent(props) {
  const theme = useTheme();
  const valorFinanceiro = React.useMemo(() => {
      return props.rows.reduce((acc, row) => acc + row.valor, 0);
    }, [props.rows]);
  const maximo = props.entrada.divisao?props.entrada.entrada*props.entrada.divisao[0]:0;
  const porc  = (valorFinanceiro/props.entrada.entrada)*100;
  return (
    <Box sx={{backgroundColor: theme.palette.background.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx = {{ marginLeft: 1 }}>
        {!props.showNext && (
          <Box sx = {{ marginLeft: 1, display: 'flex', direction: 'row', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<SkipNextRoundedIcon/>}
              onClick={props.handleCosts}
            >
              Calcular Objetivos
            </Button>
            <Typography variant='h6' color='grey' sx={{ml:3}}>
              Max:
            </Typography>
            <Chip 
              size='.' 
              color='default'
              label={maximo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              sx={{ml:1}}
            />
            <Typography variant='h6' color='grey' sx={{ml:3}}>
              Total:
            </Typography>
            <Chip 
              size='.' 
              color={maximo<valorFinanceiro?'error':maximo>valorFinanceiro?'success':'default'}
              label={valorFinanceiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              sx={{ml:1}}
            />
            <Chip 
              size='.' 
              color='default'
              label={`${porc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`} 
              sx={{ml:0.5}}
            />
          </Box>
        )}
      </Box>
      <GridFooter {...props} />
    </Box>
  );
};

export default function CostsDataGrid({ loadInfo, infoData, onConfirm, sendInfo, onSendData, dialogMsg, entrada }) {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 2},
    { field: 'tipo', headerName: 'Tipo', flex: 1.25,renderCell: (params) => renderStatus(params.value,'Ativo'),},
    { field: 'duracao', headerName: 'Duração', flex: 1 },
    { field: 'dia_pagamento', headerName: 'Dia Pagamento', flex: 2 },
    { field: 'usado', headerName: 'Valor Usado', flex: 2,renderCell: (params) => renderStatus(params.value,params.value?'Usado':'Expirado'),},
    { field: 'valor', 
      headerName: 'Valor', 
      flex: 1.5,
      renderCell: (params) => (
        <ValorInput
          rowId={params.id}
          valorUsado={params.row.usado?params.row.usado:0}
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
      setLoading(!loadInfo);
    }, [infoData,loadInfo]);

  React.useEffect(()=>{
    onSendData('costs',rows);
  },[sendInfo]);

  const handleCosts = () => {
    var allRight = true
    rows.map(row => {
      if (allRight&&row.usado){
        if(parseFloat(row.usado.replace(/R\$|\./g, '').replace(",", "."))>row.valor){
          allRight=false
        }else{
          allRight=true}
      }
    });
    if (allRight){
      const somaValores = rows.reduce((acumulador, atual) => acumulador + atual.valor, 0);
      onConfirm(somaValores);
    }else{
      dialogMsg('Verifique os valores, eles precisam ser maiores ou iguais ao valor usado.');
    };
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
      density="comfortable"
      loading={loading}
      slots={{
        footer: CustomFooterComponent,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        footer: { showNext: loading, handleCosts, rows, entrada},
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
