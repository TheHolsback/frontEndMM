import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const path = location.pathname.split('/');

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {path.map((part, index) => (
        <Link
          key={index}
          to={path.slice(0, index + 1).join('/')}
          style={{
            textDecoration: 'none',
            color: index === path.length - 1 ? 'text.primary' : 'text.secondary',
            fontWeight: index === path.length - 1 ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {part.charAt(0).toUpperCase() + part.slice(1)}
        </Link>
      ))}
    </StyledBreadcrumbs>

  );
}
