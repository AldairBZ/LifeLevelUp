import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import perfilImg from '../assets/imagenes-home/perfil/perfil.webp';
import apiService from '../config/api';
import './Header.css';

const SECCIONES = [
  { ruta: '/home/salud-bienestar', nombre: 'Salud' },
  { ruta: '/home/salud-planeta', nombre: 'Planeta' },
  { ruta: '/home/desafios', nombre: 'Desafíos' },
  { ruta: '/home/comunidad', nombre: 'Comunidad' },
  { ruta: '/home/blogs', nombre: 'Blog' },
];

export default function Header({ scrollProgress = 0 }) {
  const [menuPerfil, setMenuPerfil] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const perfilRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Al cambiar de página se cierran los menús
  useEffect(() => {
    setMenuMovil(false);
    setMenuPerfil(false);
  }, [location.pathname]);

  useEffect(() => {
    const alClicarFuera = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) setMenuPerfil(false);
    };
    const alPulsarEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuPerfil(false);
        setMenuMovil(false);
      }
    };
    document.addEventListener('mousedown', alClicarFuera);
    document.addEventListener('keydown', alPulsarEscape);
    return () => {
      document.removeEventListener('mousedown', alClicarFuera);
      document.removeEventListener('keydown', alPulsarEscape);
    };
  }, []);

  const cerrarSesion = async () => {
    try {
      await apiService.logout();
    } catch {
      // Aunque el servidor no responda, la sesión local se cierra igual
      apiService.setToken(null);
    }
    navigate('/login');
  };

  return (
    <header className="llu-header">
      <nav className="llu-nav" aria-label="Principal">
        <NavLink to="/home" className="llu-logo" end>
          <span className="llu-logo-orbita" aria-hidden="true" />
          LifeLevelUp
        </NavLink>

        <button
          type="button"
          className={`llu-hamburguesa ${menuMovil ? 'abierta' : ''}`}
          aria-expanded={menuMovil}
          aria-controls="llu-menu"
          aria-label={menuMovil ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuMovil((v) => !v)}
        >
          <span />
          <span />
        </button>

        <ul id="llu-menu" className={`llu-menu ${menuMovil ? 'abierto' : ''}`}>
          {SECCIONES.map((s) => (
            <li key={s.ruta}>
              <NavLink to={s.ruta} className={({ isActive }) => (isActive ? 'activo' : '')}>
                {s.nombre}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="llu-perfil" ref={perfilRef}>
          <button
            type="button"
            className="llu-perfil-boton"
            aria-haspopup="menu"
            aria-expanded={menuPerfil}
            aria-label="Menú de usuario"
            onClick={() => setMenuPerfil((v) => !v)}
          >
            <img src={perfilImg} alt="" width="36" height="36" />
          </button>
          {menuPerfil && (
            <div className="llu-perfil-menu" role="menu">
              <button role="menuitem" onClick={() => navigate('/home/avatar/personalizar')}>
                Personalizar avatar
              </button>
              <button role="menuitem" onClick={() => navigate('/home')}>
                Inicio
              </button>
              <button role="menuitem" className="llu-salir" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="llu-progreso" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
    </header>
  );
}
