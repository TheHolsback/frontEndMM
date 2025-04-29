import * as React from 'react';
import { DataGrid, GridFooter } from '@mui/x-data-grid';

import { useTheme } from '@mui/material/styles';
import { Box, TextField, InputAdornment, Typography, Paper, Button, Chip } from '@mui/material';

import {ToggleButtonGroup, ToggleButton } from '@mui/material';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';

const ValorInput = ({ rowId, valorInicial, onValorUpdate, update }) => {
  const [valorState, setValorState] = React.useState(valorInicial.toFixed(2));

  React.useEffect(() => {
    setValorState(valorInicial.toFixed(2));
  }, [update]);

  const handleValorChange = (event) => {
    const novoValor = event.target.value.replace(',', '.');
    setValorState(novoValor);
    onValorUpdate(rowId, parseFloat(novoValor));
  };

  return (
    <TextField
      type="text"
      value={valorState}
      onChange={handleValorChange}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }
      }}
      sx={{
        justifyContent: 'center',
        height: '100%',
        width: '60%',
        "& .MuiInputBase-root": {
          height: 40,
        },
        '& .MuiInputBase-input': {
          textAlign: 'center',
        },
        
      }}
    />
  );
};

const QtdInput = ({ rowId, valorInicial, onValorUpdate, update }) => {
  const [valorState, setValorState] = React.useState(valorInicial.toFixed(2));

  React.useEffect(() => {
    setValorState(valorInicial.toFixed(2));
  }, [update]);

  const handleValorChange = (event) => {
    const novoValor = event.target.value.replace(',', '.');
    setValorState(novoValor);
    onValorUpdate(rowId, parseFloat(novoValor));
  };

  return (
    <TextField
      type="text"
      value={valorState}
      onChange={handleValorChange}
      sx={{
        justifyContent: 'center',
        height: '100%',
        width: '40%',
        "& .MuiInputBase-root": {
          height: 40,
        },
        '& .MuiInputBase-input': {
          textAlign: 'center',
        }
      }}
    />
  );
};

