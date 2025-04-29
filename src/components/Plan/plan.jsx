import { useState, useEffect} from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../Dashboard/internals/components/Copyright';
// import ChartUserByCountry from './components/ChartNextMonth';
import CustomizedTreeView from './components/CustomizedTreeView';
import HighlightedCard from './components/HighlightedCard';
import StatCard from './components/StatCard';
import { accessAuthApi } from '../../services/authService';
import CostsDataGrid from './components/CostsDataGrid';
import GoalsDataGrid from './components/GoalsDataGrid';
import WalletsDataGrid from './components/WalletsDataGrid';
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';

export default function Plan() {
  const [openDialog, setOpenDialog] = useState(false);
  const [buttonConfirm, setButtonConfirm] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [data, setData] = useState([]);
  const [income, setIncome] = useState(0);
  const [percObjective, setPercObjective] = useState([]);
  // CUSTOS
  const [loadCosts, setLoadCosts] = useState(false);
  const [costsData, setCostsData] = useState([]);
  // OBJETVOS
  const [loadGoals, setLoadGoals] = useState(false);
  const [goalsInput, setGoalsInput] = useState({});
  const [goalsData, setGoalsData] = useState([]);
  // CARTEIRAS
  const [loadWallets, setLoadWallets] = useState(false);
  const [walletsInput, setWalletsInput] = useState({});
  const [walletsData, setWalletsData] = useState([]);
  // Resultados
  const [result, setResult] = useState(false);
  const [resultCosts, setResultCosts] = useState([]);
  const [resultGoals, setResultGoals] = useState([]);
  const [resultWallets, setResultWallets] = useState([]);

  const theme = useTheme();
  
  const navigate = useNavigate();
  useEffect(() => {
    accessAuthApi('GET', '/plan/financial')
    .then(response => response.data)
    .then(data => {
      const dados = [data[0].investimento*100,data[0].custos*100,data[0].livre*100]
      setPercObjective(dados);
      const formattedData = [
        {
          title: 'Entrada',
          value: data[0].entrada,
          type: 'income',
          interval: 'Entrada para o mês corrente',
          onConfirm: handleConfirm
        },
        {
          title: 'Divisão Objetivo',
          value: dados,
          type: 'allocation',
          interval: 'Veja o card Divisão Financeira para os valores atuais.',
          onConfirm: handleNewPercent
          
        },
      ];
      setData(formattedData);
    })
    .catch(error => {
      console.error('Erro ao fazer requisição:',error);
      window.location.reload();
    });
  }, []);
  
  useEffect(() => {
    if (loadCosts) {
      accessAuthApi('GET', '/plan/costs')
      .then(response => response.data)
      .then(data => {
        const formattedData = data.map(item => ({
          ...item,
          dia_pagamento: item.dia_pagamento?new Date(item.dia_pagamento).toLocaleDateString('pt-BR',{timeZone: 'UTC'}):'',
          duracao: item.duracao > 0 ? item.duracao : '∞',
          usado: item.usado ? item.usado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):null,
        }));
        setCostsData(formattedData);
      })
      .catch(error => {
        console.error('erro nos custos',error);
      });
    }
  }, [loadCosts]);
  
  const [triggerGoals, setTriggerGoals] = useState(false);
  useEffect(() => {
    if (loadGoals){
      const info = {
        entrada: income,
        custo: goalsInput,
        divisao: percObjective
        };
        accessAuthApi('GET', '/plan/goals',info)
        .then(response => response.data)
        .then(data => {
          const formattedData = data.map(item => ({
            ...item,
            data_final: new Date(item.data_final).toLocaleDateString('pt-BR',{timeZone: 'UTC'}),
            finalizado: item.finalizado ? 'Concluído' : 'Ativo',
          }));
          setGoalsData(formattedData);

        })
        .catch(error => {
          setDialogMessage(error.response.data.error);
          console.error('Erro ao fazer requisição GOALS:',error);
          // ou alguma outra ação para lidar com o erro
        });
      }else{
        setGoalsData([]);
      }
      setTriggerGoals(false);
  }, [loadGoals,triggerGoals]);

  const [triggerWallets, setTriggerWallets] = useState(false);
  useEffect(() => {
    if (loadWallets) {
      accessAuthApi('GET', '/plan/wallets', walletsInput)
        .then(response => response.data)
        .then(data => {
          const formattedData = Object.keys(data).map(key => ({
            nome: key,
            id: data[key].id,
            prop: data[key].prop_investimento,
            valorCota:data[key].valor_cota,
            dados: data[key].dados.map(item => ({
              ...item,
              participacao_atual: parseFloat((item.participacao_atual * 100).toFixed(3)),
              nova_participacao: parseFloat((item.nova_participacao * 100).toFixed(3))
            })),
          }));
          setWalletsData(formattedData);
        })
        .catch(error => {
          console.error('Erro ao fazer requisição Wallets:', error);
        });
    } else {
      setWalletsData([]);
    }
    setTriggerWallets(false);
  }, [loadWallets, triggerWallets]);
  
  useEffect(()=>{
    if(dialogMessage.length){
      setOpenDialog(true);
    }
  },[dialogMessage])

  const handleNewPercent = (perc) => {
    const newPerc = [ ...perc ];
    const novaLista = newPerc.map(valor => valor / 100);

    setPercObjective(novaLista);
  };
  
  const handleConfirm = (input) => {
    setIncome(input);
    setLoadCosts(true);
    setLoadGoals(false);
    setLoadWallets(false);
  };

  const handleConfirmCosts = (valor) => {
    if(loadGoals){
      setTriggerGoals(true);
    };
    setGoalsData([]);
    setGoalsInput(valor);

    setLoadGoals(true);
    setLoadWallets(false);
  };

  const handleConfirmGoals = (data) => {
    if(loadWallets){
      setTriggerWallets(true);
    };
    setWalletsInput(data);
    setLoadWallets(true);
  };

  const handleResults = () => {
    setButtonConfirm(true);
    setDialogMessage('Tem certeza que deseja continuar? Ao prosseguir, os resultados anteriores são apagados!');
  };

  const handleConfirmResults = () => {
    setResult(true);
  };

  useEffect(() => {
    if (result && resultCosts.length > 0 && resultGoals.length > 0 && resultWallets.length > 0) {
      const auxGoal = resultGoals.map((goal) => {
        const wallet = resultWallets.find((wallet) => wallet.id === goal.id_carteira);
        if (wallet) {
          return { ...goal, valor: goal.valor * wallet.prop, quantidade:wallet.qtd };
        } else {
          return goal;
        }
      });
  
      const resumo = {};
  
      resultWallets.forEach((carteira) => {
        carteira.dados.forEach((ativo) => {
          if (!ativo.financeiro){
            return;
          };
  
          if (!resumo[ativo.nome]) {
            resumo[ativo.nome] = {
              id: ativo.id,
              valor: 0,
              financeiro: 0,
              quantidade: 0,
            };
          }
          resumo[ativo.nome].valor += ativo.valor;
          resumo[ativo.nome].financeiro += ativo.financeiro;
          resumo[ativo.nome].quantidade += ativo.quantidade;
        });
      });
      const receita = [{id:0,nome:'Receita',valor:income}]
      const resumoArray = Object.keys(resumo).map((nome) => ({
        nome,
        ...resumo[nome],
      }));
  
      const auxWallet = {...resultWallets,resumo:resumoArray};
      
      const saveResult = { resultCosts, resultGoals:auxGoal, resultWallets:auxWallet, receita };
      accessAuthApi('POST','/plan/save',saveResult);

      navigate('/dashboard/plan/results', {
        state: saveResult,
      });
    }
  }, [result, resultCosts, resultGoals, resultWallets]);

  const handleSetResults = (nome, dados) =>{
    if(dados.length>0 || nome==='wallets'){
      switch(nome){
        case 'costs':
          console.log('dados Custos:',dados);
          setResultCosts(dados);
          break;
        case 'goals':
          console.log('dados Objetivo:',dados);
          setResultGoals(dados);
          break;
        case 'wallets':
          if (dados.dados.length>0){
            setResultWallets((prevWallets) => [...prevWallets, dados]);
            console.log('dados Carteira:',resultWallets);
          };
          break;
      };
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Planejamento
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 16, sm: 8, lg: 4 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
          <HighlightedCard />
        </Grid>
      </Grid>
      <Typography component="h3" variant="h3" sx={{ mb: 2 }}>
        Movimentações a se fazer
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 3 }} flexGrow={1}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            {/* <ChartUserByCountry /> */}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Box>
            <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
              Custos
            </Typography>
            <CostsDataGrid 
              loadInfo={loadCosts}
              infoData={costsData}
              onConfirm={handleConfirmCosts}
              sendInfo={result}
              onSendData={handleSetResults}
              dialogMsg={setDialogMessage}
              entrada={
                {
                  entrada: income,
                  divisao: percObjective
                }
              }
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }} flexGrow={1}>
          <Box>
            <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
              Objetivos
            </Typography>
            <GoalsDataGrid 
              loadInfo={loadGoals} 
              infoData={goalsData} 
              onConfirm={handleConfirmGoals}
              sendInfo={result}
              onSendData={handleSetResults}
              entrada={
                {
                  income: income,
                  goalsInput: goalsInput
                }
              }
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }} flexGrow={1}>
          {loadWallets && (<Box>
            <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
              Carteiras
            </Typography>
              {walletsData.map((carteira, index) => {
                return(
                  <Box key={index} height="100%" marginBottom={3}>
                    <Typography component="h6" variant="h6" sx={{ mb: 0.5,mr:1 }}>
                      {carteira.nome}
                    </Typography>
                    <WalletsDataGrid 
                      loadInfo={loadWallets} 
                      infoData={carteira}
                      sendInfo={result}
                      onSendData={handleSetResults}
                    />
                  </Box>
                )
              }
              )}
            <Button
              variant="contained"
              color="success"
              endIcon={<DoneOutlineRoundedIcon/>}
              onClick={handleResults}
            >
              Ver Todas as operações
            </Button>
          </Box>)}
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Informações</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 100, color: theme.palette.warning.main}} />
          </Box>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttonConfirm && (
            <Button 
              sx={{
                backgroundColor: theme.palette.primary.main,
              }}
              onClick={() => {
                setOpenDialog(false);
                handleConfirmResults();
              }}
            >
              Confirmar
            </Button>
          )}
          <Button 
            sx={{
              backgroundColor: theme.palette.warning.main,
            }}
            onClick={() => {
              setOpenDialog(false);
              setDialogMessage('');
            }}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
