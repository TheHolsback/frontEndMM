import * as React from 'react';
import { DataGrid,  GridFooter } from '@mui/x-data-grid';
import { accessAuthApi } from '../../../services/authService';

import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

function SparklineCell(params) {
  const currencyFormatter = (value) => value?value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'';

  const { value, colDef } = params;

  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  if (!value || value.length === 0) {
    return null;
  }

  const data = value.map((item) => item.valor);
  const dates = value.map((item) => {
    const date = new Date(item.data);
    return date.toLocaleString('pt-BR', {timeZone: 'UTC', month: 'short', year: 'numeric' });
  });
  const color = [];
  if (data[data.length-1]<data[0]){
    color.push(trendColors.up)
  }else if (data[data.length-1]>data[0]){
    color.push(trendColors.down)
  }else{
    color.push(trendColors.neutral)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={data}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="line"
        showHighlight
        showTooltip
        valueFormatter={currencyFormatter}
        colors={color}
        xAxis={{
          data: dates,
        }}
      />
    </div>
  );
}

function renderStatus(status) {
  const colors = {
    Ativo: 'success',
    Expirado: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

const columns = [
  { field: 'nome', headerName: 'Nome', autoWidth: true,},
  { field: 'status', headerName: 'Status', flex: 1.25,renderCell: (params) => renderStatus(params.value),},
  { field: 'categoria', headerName: 'Categoria', flex: 2 },
  { field: 'descricao', headerName: 'Descrição', flex: 2 },
  { field: 'valor', headerName: 'Valor', autoWidth: true, },
  { field: 'dia_compra', headerName: 'Data Compra', flex: 2 },
  { field: 'duracao', headerName: 'Duração', flex: 1,align: 'center', },
  { field: 'intervalo', headerName: 'Intervalo', flex: 1,align: 'center', },
  { field: 'forma_pagamento', headerName: 'Pagamento', flex: 2 },
  {
    field: 'historico',
    headerName: 'Histórico',
    flex: 2,
    renderCell: SparklineCell,
  },
];

function CustomFooterComponent(props) {
  const theme = useTheme();
  return (
    <Box sx={{backgroundColor: theme.palette.background.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx = {{ marginLeft: 2 }}>
        {props.selectedRows.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon/>}
              onClick={props.handleDelete}
            >
              Excluir
            </Button>
          )}
      </Box>
      <GridFooter {...props} />
    </Box>
  );
}

export default function CostsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    accessAuthApi('GET', '/costs/datagrid')
      .then(response => response.data)
      .then(data => {
        const formattedData = data.map(item => ({
          ...item,
          dia_pagamento: item.pagamento.dia_pagamento,
          forma_pagamento: item.pagamento.nome,
          valor: item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          categoria: item.categorias && item.categorias.nome? item.categorias.nome:null,
          duracao: item.duracao > 0 ? item.duracao : '🔁',
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

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDelete = () => {
    const infoRows = rows.filter((row, index) => selectedRows.includes(index));
    // Agora você tem as informações das linhas selecionadas em selectedRows
    console.log(infoRows);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    const idsToDelete = selectedRows.map((id) => rows.find((row) => row.id === id).id);
    accessAuthApi('DELETE', '/costs/add', { ids: idsToDelete })
      .then((response) => {
        setRows(rows.filter((row) => !idsToDelete.includes(row.id)));
        setSelectedRows([]);
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error(error);
        setOpenDialog(false);
      });
  };
  return (
    <Box height="100%">
      <DataGrid
        checkboxSelection
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
        onRowSelectionModelChange={(selectionModel) => {
          setSelectedRows(selectionModel);
        }}
        selectionModel = {selectedRows}
        slots={{
          // toolbar: GridToolbar,
          footer: CustomFooterComponent,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
          footer: { selectedRows, handleDelete },
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmação de exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza que deseja excluir os custos selecionados?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Voltar
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ backgroundColor: 'error.main' }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
