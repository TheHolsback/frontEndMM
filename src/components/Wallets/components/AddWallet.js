import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box, Tooltip} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { accessAuthApi } from '../../../services/authService';

const Formulario = () => {
  const [carteiras, setCarteiras] = useState([
    {
      id: '1',
      label: 'Criar nova Carteira',
      icon: <AddCircleOutlineRoundedIcon />,
      children: [
        { id: '1.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome da carteira.', },
        { id: '1.1', label: 'Descrição', type: 'text', value: '', tooltip:'Detalhes para melhor identificação.', },
        { id: '1.2', label: 'Risco', type: 'number', value: '', tooltip:'Nível de risco da carteira, quanto maior mais arriscado', },
        // { id: '1.3', label: 'Participação', type: 'number', value: '', tooltip:'', porcentagem: '' },
        { id: '1.4', label: 'Adicionar', type: 'button', value: '' },
      ],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleAdicionarWallet = async () => {
    const dados = {};
    
    dados.nome = carteiras[0].children[0].value;
    dados.descricao = carteiras[0].children[1].value;
    // dados.valor = parseFloat(carteiras[0].children[2].value);
    // dados.participacao = parseInt(carteiras[0].children[3].value)/100;      
    
    // console.log(dados);
    try {
      await accessAuthApi('POST', '/wallets/add', dados);
      setDialogMessage('Carteira cadastrada com sucesso!');
      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleInputChange = (id, value) => {
    const novoCarteiras = carteiras.map(carteira => ({
      ...carteira,
      children: carteira.children.map(child => ({
        ...child,
        value: child.id === id ? value : child.value,
      })),
    }));
    setCarteiras(novoCarteiras);
  };

  const theme = useTheme();

  const accordionStyle = {
    backgroundColor: theme.palette.info.main,
  };

  return (
    <div>
      {carteiras.map(carteiras => (
        <Accordion key={carteiras.id} sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              {carteiras.icon}
              {carteiras.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {carteiras.children && carteiras.children.map(child => (
              child.children ? (
                <Accordion key={child.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{child.label}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {child.children.map(item => (
                      <div key={item.id}>
                        {(() => {
                          switch (item.label) {
                            case 'Adicionar':
                              return (<Button
                                variant="contained"
                                size="small"
                                color="primary"
                                endIcon={<AddCircleOutlineRoundedIcon />}
                                sx={{ width: '100%' }}
                                onClick={() => {
                                  console.log("Botão clicado");
                                  handleAdicionarWallet();
                                }}
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
              ) : (
                <div key={child.id}>
                  {(() => {
                    switch (child.label) {
                      case 'Adicionar':
                        return (<Button
                          variant="contained"
                          size="small"
                          color="primary"
                          endIcon={<AddCircleOutlineRoundedIcon />}
                          sx={{ width: '100%' }}
                          onClick={() => {
                            console.log("Botão clicado");
                            handleAdicionarWallet();
                          }}
                        >
                          {child.label}
                        </Button>)
                      default:
                        return (
                          <Tooltip title={child.tooltip} placement="left">
                            <TextField
                              key={child.id}
                              label={child.label}
                              value={child.value}
                              type={child.type}
                              onChange={e => handleInputChange(child.id, e.target.value)}
                              margin="normal"
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
              )
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cadastro de Carteira</DialogTitle>
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