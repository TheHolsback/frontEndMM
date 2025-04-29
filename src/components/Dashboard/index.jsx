import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useLayoutEffect, useState } from 'react';
import { checkAccessToken } from '../../services/authService';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from '../MainBoard/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../styles/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import Goals from '../Goals/goals';
import Wallets from '../Wallets/wallets';
import Costs from '../Costs/costs';
import Plan from '../Plan/plan';
import Assets from '../Assets/assets';
import PlanResults from '../Plan/Results/results';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const [tokenValido, setTokenValido] = useState();
  const navigate = useNavigate();
  
    useLayoutEffect(() => {
      checkAccessToken().then((valido) => {
        setTokenValido(valido);
        });
      }, []);
  
    if (!tokenValido) {
      navigate('/');
    }

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Routes>
              <Route path="/" element={<MainGrid />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/plan/results" element={<PlanResults />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/wallets" element={<Wallets />} />
              <Route path="/costs" element={<Costs />} />
              <Route path="/assets/:id_carteira?" element={<Assets />} />
            </Routes>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
