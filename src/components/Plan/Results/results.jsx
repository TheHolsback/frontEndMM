import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../Dashboard/internals/components/Copyright';

import { useLocation } from 'react-router-dom';
import CustomDataGrid from './components/DataGrids';

export default function PlanResults() {
  const location = useLocation();
  const { state } = location;

  const results = {
    'Entrada':state?.receita,
    'Custos':state?.resultCosts,
    'Objetivos':state?.resultGoals,
    'Ativos':state?.resultWallets,    
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Planejamento
      </Typography>
      <Typography component="h3" variant="h3" sx={{ mb: 2 }}>
        Movimentações a se fazer
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }} flexGrow={1}>
          {Object.keys(results).map(key => (
            <Box sx={{mb: 3}}>
              <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
                {key}
              </Typography>
              <CustomDataGrid infoData={results[key]} name={key}/>
            </Box>))}
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
