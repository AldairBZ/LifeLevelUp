import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../config/api';

// Recibe el token que devuelve el backend tras entrar con Google, GitHub o Facebook
export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (token) {
      apiService.setToken(token);
      navigate('/home', { replace: true });
    } else {
      navigate('/login?error=' + encodeURIComponent('No se pudo completar el acceso.'), { replace: true });
    }
  }, [navigate]);

  return null;
}
