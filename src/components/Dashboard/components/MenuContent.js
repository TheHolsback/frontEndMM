import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import WalletRoundedIcon  from '@mui/icons-material/WalletRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link, useLocation } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { accessAuthApi } from '../../../services/authService';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, link: '/dashboard' },
  { text: 'Planejamento', icon: <AssignmentRoundedIcon />, link: '/dashboard/plan' },
  { text: 'Simulações', icon: <ViewInArRoundedIcon />, link: '/dashboard/simulations' },
  { text: 'Objetivos', icon: <FlagRoundedIcon />, link: '/dashboard/goals' },
  { text: 'Carteiras', icon: <WalletRoundedIcon />, link: '/dashboard/wallets' },
  { text: 'Custos', icon: <RequestQuoteRoundedIcon />, link: '/dashboard/costs' },
  // { text: 'Ativos', icon: <AssessmentIcon />, link: '/dashboard/assets' },
];

const secondaryListItems = [
  { text: 'Configurações', icon: <SettingsRoundedIcon />, link: '/Settings' },
  { text: 'Sobre', icon: <InfoRoundedIcon />, link: '/About' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, link: '/Feedback' },
];

export default function MenuContent() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const [wallets, setWallets] = React.useState([]);

  React.useEffect(() => {
    console.log('Requisição sendo enviada...');
    accessAuthApi('GET','/wallets/info')
      .then(response => {
        setWallets(response.data);
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  }, []);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} to={item.link} selected={location.pathname === item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem key='assets' disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={handleClick} >
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Ativos" />
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ListItem key='geral' disablePadding sx={{ display: 'block', paddingLeft: 4 }}>
              <ListItemButton component={Link} to={'/dashboard/assets/'}>
                <ListItemText primary='Geral' />
              </ListItemButton>
            </ListItem>
            {wallets.map((wallet, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block', paddingLeft: 4 }}>
                <ListItemButton component={Link} to={`/dashboard/assets/${wallet.id}`}>
                  <ListItemText primary={wallet.nome} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </ListItem>
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
