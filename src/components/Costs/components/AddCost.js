import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';

const SelectUser = ({ item, handleInputChange, opcoes }) => {
  return (
    <Tooltip title={item.tooltip} placement="left">
      <Select
      key={item.id}
      value={item.value}
      label={item.label}
      onChange={e => handleInputChange(item.id, e.target.value)}
      displayEmpty
      renderValue={(value) => value === '' ? item.label : value}
      sx={{width: '100%', marginTop: '3.5%' }}
    >
      {opcoes.map(opcao => (
        <MenuItem key={opcao.id} value={opcao.nome}>{opcao.nome}</MenuItem>
      ))}
    </Select>
  </Tooltip>
  )
};

const DuracaoDetail = ({ item, handleInputChange, handleCheckboxChange }) => {
  const [checked, setChecked] = useState(item.porcentagem === '%');
  const [disabled, setDisabled] = useState(item.porcentagem === '%');
  
  const theme = useTheme();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Tooltip title={item.tooltip} placement="left">
        <TextField
          label="Duração"
          value={item.value}
          type={item.type}
          onChange={e => handleInputChange(item.id, e.target.value)}
          margin="normal"
          disabled={disabled}
          sx={{
            width: '100%',
            '& .MuiInputLabel-root': {
              marginTop: '-2.5%',
            },
            '& .MuiInputBase-root': {
              backgroundColor: disabled ? theme.palette.info.dark: '',
            },
          }}
        />
      </Tooltip>
      <Box sx={{ marginTop: '2.0%', marginLeft: '3.5%' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={e => {
                setChecked(e.target.checked);
                setDisabled(e.target.checked);
                handleCheckboxChange(e.target.checked);
                if (e.target.checked) {
                  handleInputChange(item.id, '', 'value');
                } else {
                  handleInputChange(item.id, '',);
                }
              }}
            />
          }
          label="Permanente"
        />
      </Box>
    </Box>
  )
};

