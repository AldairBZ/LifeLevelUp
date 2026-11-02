import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import planeta from '../../assets/svg/planet.png';
import Terminos from '../home/footer/privacidad/Terminos';
import apiService from '../../config/api';

// Salud de partida del planeta: el anillo la muestra al entrar
const PLANET_HEALTH = 45;
const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function PlanetHero() {
  return (
    <figure className="auth-planet" aria-label={`Salud del planeta: ${PLANET_HEALTH} %`}>
      <img src={planeta} alt="" className="auth-planet__img" />
      <svg className="auth-planet__ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="auth-planet__track" cx="50" cy="50" r={RING_RADIUS} />
        <circle
          className="auth-planet__health"
          cx="50"
          cy="50"
          r={RING_RADIUS}
          style={{
            strokeDasharray: RING_LENGTH,
            '--ring-offset': RING_LENGTH * (1 - PLANET_HEALTH / 100),
          }}
        />
      </svg>
      <figcaption className="auth-planet__caption">
        <strong>{PLANET_HEALTH} %</strong>
        <span>salud del planeta hoy</span>
      </figcaption>
    </figure>
  );
}

function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await apiService.register(form);
      } else {
        await apiService.login({ email: form.email, password: form.password });
      }
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel" aria-labelledby="auth-title">
      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!isRegister}
          className="auth-tab"
          onClick={() => switchMode('login')}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isRegister}
          className="auth-tab"
          onClick={() => switchMode('register')}
        >
          Crear cuenta
        </button>
      </div>

      <h2 id="auth-title" className="auth-panel__title">
        {isRegister ? 'Empieza tu partida' : 'Bienvenido de vuelta'}
      </h2>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <label className="auth-field">
            <span>Nombre de usuario</span>
            <input
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={update('username')}
              required
            />
          </label>
        )}
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            required
          />
        </label>
        <label className="auth-field">
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={form.password}
            onChange={update('password')}
            required
          />
          {isRegister && (
            <small>Mínimo 6 caracteres, con mayúscula, minúscula y número.</small>
          )}
        </label>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Un momento…' : isRegister ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}

export default function LoginTriangle() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <main className="auth">
      <header className="auth__brand">LifeLevelUp</header>

      <div className="auth__story">
        <PlanetHero />
        <h1 className="auth__headline">
          Cada hábito cuenta dos veces: en tu salud y en la del planeta.
        </h1>
        <p className="auth__lead">
          Registra lo que haces cada día, sube de nivel a tu avatar y mira cómo tus decisiones
          mejoran el mundo que compartes con la comunidad.
        </p>
        <nav className="auth__links">
          <button type="button" onClick={() => setShowTerms(true)}>
            Términos y condiciones
          </button>
          <a href="/home">Ver la app sin cuenta</a>
        </nav>
      </div>

      <AuthForm />

      {showTerms && (
        <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Términos y condiciones">
          <div className="auth-modal__box">
            <button className="auth-modal__close" onClick={() => setShowTerms(false)} aria-label="Cerrar">
              ×
            </button>
            <Terminos onClose={() => setShowTerms(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
