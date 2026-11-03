import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuienesSomos from '../pages/home/footer/equipo/QuienesSomos.jsx';
import Privacidad from '../pages/home/footer/privacidad/Terminos.jsx';
import Referentes from '../pages/home/footer/referentes/Referentes.jsx';
import './Footer.css';

const MODALES = {
  equipo: { titulo: 'Quiénes somos', contenido: () => <QuienesSomos /> },
  privacidad: { titulo: 'Términos y privacidad', contenido: (cerrar) => <Privacidad onClose={cerrar} /> },
  referentes: { titulo: 'Webs de confianza', contenido: () => <Referentes /> },
};

export default function Footer() {
  const [modal, setModal] = useState(null);
  const cerrar = () => setModal(null);

  return (
    <>
      <footer className="llu-footer">
        <div className="llu-footer-grid">
          <div className="llu-footer-marca">
            <p className="llu-footer-logo">LifeLevelUp</p>
            <p>Cada hábito cuenta dos veces: en tu salud y en la del planeta.</p>
          </div>

          <nav aria-label="Secciones">
            <p className="llu-footer-titulo">Explora</p>
            <ul>
              <li><Link to="/home/salud-bienestar">Salud y bienestar</Link></li>
              <li><Link to="/home/salud-planeta">Salud del planeta</Link></li>
              <li><Link to="/home/desafios">Desafíos</Link></li>
              <li><Link to="/home/comunidad">Comunidad</Link></li>
              <li><Link to="/home/blogs">Blog</Link></li>
            </ul>
          </nav>

          <div>
            <p className="llu-footer-titulo">Proyecto</p>
            <ul>
              {Object.entries(MODALES).map(([id, m]) => (
                <li key={id}>
                  <button type="button" onClick={() => setModal(id)}>{m.titulo}</button>
                </li>
              ))}
              <li>
                <a href="https://github.com/AldairBZ/LifeLevelUp" target="_blank" rel="noreferrer">
                  Código en GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="llu-footer-legal">© {new Date().getFullYear()} LifeLevelUp · Proyecto final de desarrollo web full stack</p>
      </footer>

      {modal && (
        <div className="modal-overlay" onClick={cerrar}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={MODALES[modal].titulo}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={cerrar} aria-label="Cerrar">✕</button>
            {MODALES[modal].contenido(cerrar)}
          </div>
        </div>
      )}
    </>
  );
}
