import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { accessAuthApi } from '../../../services/authService';

import { Chip } from '@mui/material';

function renderStatus(status) {
  const color = status === 'Custo' ? 'error' : status === 'Objetivo' ? 'primary' : 'success';
  return <Chip label={status} color={color} size="small" />;
}

const columns = [
  { field: 'nome', headerName: 'Nome', autoWidth: true, headerAlign:'center',},
  { field: 'tipo', headerName: 'Grupo',autoWidth: true, align: 'center', headerAlign:'center',renderCell: (params) => renderStatus(params.value),},
  { field: 'valor', headerName: 'Valor', autoWidth: true, flex:1.25,align: 'center', headerAlign:'center' },
  { field: 'qtd', headerName: 'Quantidade', autoWidth: true,align: 'center', headerAlign:'center', },
  { field: 'data', headerName: 'Data', flex: 1, align: 'center', headerAlign:'center', },
];


export default function MainBoaDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    accessAuthApi('GET', '/main_board/datagrid')
      .then(response => response.data)
      .then(data => {
        const formattedData = data.map(item => ({
          ...item,
          valor: item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          data: new Date(item.data).toLocaleDateString('pt-BR',{timeZone: 'UTC'})
        }));
        setRows(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        // ou alguma outra ação para lidar com o erro
      });
    }, []);

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
      density="compact"
      loading={loading}
      slotProps={{
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