const Formulario = () => {
  const [custos, setCustos] = useState([
    {
      id: '1',
      label: 'Adicionar novo Custo',
      icon: <AddCircleOutlineRoundedIcon />,
      children: [
        {
          id: '1.1',
          label: 'Custo Extraordinário',
          children: [
            { id: '1.1.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome do Custo'},
            { id: '1.1.1', label: 'Descrição', type: 'text', value: '', tooltip:'Descrição do custo' },
            { id: '1.1.2', label: 'Categoria', type: 'select', value: '', tooltip:'Categoria do custo', },
            { id: '1.1.3', label: 'Valor*', type: 'number', value: '', tooltip:'Valor do custo' },
            { id: '1.1.4', label: 'Forma de Pagamento*', type: 'select', value: '', tooltip:'Forma de Pagamento utilizada', },
            { id: '1.1.5', label: 'Data Compra*', type: 'date', value: '', tooltip:'Data que será cobrado o valor' },
            { id: '1.1.6', label: 'Adicionar', type: 'button', value: ''},
          ],
        },
        {
          id: '1.2',
          label: 'Custo Recorrente',
          children: [
            { id: '1.2.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome do custo.' },
            { id: '1.2.1', label: 'Descrição', type: 'text', value: '', tooltip:'Descrição para melhor identificação do custo.' },
            { id: '1.2.2', label: 'Valor*', type: 'number', value: '', tooltip:'Valor mais aproximado do custo, poderá ser alterado todos os meses.' },
            { id: '1.2.3', label: 'Forma de Pagamento*', type: 'select', value: '', tooltip:'Forma de Pagamento utilizada', },
            { id: '1.2.4', label: 'Intervalo*', type: 'number', value: '', tooltip:'Intervalo em meses que esse custo acontece, por exemplo, uma compra de suplemento a cada 3 meses.' },
            { id: '1.2.5', label: 'Duração*', type: 'number', value: '', tooltip:'Número de vezes que esse custo irá repetir' },
            { id: '1.2.6', label: 'Data Compra*', type: 'date', value: '', tooltip:'Data que será cobrado o valor' },
            { id: '1.2.7', label: 'Adicionar', type: 'button', value: ''},
          ],
        },
      ],
    },
    {
      id: '2',
      label: 'Adicionar nova categoria',
      icon: <CategoryRoundedIcon />,
      children: [
        {
          id: '2.1',
          label: 'Categoria',
          children: [
            { id: '2.1.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome da categoria de custo'},
            { id: '2.1.1', label: 'Descrição*', type: 'text', value: '', tooltip:'Descrição da categoria' },
            { id: '2.1.2', label: 'Valor*', type: 'number', value: '', tooltip:'Valor mais aproximado da categoria, poderá ser alterado todos os meses.' },
            { id: '2.1.3', label: 'Adicionar', type: 'button', value: ''},
          ],
        },
      ],
    },
    {
      id: '3',
      label: 'Adicionar novo meio de pagamento',
      icon: <PaymentsRoundedIcon />,
      children: [
        {
          id: '3.1',
          label: 'Novo meio de pagamento',
          children: [
            { id: '3.1.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome da forma de pagamento'},
            { id: '3.1.1', label: 'Dia do mês de Pagamento*', type: 'number', value: '', tooltip:'Dia da Fatura, caso o pagamento seja a vista, digite 0' },
            { id: '3.1.2', label: 'Dia do mês de Fechamento*', type: 'number', value: '', tooltip:'Dia do Fechamento da fatura, caso o pagamento seja a vista, digite 0' },
            { id: '3.1.3', label: 'Adicionar', type: 'button', value: ''},
          ],
        },
      ],
    },
  ]);

  const [categorias,setCategorias] = useState([]);
  const [formasPagamentos,setFormasPagamentos] = useState([]);

  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  React.useEffect(() => {
    accessAuthApi('GET', '/costs/info')
      .then(response => response.data)
      .then(data => {
        setCategorias(data.categorias);
        setFormasPagamentos(data.formasPagamentos);
      })
      .catch(error => console.error("seguinte erro",error));
  }, []);


  const handleCheckboxChange = (checked) => {
    setCheckboxChecked(checked);
  };

  const handleAdicionarCusto = async (tipoCusto) => {
    const pegaDataPagamento = (diaPagamento,fechamento,dataCompra) =>{
      const data = new Date(dataCompra);
      const diaCompra = data.getUTCDate();
      var mesPagamento = data.getUTCMonth()+1;
      var anoPagamento = data.getUTCFullYear();

      if (fechamento > diaPagamento) {
        mesPagamento += (diaCompra > fechamento) ? 2 : 1;
      } else {
        mesPagamento += (diaCompra > fechamento) ? 1 : 0;
      }
      if (mesPagamento>12){
        mesPagamento -= 12;
        anoPagamento += 1;
      };
      
      return `${anoPagamento}-${mesPagamento}-${diaPagamento}`;
    };

    const dados = {};
    var url='/costs/add';
    var formaPagamento = '';
    switch(tipoCusto){
      case 'extraordinario':
        dados.nome = custos[0].children[0].children[0].value;
        dados.descricao = custos[0].children[0].children[1].value;
        const categoria = categorias.find(categoria => categoria.nome === custos[0].children[0].children[2].value);
        if (categoria){
          dados.id_categoria_custo = categoria.id;
        }else{
          dados.id_categoria_custo = null;
        }
        dados.valor = parseFloat(custos[0].children[0].children[3].value);
        formaPagamento = formasPagamentos.find(pagamento => pagamento.nome === custos[0].children[0].children[4].value);;
        dados.dia_compra = custos[0].children[0].children[5].value;

        if (formaPagamento.dia_pagamento){
          dados.dia_pagamento = pegaDataPagamento(formaPagamento.dia_pagamento,formaPagamento.dia_fechamento,dados.dia_compra);
        }else{
          dados.dia_pagamento = dados.dia_compra;
        }

        dados.duracao = 1;
        dados.intervalo = 1;
        break;
      
      case 'recorrente':
        dados.nome = custos[0].children[1].children[0].value;
        dados.descricao = custos[0].children[1].children[1].value;
        dados.valor = parseFloat(custos[0].children[1].children[2].value);
        formaPagamento = formasPagamentos.find(pagamento => pagamento.nome === custos[0].children[1].children[3].value);;
        dados.intervalo = parseInt(custos[0].children[1].children[4].value);
        dados.dia_compra = custos[0].children[0].children[6].value;
        
        if (formaPagamento.dia_pagamento){
          dados.dia_pagamento = pegaDataPagamento(formaPagamento.dia_pagamento,formaPagamento.dia_fechamento,dados.dia_compra);
        }else{
          dados.dia_pagamento = dados.dia_compra;
        }

        if (checkboxChecked) {
          dados.duracao = -1;
        } else {
          dados.duracao = parseInt(custos[0].children[1].children[5].value);
        };
        break;
      
      case 'categoria':
        dados.nome = custos[1].children[0].children[0].value;
        dados.descricao = custos[1].children[0].children[1].value;
        dados.valor = custos[1].children[0].children[2].value;
        url += '/category'
        break;
      
      case 'formaPagamento':
        dados.nome = custos[2].children[0].children[0].value;
        dados.dia_pagamento = parseInt(custos[2].children[0].children[1].value);
        dados.dia_fechamento = parseInt(custos[2].children[0].children[2].value);
        url += '/payment'
        break;
    };
  
    try {
      await accessAuthApi('POST', url, dados);
      setDialogMessage('Custo cadastrado com sucesso!');
      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (id, value, prop) => {
    const novocustos = custos.map(objetivo => {
      if (objetivo.children) {
        return {
          ...objetivo,
          children: objetivo.children.map(child => {
            if (child.children) {
              return {
                ...child,
                children: child.children.map(item => {
                  if (item.id === id) {
                    if (prop) {
                      return { ...item, [prop]: value };
                    } else {
                      return { ...item, value };
                    }
                  }
                  return item;
                })
              };
            }
            return child;
          })
        };
      }
      return objetivo;
    });
    setCustos(novocustos);
  };
  
  const theme = useTheme();

  const accordionStyle = {
    backgroundColor: theme.palette.info.main,
  };

  return (
    <div>
      {custos.map(objetivo => (
        <Accordion key={objetivo.id} sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              {objetivo.icon}
              {objetivo.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {objetivo.children.map(child => (
              <Accordion key={child.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{child.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {child.children.map(item => (
                    <div key={item.id}>
                      {(() => {
                        switch (item.label) {
                          case 'Duração':
                            return (
                                <DuracaoDetail item={item} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange}/>
                            );
                          case 'Forma de Pagamento':
                            return (
                              <SelectUser item={item} handleInputChange={handleInputChange} opcoes={formasPagamentos} />
                            );
                          case 'Categoria':
                            return (
                              <SelectUser item={item} handleInputChange={handleInputChange} opcoes={categorias} />
                            );                          
                          case 'Adicionar':
                            const getTipoCusto = () => {
                              switch (child.id) {
                                case '1.1':
                                  return 'extraordinario';
                                case '1.2':
                                  return 'recorrente';
                                case '2.1':
                                  return 'categoria';
                                case '3.1':
                                  return 'formaPagamento';
                              }
                            };
                            return (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                endIcon={<AddCircleOutlineRoundedIcon />}
                                sx={{width: '100%'}}
                                onClick={() => handleAdicionarCusto(getTipoCusto())}
                              >
                                {item.label}
                              </Button>
                            );
                          default:
                            return (
                              <Tooltip title={item.tooltip} placement="left">
                                <TextField
                                  key={item.id}
                                  label={item.label}
                                  value={item.value}
                                  type={item.type}
                                  onChange={e => handleInputChange(item.id, e.target.value)}
                                  margin="normal"
                                  {...(item.type === 'date' && { InputLabelProps: { shrink: true } })}
                                  sx={{
                                    width: '100%',
                                    '& .MuiInputLabel-root': {
                                      marginTop: '-2.5%', // Defina o estilo marginTop para 0
                                    },
                                  }}
                                />
                              </Tooltip>
                            );
                        }
                      })()}
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cadastro de Custo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 52, color: theme.palette.success.main}} />
          </Box>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            sx={{
              backgroundColor: theme.palette.success.main,
            }}
            onClick={() => {
              setOpenDialog(false); 
              window.location.reload();
            }}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Formulario;