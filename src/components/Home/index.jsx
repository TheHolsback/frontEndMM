import { useLayoutEffect, useState } from 'react';
import { checkAccessToken } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import HomeNewUser from './HomeNew';

export default function Home () {
  const [tokenValido, setTokenValido] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    checkAccessToken().then((valido) => {
      setTokenValido(valido);
      });
    }, []);

  if (!tokenValido) {
    return <HomeNewUser />;
  }
  else{
    navigate('/dashboard');
  }
}
