import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box, Select, MenuItem, Tooltip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';

const InvestimentoDetail = ({ item, handleInputChange }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Tooltip title={item.tooltip} placement="left">
        <TextField
          label="Investimento Mensal"
          value={item.value}
          onChange={e => handleInputChange(item.id, e.target.value)}
          margin="normal"
          sx={{
            width: '100%',
            '& .MuiInputLabel-root': {
              marginTop: '-2.5%',
            },
          }}
        />
      </Tooltip>
      <Select
        labelId="porcentagem-label"
        id="porcentagem-select"
        value={item.porcentagem}
        label="Porcentagem"
        onChange={e => handleInputChange(item.id, e.target.value, 'porcentagem')}
        sx={{ marginTop: '2.0%' }}
      >
        <MenuItem value="Fixo">Fixo</MenuItem>
        <MenuItem value="%">%</MenuItem>
      </Select>
    </Box>
  )
};

const CarteirasUser = ({ item, handleInputChange, carteiras }) => {
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
      {carteiras.map(carteira => (
        <MenuItem key={carteira.id} value={carteira.nome}>{carteira.nome}</MenuItem>
      ))}
    </Select>
  </Tooltip>
  )
};

const Formulario = () => {
  const [objetivos, setObjetivos] = useState([
    {
      id: '1',
      label: 'Criar novo Objetivo',
      icon: <AddCircleOutlineRoundedIcon />,
      children: [
        {
          id: '1.1',
          label: 'Detalhes do Objetivo',
          children: [
            { id: '1.1.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome do objetivo.', },
            { id: '1.1.1', label: 'Descrição', type: 'text', value: '', tooltip:'Descrição para melhor indentificação e com detalhes do objetivo.', },
            { id: '1.1.2', label: 'Carteira*', type: 'select', value: '', tooltip:'Carteira em que serão investidos os valores dos objetivos.', },
            { id: '1.1.3', label: 'Inflação Setor (% a.a)', type: 'float', value: '', tooltip:'Inflação do setor do objetivo para melhor calcular o preço futuro.', },
            { id: '1.1.4', label: 'Nível de Prioridade*', type: 'number', value: '', tooltip:'Maior o número, maior será a prioridade', },
            { id: '1.1.5', label: 'Data Final', type: 'date', value: '', tooltip:'Data em que se pretende finalizar/obter o objetivo.', },
          ],
        },
        {
          id: '1.2',
          label: 'Dados Técnicos',
          children: [
            { id: '1.2.0', label: 'Valor*', type: 'float', value: '', tooltip:'Valor do objetivo' },
            { id: '1.2.1', label: 'Valor à Vista', type: 'float', value: '', tooltip:'Valor do objetivo com descontos de pagamentos. Ex: Pagamento a vista, no boleto, via Pix, etc...' },
            { id: '1.2.2', label: 'Investimento*', type: 'float', value: '', porcentagem: '', tooltip:'Valor do investimento mensal. Fixo:Valor separado todo mês para esse objetivo. Porcentual: Calculo da % do dinheiro investido em cada entrada.'},
            { id: '1.2.3', label: 'Adicionar', type: 'button', value: ''},
          ],
        },
      ],
    },
    // {
    //   id: '2',
    //   label: 'Gerenciar Objetivos',
    //   icon: <EditRoundedIcon />,
    //   children: []
    // }  
  ]);
  const [carteiras, setCarteiras] = useState([]);

  React.useEffect(() => {
    accessAuthApi('GET', '/wallets/info')
      .then(response => response.data)
      .then(data => setCarteiras(data))
      .catch(error => console.error("seguinte erro",error));
  }, []);

  const handleInputChange = (id, value, prop) => {
    const novoObjetivos = objetivos.map(objetivo => {
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
    setObjetivos(novoObjetivos);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleAdicionarObjetivo = async () => {
    const dados = {};

    dados.nome = objetivos[0].children[0].children[0].value;
    dados.descricao = objetivos[0].children[0].children[1].value;
    const carteira = carteiras.find(carteira => carteira.nome === objetivos[0].children[0].children[2].value)
    dados.inflacao = parseFloat(objetivos[0].children[0].children[3].value)/100;
    dados.prioridade = parseInt(objetivos[0].children[0].children[4].value);
    dados.data_final = objetivos[0].children[0].children[5].value
    dados.valor = parseFloat(objetivos[0].children[1].children[0].value);
    dados.valor_vista = parseFloat(objetivos[0].children[1].children[1].value);
    dados.carteira_objetivo = {};
    dados.carteira_objetivo.id_carteira = carteira.id;
    dados.carteira_objetivo.valor = parseFloat(objetivos[0].children[1].children[2].value);
    dados.carteira_objetivo.porc = objetivos[0].children[1].children[2].porcentagem;
    
    if(dados.carteira_objetivo.porc==='%'){
      dados.carteira_objetivo.porc = 1;
    }else{
      dados.carteira_objetivo.porc = 0;
    }
    try {
      await accessAuthApi('POST', '/goals/add', dados);
      setDialogMessage('Objetivo cadastrado com sucesso!');
      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    }

  };

  const theme = useTheme();

  const accordionStyle = {
    backgroundColor: theme.palette.info.main,
  };

  return (
    <div>
      {objetivos.map(objetivo => (
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
                          case 'Investimento':
                            return (
                              <InvestimentoDetail item={item} handleInputChange={handleInputChange} />
                            );
                          case 'Carteira':
                            return (
                              <CarteirasUser item={item} handleInputChange={handleInputChange} carteiras={carteiras} />
                            );
                          case 'Adicionar':
                            return (<Button
                              variant="contained"
                              size="small"
                              color="primary"
                              endIcon={<AddCircleOutlineRoundedIcon />}
                              sx={{width: '100%'}}
                              onClick={() => handleAdicionarObjetivo()}
                            >
                              {item.label}
                            </Button>)
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
      <DialogTitle>Cadastro de Objetivo</DialogTitle>
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