import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box, Select, MenuItem, Tooltip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useTheme } from '@mui/material/styles';
import { accessAuthApi } from '../../../services/authService';
import { useParams } from 'react-router-dom';

const ClassesAsset = ({ item, handleInputChange, classes }) => {
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
        {classes.map(classe => (
          <MenuItem key={classe.id} value={classe.nome}>{classe.nome}</MenuItem>
        ))}
      </Select>
    </Tooltip>
  )
};

const Indices = ({ item, handleInputChange, indices }) => {
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
      {indices.map(indice => (
        <MenuItem key={indice.id} value={indice.nome}>{indice.nome}</MenuItem>
      ))}
      </Select>
    </Tooltip>

  )
};

const Intervalo = ({ item, handleInputChange }) => {
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
      <MenuItem key='0' value="a.a.">Diário</MenuItem>
      <MenuItem key='1' value="a.m.">Mensal</MenuItem>
      <MenuItem key='3' value="a.t.">Trimestral</MenuItem>
      <MenuItem key='6' value="a.s.">Semestral</MenuItem>
      <MenuItem key='12' value="a.a.">Anual</MenuItem>
    </Select>
  </Tooltip>
  )
};

const Formulario = () => {
  const [objetivos, setObjetivos] = useState([
    {
      id: '1',
      label: 'Adicionar Ativo na carteira',
      icon: <AddCircleOutlineRoundedIcon />,
      children: [
        {
          id: '1.1',
          label: 'Ativo existente',
          children: [
            { id: '1.1.0', label: 'Ativo*', type: 'select', value: '' },
            { id: '1.1.1', label: 'Quantidade*', type: 'float', value: '', tooltip:'Quantidade inicial do ativo na carteira.'},
            { id: '1.1.2', label: 'Adicionar', type: 'button', value: ''},
          ],
        },
        {
          id: '1.2',
          label: 'Novo ativo',
          children: [
            {
              id: '1.2.1',
              label: 'Detalhes do Ativo',
              children: [
                { id: '1.2.1.0', label: 'Nome*', type: 'text', value: '', tooltip:'Nome do ativo.' },
                { id: '1.2.1.1', label: 'Classe*', type: 'select', value: '', tooltip:'Classe que o ativo se classifica.' },
                { id: '1.2.1.2', label: 'ISIN', type: 'text', value: '', tooltip:'Código ISIN do ativo, código de 12 digitos, necessário para identificar o ativo e para obtermos os dados/preços.' },
                { id: '1.2.1.3', label: 'Quantidade*', type: 'float', value: '', tooltip:'Quantidade inicial do ativo na carteira.' },
                { id: '1.2.1.4', label: 'Adicionar', type: 'button', value: ''},
              ],
            },
            {
              id: '1.2.2',
              label: 'Detalhes adicionais Renda Fixa',
              children: [
                { id: '1.2.2.0', label: 'Indice*', type: 'select', value: '', tooltip:'O indice em que o ativo é fixado. Ex: IPCA, CDI, etc.' },
                { id: '1.2.2.1', label: 'Taxa*', type: 'float', value: '', tooltip:'Taxa no qual o ativo é fixado. Ex: IPCA+5%, a taxa é o 5%. Para ativos Pré-fixados, a taxa é somente o valor pré-fixado.' },
                { id: '1.2.2.2', label: 'Intervalo*', type: 'float', value: '', tooltip:'Intervalo de tempo em que o juros são calculados.'},
                { id: '1.2.2.3', label: 'Validade*', type: 'date', value: '', tooltip:'Qual a validade do ativo.'},
                { id: '1.2.2.4', label: 'Adicionar', type: 'button', value: ''},
              ],
            },
          ],
        },
      ],
    },
  ]);
  const [classes, setClasses] = useState([]);
  const [indices, setIndices] = useState([]);
  const { id_carteira } = useParams();

  React.useEffect(() => {
    accessAuthApi('GET', '/assets/info')
      .then(response => response.data)
      .then(data => {
        setClasses(data.classes);
        setIndices(data.indexes);
      })
      .catch(error => {
        console.error(error);
      });
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
                children: child.children.map(grandchild => {
                  if (grandchild.children) {
                    return {
                      ...grandchild,
                      children: grandchild.children.map(item => {
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
                  } else {
                    if (grandchild.id === id) {
                      if (prop) {
                        return { ...grandchild, [prop]: value };
                      } else {
                        return { ...grandchild, value };
                      }
                    }
                    return grandchild;
                  }
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

  const handleAdicionarAtivo = async (tipoAtivo) => {
    const intervalos = {
      "a.d.": 0,
      "a.m.": 1,
      "a.t.": 3,
      "a.s.": 6,
      "a.a.": 12
    };
    const dados = {};

    dados.id_carteira = parseInt(id_carteira);
    dados.nome = objetivos[0].children[0].children[0].value;
    dados.id_classe = classes.find(classe => classe.nome === objetivos[0].children[0].children[1].value).id;
    dados.isin = objetivos[0].children[0].children[2].value;
    dados.qtd = parseFloat(objetivos[0].children[0].children[3].value);
    
    if (tipoAtivo === 'rendaFixa') {
      dados.indice = objetivos[0].children[1].children[0].key;
      dados.taxa = parseFloat(objetivos[0].children[1].children[1].value)/100;
      dados.intervalo = intervalos[objetivos[0].children[1].children[2].value];
      dados.validade = objetivos[0].children[1].children[3].value;
    }else{
      dados.indice = null;
      dados.taxa = null;
      dados.intervalo = null;
      dados.validade = null;
    }
    
    try {
      await accessAuthApi('POST', '/assets/add', dados);
      setDialogMessage('Ativo cadastrado com sucesso!');
      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const theme = useTheme();

  const accordionStyle = {
    backgroundColor: theme.palette.info.main,
  };
  
  if(!id_carteira) return <></>;

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
                  {child.children.map(grandchild => (
                    grandchild.children ? (
                      <Accordion key={grandchild.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>{grandchild.label}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {grandchild.children.map(item => (
                            <div key={item.id}>
                              {(() => {
                                switch (item.label) {
                                  case 'Classe':
                                    return (
                                      <ClassesAsset item={item} handleInputChange={handleInputChange} classes={classes} />
                                    ); 
                                  case 'Indice':
                                    return  (
                                      <Indices item={item} handleInputChange={handleInputChange} indices={indices} />
                                    );
                                  case 'Intervalo':
                                    return (
                                      <Intervalo item={item} handleInputChange={handleInputChange} />
                                    );
                                  case 'Adicionar':
                                    return (<Button
                                      variant="contained"
                                      size="small"
                                      color="primary"
                                      endIcon={<AddCircleOutlineRoundedIcon />}
                                      sx={{ width: '100%' }}
                                      onClick={() => handleAdicionarAtivo(grandchild.id === '1.2.1' ? 'acao' : 'rendaFixa')}
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
                                              marginTop: '-1.5%', // Defina o estilo marginTop para 0
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
                      <Tooltip title={grandchild.tooltip}>
                        <TextField
                          key={grandchild.id}
                          label={grandchild.label}
                          value={grandchild.value}
                          type={grandchild.type}
                          onChange={e => handleInputChange(grandchild.id, e.target.value)}
                          margin="normal"
                          sx={{
                            width: '100%',
                            '& .MuiInputLabel-root': {
                              marginTop: '-1.5%', // Defina o estilo marginTop para 0
                            },
                          }}
                        />
                      </Tooltip>
                    )
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