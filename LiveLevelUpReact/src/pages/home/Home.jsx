import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { CampoAsteroides, CinturonPlaneta } from '../login/Asteroides';
import planeta from '../../assets/svg/planet.webp';
import drMiau from '../../assets/gato-medico.webp';
import './Home.css';

// Los tres pasos del juego: el planeta mejora a medida que se recorren
const PASOS = [
  {
    salud: 45,
    titulo: 'Registra lo que haces',
    texto: 'Beber agua, caminar en vez de coger el coche, reciclar. Cada hábito suma puntos a tu salud y a la del planeta.',
  },
  {
    salud: 68,
    titulo: 'Mira cómo cambia tu mundo',
    texto: 'Tu avatar gana energía y el planeta recupera color. Los malos hábitos también cuentan: verás el efecto al momento.',
  },
  {
    salud: 91,
    titulo: 'Juega con la comunidad',
    texto: 'Desafíos semanales, logros y un foro donde compartir lo que funciona. Lo que hacéis juntos mueve el planeta de todos.',
  },
];

const ZONAS = [
  { ruta: '/home/salud-bienestar', nombre: 'Salud y bienestar', texto: 'Tus hábitos diarios, tu avatar y los consejos de Dr. Miau.', color: 'var(--llu-biome)' },
  { ruta: '/home/salud-planeta', nombre: 'Salud del planeta', texto: 'Acciones que mejoran o empeoran el estado del mundo.', color: '#5ab8ff' },
  { ruta: '/home/desafios', nombre: 'Desafíos', texto: 'Retos con recompensa para subir de nivel más rápido.', color: 'var(--llu-sun)' },
  { ruta: '/home/comunidad', nombre: 'Comunidad', texto: 'Historias reales y un foro para compartir lo que te funciona.', color: '#ff9fd1' },
];

const CONSEJOS = [
  'Un vaso de agua al despertar ya cuenta como hábito.',
  'Diez minutos de paseo valen más que una hora que no llega.',
  'Apagar las luces al salir es la acción más fácil del juego.',
  'Dormir bien sube tu energía más que cualquier otra cosa.',
];

const RADIO = 47;
const PERIMETRO = 2 * Math.PI * RADIO;

function AnilloSalud({ salud }) {
  return (
    <svg className="home-anillo" viewBox="0 0 100 100" aria-hidden="true">
      <circle className="home-anillo-pista" cx="50" cy="50" r={RADIO} />
      <circle
        className="home-anillo-salud"
        cx="50"
        cy="50"
        r={RADIO}
        style={{ strokeDasharray: PERIMETRO, strokeDashoffset: PERIMETRO * (1 - salud / 100) }}
      />
    </svg>
  );
}

// Muestra el elemento cuando entra en pantalla
function useVisible(opciones) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), opciones);
    obs.observe(el);
    return () => obs.disconnect();
  }, [opciones]);
  return [ref, visible];
}

function Contador({ hasta, sufijo = '', activo }) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    if (!activo) return undefined;
    let frame;
    const inicio = performance.now();
    const paso = (t) => {
      const p = Math.min((t - inicio) / 1400, 1);
      setValor(Math.round(hasta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [hasta, activo]);
  return <>{valor.toLocaleString('es-ES')}{sufijo}</>;
}

const OPCIONES_IMPACTO = { threshold: 0.4 };

export default function Home() {
  const [pasoActivo, setPasoActivo] = useState(0);
  const [consejo, setConsejo] = useState(0);
  const pasosRef = useRef([]);
  const [impactoRef, impactoVisible] = useVisible(OPCIONES_IMPACTO);

  // El paso que ocupa el centro de la pantalla decide la salud del planeta
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setPasoActivo(Number(e.target.dataset.paso));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    pasosRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setConsejo((c) => (c + 1) % CONSEJOS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Layout>
      <div className="home">
        <CampoAsteroides cantidad={8} />

        <section className="home-hero">
          <div className="home-hero-texto">
            <h1>Tu planeta sube de nivel contigo.</h1>
            <p>
              LifeLevelUp convierte tus hábitos en un juego: cuidas de ti, tu avatar crece y el
              planeta que compartes con la comunidad recupera la salud.
            </p>
            <div className="home-acciones">
              <Link to="/home/salud-bienestar" className="home-boton home-boton-principal">
                Empezar mi partida
              </Link>
              <Link to="/home/salud-planeta" className="home-boton">
                Ver el planeta
              </Link>
            </div>
          </div>
          <div className="home-hero-planeta">
            <CinturonPlaneta />
            <img src={planeta} alt="" className="planeta-animado" width="420" height="420" />
          </div>
        </section>

        <section className="home-historia" aria-labelledby="como-funciona">
          <div className="home-historia-planeta">
            <div className="home-historia-sticky">
              <div className="home-planeta-salud">
                <img
                  src={planeta}
                  alt=""
                  className="planeta-animado"
                  style={{ filter: `saturate(${0.35 + PASOS[pasoActivo].salud / 120})` }}
                />
                <AnilloSalud salud={PASOS[pasoActivo].salud} />
              </div>
              <p className="home-salud-dato">
                <strong>{PASOS[pasoActivo].salud} %</strong> salud del planeta
              </p>
            </div>
          </div>
          <div className="home-historia-pasos">
            <h2 id="como-funciona">Cómo se juega</h2>
            <ol>
              {PASOS.map((p, i) => (
                <li
                  key={p.titulo}
                  ref={(el) => (pasosRef.current[i] = el)}
                  data-paso={i}
                  className={i === pasoActivo ? 'activo' : ''}
                >
                  <span className="home-paso-numero">{i + 1}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="home-zonas" aria-labelledby="zonas">
          <h2 id="zonas">Elige por dónde empezar</h2>
          <ul>
            {ZONAS.map((z) => (
              <li key={z.ruta}>
                <Link to={z.ruta} style={{ '--zona': z.color }}>
                  <span className="home-zona-punto" aria-hidden="true" />
                  <span className="home-zona-nombre">{z.nombre}</span>
                  <span className="home-zona-texto">{z.texto}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-miau">
          <img src={drMiau} alt="Dr. Miau, el gato médico que da los consejos" width="260" height="260" loading="lazy" />
          <div>
            <h2>Dr. Miau te acompaña</h2>
            <p className="home-miau-bocadillo" aria-live="polite">{CONSEJOS[consejo]}</p>
            <p className="home-miau-nota">
              Con la cuenta iniciada, sus consejos se adaptan a tus hábitos y a cómo va tu planeta.
            </p>
          </div>
        </section>

        <section className="home-impacto" ref={impactoRef} aria-labelledby="impacto">
          <h2 id="impacto">Lo que suma la comunidad</h2>
          <dl>
            <div>
              <dt>kg de CO₂ evitados</dt>
              <dd><Contador hasta={128304} activo={impactoVisible} /></dd>
            </div>
            <div>
              <dt>litros de agua ahorrados</dt>
              <dd><Contador hasta={1032} sufijo=" mil" activo={impactoVisible} /></dd>
            </div>
            <div>
              <dt>km caminados</dt>
              <dd><Contador hasta={82000} activo={impactoVisible} /></dd>
            </div>
          </dl>
          <p className="home-impacto-nota">Datos de ejemplo de la versión de demostración.</p>
        </section>

        <section className="home-final">
          <h2>Tu primera misión dura un minuto.</h2>
          <Link to="/home/salud-bienestar" className="home-boton home-boton-principal">
            Registrar mi primer hábito
          </Link>
        </section>
      </div>
    </Layout>
  );
}
