import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginTriangle.css';
import planeta from '../../assets/svg/planet.png';
import FondoEspacioLogin from './FondoEspacioLogin';
import { CampoAsteroides, CinturonPlaneta } from './Asteroides';
import Terminos from '../home/footer/privacidad/Terminos';
import apiService, { API_CONFIG } from '../../config/api';

const PROVEEDORES = [
  {
    id: 'google',
    nombre: 'Google',
    icono: (
      <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
    ),
  },
  {
    id: 'github',
    nombre: 'GitHub',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#1b1f24" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
    ),
  },
  {
    id: 'facebook',
    nombre: 'Facebook',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z"/></svg>
    ),
  },
];

function BotonesSociales() {
  return (
    <div className="triangle-social">
      <span className="triangle-social-separador">o continúa con</span>
      <div className="triangle-social-logos">
        {PROVEEDORES.map((p) => (
          <a
            key={p.id}
            className={`social-btn ${p.id}`}
            href={`${API_CONFIG.BASE_URL}/auth/${p.id}`}
            title={`Entrar con ${p.nombre}`}
            aria-label={`Entrar con ${p.nombre}`}
          >
            {p.icono}
          </a>
        ))}
      </div>
    </div>
  );
}

function FormularioAcceso({ onCerrar }) {
  const navigate = useNavigate();
  const [modo, setModo] = useState('login');
  const [datos, setDatos] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const esRegistro = modo === 'register';

  const actualizar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });
  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setError('');
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      if (esRegistro) {
        await apiService.register(datos);
      } else {
        await apiService.login({ email: datos.email, password: datos.password });
      }
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="triangle-form-content" role="dialog" aria-modal="true" aria-labelledby="titulo-acceso">
      <button className="triangle-close" onClick={onCerrar} aria-label="Cerrar">×</button>
      <h2 id="titulo-acceso">{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      <form className="triangle-form" onSubmit={enviar} noValidate>
        {esRegistro && (
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre de usuario"
              autoComplete="username"
              value={datos.username}
              onChange={actualizar('username')}
              required
            />
          </div>
        )}
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={datos.email}
            onChange={actualizar('email')}
            autoFocus
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
            autoComplete={esRegistro ? 'new-password' : 'current-password'}
            value={datos.password}
            onChange={actualizar('password')}
            required
          />
        </div>
        {esRegistro && (
          <p className="triangle-ayuda">Mínimo 6 caracteres, con mayúscula, minúscula y número.</p>
        )}
        {error && <p className="triangle-error" role="alert">{error}</p>}
        <button className="form-btn-triangle" type="submit" disabled={cargando}>
          {cargando ? 'Un momento…' : esRegistro ? 'Crear cuenta' : 'Entrar'}
        </button>
        <div className="switch-mode-triangle">
          {esRegistro ? (
            <span>¿Ya tienes cuenta?<button type="button" onClick={() => cambiarModo('login')}>Inicia sesión</button></span>
          ) : (
            <span>¿No tienes cuenta?<button type="button" onClick={() => cambiarModo('register')}>Crear cuenta</button></span>
          )}
        </div>
        <BotonesSociales />
      </form>
    </div>
  );
}

export default function LoginTriangle() {
  const [abierto, setAbierto] = useState(false);
  const [mostrarTerminos, setMostrarTerminos] = useState(false);
  const [errorSocial] = useState(() => new URLSearchParams(window.location.search).get('error'));

  // Enter abre el acceso y Escape lo cierra
  useEffect(() => {
    const alPulsar = (e) => {
      if (mostrarTerminos) return;
      if (e.key === 'Enter' && !abierto) {
        // Este Enter solo abre: no debe llegar al formulario que aparece
        e.preventDefault();
        setTimeout(() => setAbierto(true), 0);
      }
      if (e.key === 'Escape' && abierto) setAbierto(false);
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [abierto, mostrarTerminos]);

  return (
    <div className="triangle-bg">
      <FondoEspacioLogin />
      <CampoAsteroides />

      <div className={`escena-planeta ${abierto ? 'escena-abierta' : ''}`}>
        <h1 className={`triangle-title ${abierto ? 'brillo' : ''}`}>LifeLevelUp</h1>
        <button
          type="button"
          className="planeta-boton"
          onClick={() => setAbierto(true)}
          aria-label="Entrar en LifeLevelUp"
        >
          <CinturonPlaneta />
          <img src={planeta} alt="" className="planeta-animado" draggable={false} />
        </button>
        <p className="triangle-subtitle">Tu vida tiene más impacto del que imaginas</p>
        {!abierto && <p className="pista-entrar">Toca el planeta o pulsa Enter para entrar</p>}
        {errorSocial && !abierto && <p className="triangle-error">{errorSocial}</p>}
        <div className="triangle-links-login">
          <a href="#" onClick={(e) => { e.preventDefault(); setMostrarTerminos(true); }}>Términos y condiciones</a>
          <a href="/home">Ver la app sin cuenta</a>
        </div>
      </div>

      {abierto && <div className="triangle-overlay" onClick={() => setAbierto(false)} />}
      <div className={`triangle-panel-anim ${abierto ? 'show' : ''}`}>
        {abierto && <FormularioAcceso onCerrar={() => setAbierto(false)} />}
      </div>

      {mostrarTerminos && (
        <div className="terminos-modal" role="dialog" aria-modal="true" aria-label="Términos y condiciones">
          <div className="terminos-caja">
            <button className="triangle-close" onClick={() => setMostrarTerminos(false)} aria-label="Cerrar">×</button>
            <Terminos onClose={() => setMostrarTerminos(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
