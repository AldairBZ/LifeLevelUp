import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import userRoutes from './routes/users.js';
import avatarRoutes from './routes/avatar.js';
import healthRoutes from './routes/health.js';
import planetRoutes from './routes/planet.js';
import communityRoutes from './routes/community.js';
import aiRoutes from './routes/ai.js';
import achievementsRoutes from './routes/achievements.js';
import tipsRoutes from './routes/tips.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
  }
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/planet', planetRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/tips', tipsRoutes);

// Ruta de salud
app.get('/api/health-check', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LiveLevelUp Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba para /api
app.get('/api', (req, res) => {
  res.json({
    message: 'LiveLevelUp API funcionando correctamente',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      avatar: '/api/avatar',
      health: '/api/health',
      planet: '/api/planet',
      community: '/api/community',
      ai: '/api/ai',
      achievements: '/api/achievements',
      tips: '/api/tips',
      healthCheck: '/api/health-check'
    },
    timestamp: new Date().toISOString()
  });
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../LiveLevelUpReact/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../LiveLevelUpReact/dist/index.html'));
  });
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El formato del ID proporcionado no es válido'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Dato duplicado',
      message: 'Ya existe un registro con estos datos'
    });
  }
  
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

export default app;
