import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { TextField, Button, InputAdornment } from '@mui/material'
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


function StatCard({ title, value, type, interval, onConfirm}) {
  const [inputValue, setInputValue] = React.useState(value);
  const [confirmed, setConfirmed] = React.useState(false);

  const [allocationValues, setAllocationValues] = React.useState(value);

  const handleConfirm = () => {
    if(type==='income'){
      onConfirm(parseFloat(inputValue));
    }else{
      onConfirm(allocationValues);
    }
    setConfirmed(true);
  };

  React.useEffect(() => {
    if (confirmed) {
      if(type==='income'){
        setInputValue(parseFloat(inputValue));
      }else{
        setAllocationValues(allocationValues);
      }
      setConfirmed(false);
    }
  }, [value, confirmed]);
  
  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
              {(() => {
                switch (type){
                  case 'income':
                    return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        key={title}
                        label=''
                        value={inputValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        type="text"
                        margin="normal"
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                          }
                        }}
                        sx={{
                    
                          width: '100%',
                          '& .MuiInputLabel-root': {
                            marginTop: '-2.5%', // Defina o estilo marginTop para 0
                          },
                          '& .MuiInputBase-input': {
                            fontSize: 24, // Altere o tamanho da fonte
                            fontWeight: 'bold', // Deixe o texto em negrito
                          },
                          
                        }}
                        onChange={(e) => setInputValue(e.target.value)}
                        />
                      </Box>
                    )
                  case 'allocation':
                    return (
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {['Custos', 'Investimentos', 'Livre'].map((label, index) => (
                          <TextField
                            key={index}
                            label={label}
                            value={allocationValues[index]} // valor de meta atual
                            type="number"
                            margin="normal"
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              }
                            }}
                            sx={{
                              width: '100%',
                              marginLeft: '2px',
                              marginRight: '2px',
                              '& .MuiInputLabel-root': {
                                marginTop: '-2.5%', // Defina o estilo marginTop para 0
                              },
                              '& .MuiInputBase-input': {
                                fontSize: 24, // Altere o tamanho da fonte
                                fontWeight: 'bold', // Deixe o texto em negrito
                                textAlign: 'center',
                              },
                            }}
                            onChange={(e) => setAllocationValues({ ...allocationValues, [index]: parseFloat(e.target.value) })}
                          />
                        ))}
                      </Box>
                    )
                  default:
                    return (
                      <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <Typography variant="h4" component="p">
                          {value}
                        </Typography>
                      </Stack>
                    )
                }
              })()}
            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap'  }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              endIcon={<CheckCircleRoundedIcon />}
              onClick={handleConfirm}
              sx={{width: '100%'}}
            >
              {type==='income'?'Calcular':'Confirmar'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  interval: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['down', 'neutral', 'up']).isRequired,
  value: PropTypes.string.isRequired,
};

export default StatCard;