function CustomFooterComponent(props) {
  const theme = useTheme();
  const valorFinanceiro = React.useMemo(() => {
    return props.rows.reduce((acc, row) => acc + row.financeiro, 0);
  }, [props.rows]);
  return (
    <Box sx={{backgroundColor: theme.palette.background.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx = {{ marginLeft: 2, display: 'flex', direction: 'row', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="info"
          endIcon={<RotateLeftRoundedIcon/>}
          onClick={props.handleRecalculate}
        >
          Recalcular
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<CachedRoundedIcon/>}
          onClick={props.handleReset}
          sx={{
            ml:1
          }}
        >
          Resetar Dados
        </Button>
        <Typography variant='h5' color='grey' sx={{ml:3}}>
          Total:
        </Typography>
        <Chip 
          size='.' 
          color='success'
          label={valorFinanceiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          sx={{ml:1}}
        />
        <Typography variant='h5' color='grey' sx={{ml:3}}>
          Qtd:
        </Typography>
        <Chip 
          size='.' 
          color='success'
          label={`${(valorFinanceiro/props.valorCota).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          sx={{ml:1}}
        />
        
      </Box>
      <GridFooter {...props} />
    </Box>
  );
}

export default function WalletsDataGrid({ loadInfo, infoData, sendInfo, onSendData  }) {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [alignment, setAlignment] = React.useState('quantidade');
  const [update, setUpdate] = React.useState(false);

  const columns = [
    { field: 'nome', headerName: 'Nome', flex:1,},
    { field: 'participacao_atual', headerName: 'Participação Atual (%)', flex: 1, align: 'center', headerAlign:'center', },
    { field: 'nova_participacao', headerName: 'Nova Participação (%)', flex: 1, align: 'center', headerAlign:'center',  },    
    { field: 'valor', headerName: 'Valor Ativo', flex: 1, align: 'center', headerAlign:'center', 
      renderCell: (params) => 
        alignment !== 'valor' ? (
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
            update={update}
          />
        ) : (
          <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {params.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Typography>
        )
    },
    { field: 'quantidade', headerName: 'Quantidade', flex: 1,align: 'center', headerAlign:'center', 
      renderCell: (params) => 
        alignment !== 'quantidade' ? (
          <QtdInput
            rowId={params.id}
            valorInicial={params.value}
            onValorUpdate={(id, novoValor) => {
              setRows((rows) =>
                rows.map((row) =>
                  row.id === id ? { ...row, quantidade: novoValor } : row
                )
              );
            }}
            update={update}
          />
        ) : (
          <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {params.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Typography>
        )
  
    },
    { field: 'financeiro', headerName: 'Financeiro', flex: 1,align: 'center', headerAlign:'center', 
      renderCell: (params) => 
        alignment !== 'financeiro' ? (
          <ValorInput
            rowId={params.id}
            valorInicial={params.value}
            onValorUpdate={(id, novoValor) => {
              setRows((rows) =>
                rows.map((row) =>
                  row.id === id ? { ...row, financeiro: novoValor } : row
                )
              );
            }}
            update={update}
          />
        ) : (
          <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {params.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Typography>
        )  
    },
  ];

  React.useEffect(() => {
    setRows(infoData.dados);
    setLoading(!loadInfo);
  }, [infoData,loadInfo]);

  React.useEffect(()=>{
    var data = { ...infoData }; // Usando o operador spread para copiar
    data['dados'] = rows;
    const old_value = infoData.dados.reduce((acc, row) => acc + row.financeiro, 0);
    const old_prop = infoData['prop']
    const new_value = rows.reduce((acc, row) => acc + row.financeiro, 0);
    data['prop'] = (new_value/old_value)*old_prop;
    data['qtd'] = new_value/infoData.valorCota;

    onSendData('wallets',data);
  },[sendInfo]);



  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleRecalculate = () =>{
    if(update){
      setUpdate(false);
    }else{
      setUpdate(true);
    }
    switch(alignment){
      case 'valor':
        setRows(rows.map((row) => ({ ...row, valor: row.financeiro/row.quantidade })));
        break;
      case 'quantidade':
        setRows(rows.map((row) => {
          const qtd = Math.round(row.quantidade);
          const novaQuantidade = row.financeiro/row.valor;
          if(qtd!==novaQuantidade){
            return { ...row, quantidade: Math.floor(novaQuantidade), financeiro: Math.floor(novaQuantidade)*row.valor };
          } else {
            return { ...row, quantidade: novaQuantidade };
          }
        }));
        break;
      case 'financeiro':
        setRows(rows.map((row) => ({ ...row, financeiro: row.quantidade*row.valor })));
        break;
    }
    const aux = alignment
    setAlignment('financeiro');
    setAlignment(aux);
  };

  const handleReset = () =>{
    setRows(infoData.dados);
  }

  return (
    <Box height="100%">
      <Paper 
        sx={{ 
          display: 'flex', 
          direction: 'row' , 
          alignItems:'center',
          borderBottomLeftRadius: 0, borderBottomRightRadius: 0 
        }}>
        <Typography variant='h6' color='grey' sx={{ml:1}} >
          Selecione o dado a ser calculado:
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="Platform"
          sx={{m:1}}
          size='small'
        >
          <ToggleButton value="valor">Valor do Ativo</ToggleButton>
          <ToggleButton value="quantidade">Quantidade</ToggleButton>
          <ToggleButton value="financeiro">Financeiro</ToggleButton>
        </ToggleButtonGroup>
      </Paper>
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
          footer: CustomFooterComponent,
        }}
        slotProps={{
          footer: { handleRecalculate, rows, handleReset, valorCota:infoData.valorCota },
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
        sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />
    </Box>
  );
}