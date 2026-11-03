# LifeLevelUp

Aplicación web que convierte los hábitos saludables y sostenibles en un juego: cada acción mejora la salud de tu avatar y la de un planeta que compartes con la comunidad.

Proyecto final del bootcamp **Desenvolupament Web FullStack amb Java** (Fundación Esplai, 2025), desarrollado en equipo. Después del bootcamp lo he seguido mejorando: unifiqué el backend en este repositorio, conecté el frontend con la API, añadí login social, tests e integración continua, y rediseñé la interfaz.

![React](https://img.shields.io/badge/React-19-149eca) ![Vite](https://img.shields.io/badge/Vite-7-646cff) ![Node.js](https://img.shields.io/badge/Node.js-Express-3c873a) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248) [![CI](https://github.com/AldairBZ/LifeLevelUp/actions/workflows/ci.yml/badge.svg)](https://github.com/AldairBZ/LifeLevelUp/actions/workflows/ci.yml)

## Qué se puede hacer

- **Registro e inicio de sesión** con email y contraseña (JWT), o con **Google, GitHub y Facebook** mediante OAuth 2.0.
- **Salud y bienestar**: registrar hábitos diarios y ver cómo reacciona el avatar.
- **Salud del planeta**: acciones positivas y negativas que cambian el estado del mundo.
- **Desafíos, logros y comunidad**: retos con recompensa, foro y ranking.
- **Dr. Miau**: un asistente que da consejos personalizados con la API de OpenAI y, si no hay clave configurada, responde con consejos de respaldo.

## Stack

| Parte | Tecnologías |
|---|---|
| Frontend | React 19, Vite, React Router, CSS Modules |
| Backend | Node.js, Express, Mongoose, JWT, express-validator, Helmet, rate limiting |
| Base de datos | MongoDB |
| Calidad | ESLint, tests con `node:test` + Supertest, GitHub Actions |

## Estructura

```
LiveLevelUpReact/   Frontend (React + Vite)
backend/            API REST (Express + MongoDB)
  app.js            Aplicación Express (rutas y middleware)
  server.js         Conexión a MongoDB y arranque
  routes/           auth, oauth, users, avatar, health, planet, community, ai, achievements, tips
  models/           User, Tip, Community
  tests/            Tests de la API
```

## Cómo ejecutarlo en local

Necesitas **Node.js 20+** y **MongoDB** en marcha en `localhost:27017`.

```bash
# Backend
cd backend
cp env.example .env      # rellena JWT_SECRET; el resto es opcional
npm install
npm run seed             # carga consejos de ejemplo
npm start                # http://localhost:5000/api

# Frontend (en otra terminal)
cd LiveLevelUpReact
npm install
npm run dev              # http://localhost:5173
```

### Login social (opcional)

Cada proveedor se activa al rellenar sus dos claves en `backend/.env` (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, y lo mismo para GitHub y Facebook). La URL de retorno que hay que registrar en cada proveedor es:

```
http://localhost:5000/api/auth/<proveedor>/callback
```

Mientras un proveedor no esté configurado, su botón vuelve al login con un aviso claro.

## Tests

```bash
cd backend && npm test          # necesita MongoDB local
cd LiveLevelUpReact && npm run lint
```

Los tests cubren el registro, el login, las rutas protegidas, los redirects de OAuth (incluida la protección del parámetro `state`) y la configuración de CORS.

## Equipo

Proyecto creado en equipo durante el bootcamp junto a mis compañeros, que aparecen como contribuidores del repositorio. Yo me encargué del frontend y del backend, y soy quien ha continuado el desarrollo después del curso.

---

Hecho por [Scheneider Baltazar](https://www.linkedin.com/in/scheneiderbz19/) · [GitHub](https://github.com/AldairBZ)
