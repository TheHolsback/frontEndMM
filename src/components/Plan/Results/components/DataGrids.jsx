import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { accessAuthApi } from '../../../../services/authService';

import { Button} from '@mui/material';


export default function CustomDataGrid({ infoData, name }) {
  const [rows, setRows] = React.useState([]);
  
  const ConfirmarButton = ({ row, url }) => {
    const [disabled, setDisabled] = React.useState(false);
  
    const getAtivoInfo = (ativoId, dados) => {
      // Extrair as carteiras do objeto de dados
      const wallets = Object.values(dados).filter(item => typeof item === 'object' && item.dados);
    
      const result = wallets.reduce((acc, wallet) => {
        const ativo = wallet.dados.find((ativo) => ativo.id === ativoId);
        if (ativo) {
          acc.push({
            id: ativo.id,
            id_carteira: wallet.id,
            valor: ativo.valor,
            qtd: ativo.quantidade,
          });
        }
        return acc;
      }, []);
    
      return result.length > 0 ? result : null;
    };
  
    const handleConfirm = () => {
      let dados =[];

      if(url.includes('wallets')){
        dados = getAtivoInfo(row.id,infoData);
      }else{
        const data ={};
        data.id = row.id;
        data.valor = row.valor;
        if (row.quantidade){
          data.qtd = row.quantidade;
        }else{
          data.qtd = 0;
        };

        dados.push(data);
      }
      
      dados.map((dado)=>(
        accessAuthApi('POST', url, dado)
        .then((response) => {
          setDisabled(true);
          console.log(response);
        })
        .catch((error) => console.error(error))
      ));
    };
  
    return (
      <Button
        variant="contained"
        color="success"
        onClick={handleConfirm}
        disabled={disabled}
        sx={{
          width: '100%',
          height: 40,
        }}
      >
        Confirmar
      </Button>
    );
  };

  React.useEffect(() => {
    if (name!=='Ativos'){
      setRows(infoData);
    }else{
      setRows(infoData['resumo']);
    };
  }, [infoData]);

  const urlMap = {
    "Custos": '/plan/movements/costs',
    "Objetivos": '/plan/movements/goals',
    "Ativos": '/plan/movements/wallets',
    "Entrada": '/plan/movements/income'
  };
  
  const url = urlMap[name];

  const columns = Object.keys(name!=='Ativos'?infoData[0]:infoData['resumo'][0]).filter((field) => field !== 'id').map((field) => {
    const headerName = field
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
    return {
      field,
      headerName,
      flex: 1,
      align: 'center',
      headerAlign:'center'
    };
  });

  columns.push({
    field: 'confirmar',
    headerName: 'Movimentar',
    renderCell: (params) => (
      <ConfirmarButton
        row={params.row}
        url={url}
      />
    ),
  });

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
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        footer: {},
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
