import React, { useMemo } from 'react';
import './asteroides.css';

// Genera una roca irregular: un polígono con el radio variando en cada vértice
function formaRoca(seed) {
  const puntos = [];
  const vertices = 9;
  for (let i = 0; i < vertices; i++) {
    const angulo = (i / vertices) * Math.PI * 2;
    const ruido = 0.72 + ((Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453) % 1 + 1) % 1 * 0.28;
    puntos.push(`${(50 + Math.cos(angulo) * 46 * ruido).toFixed(1)},${(50 + Math.sin(angulo) * 46 * ruido).toFixed(1)}`);
  }
  return puntos.join(' ');
}

function Roca({ seed, className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={formaRoca(seed)} className="roca-cuerpo" />
      <circle cx="38" cy="40" r="7" className="roca-crater" />
      <circle cx="60" cy="62" r="5" className="roca-crater" />
      <circle cx="62" cy="34" r="3" className="roca-crater" />
    </svg>
  );
}

// Asteroides que cruzan el espacio de fondo, cada uno a su ritmo
export function CampoAsteroides({ cantidad = 12 }) {
  const rocas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        seed: i + 1,
        tam: 14 + ((i * 37) % 34),
        top: (i * 53) % 92,
        duracion: 38 + ((i * 17) % 40),
        retraso: -((i * 11) % 60),
        giro: 12 + ((i * 7) % 20),
        haciaIzquierda: i % 2 === 0,
      })),
    [cantidad]
  );

  return (
    <div className="campo-asteroides" aria-hidden="true">
      {rocas.map((r) => (
        <div
          key={r.seed}
          className={`asteroide-viaje ${r.haciaIzquierda ? 'hacia-izquierda' : ''}`}
          style={{
            top: `${r.top}%`,
            animationDuration: `${r.duracion}s`,
            animationDelay: `${r.retraso}s`,
          }}
        >
          <Roca
            seed={r.seed}
            className="asteroide"
            style={{ width: r.tam, height: r.tam, animationDuration: `${r.giro}s` }}
          />
        </div>
      ))}
    </div>
  );
}

// Cinturón de rocas pequeñas orbitando alrededor del planeta
export function CinturonPlaneta() {
  const rocas = [
    { seed: 3, angulo: 0, tam: 16 },
    { seed: 7, angulo: 72, tam: 11 },
    { seed: 11, angulo: 150, tam: 14 },
    { seed: 5, angulo: 215, tam: 9 },
    { seed: 9, angulo: 290, tam: 12 },
  ];
  return (
    <div className="cinturon" aria-hidden="true">
      {rocas.map((r) => (
        <div key={r.seed} className="cinturon-brazo" style={{ transform: `rotate(${r.angulo}deg)` }}>
          <Roca seed={r.seed} className="asteroide asteroide-orbita" style={{ width: r.tam, height: r.tam }} />
        </div>
      ))}
    </div>
  );
}
