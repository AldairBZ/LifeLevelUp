import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const backendUrl = () => process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// Cada proveedor usa el flujo OAuth 2.0 de "authorization code"
const PROVIDERS = {
  google: {
    name: 'Google',
    clientId: () => process.env.GOOGLE_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
    async getProfile(accessToken) {
      const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      return { email: data.email, name: data.name };
    },
  },
  github: {
    name: 'GitHub',
    clientId: () => process.env.GITHUB_CLIENT_ID,
    clientSecret: () => process.env.GITHUB_CLIENT_SECRET,
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
    async getProfile(accessToken) {
      const headers = { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'LifeLevelUp' };
      const user = await (await fetch('https://api.github.com/user', { headers })).json();
      let email = user.email;
      // GitHub no siempre expone el email público: se pide el principal verificado
      if (!email) {
        const emails = await (await fetch('https://api.github.com/user/emails', { headers })).json();
        email = Array.isArray(emails) ? emails.find((e) => e.primary && e.verified)?.email : null;
      }
      return { email, name: user.name || user.login };
    },
  },
  facebook: {
    name: 'Facebook',
    clientId: () => process.env.FACEBOOK_CLIENT_ID,
    clientSecret: () => process.env.FACEBOOK_CLIENT_SECRET,
    authorizeUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    scope: 'email public_profile',
    async getProfile(accessToken) {
      const url = `https://graph.facebook.com/me?fields=name,email&access_token=${encodeURIComponent(accessToken)}`;
      const data = await (await fetch(url)).json();
      return { email: data.email, name: data.name };
    },
  },
};

const redirectWithError = (res, message) =>
  res.redirect(`${frontendUrl()}/login?error=${encodeURIComponent(message)}`);

// Nombre de usuario válido (3-30, letras, números y _) y libre en la base de datos
const uniqueUsername = async (name, email) => {
  const base = (name || email.split('@')[0])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 24)
    .padEnd(3, '_');
  let candidate = base;
  while (await User.exists({ username: candidate })) {
    candidate = `${base}_${crypto.randomInt(1000, 9999)}`;
  }
  return candidate;
};

router.get('/:provider', (req, res, next) => {
  const provider = PROVIDERS[req.params.provider];
  if (!provider) return next();

  if (!provider.clientId() || !provider.clientSecret()) {
    return redirectWithError(res, `El acceso con ${provider.name} todavía no está configurado.`);
  }

  // El state firmado evita que otra web complete el login en nombre del usuario
  const state = jwt.sign({ provider: req.params.provider }, process.env.JWT_SECRET, { expiresIn: '10m' });
  const params = new URLSearchParams({
    client_id: provider.clientId(),
    redirect_uri: `${backendUrl()}/api/auth/${req.params.provider}/callback`,
    response_type: 'code',
    scope: provider.scope,
    state,
  });
  res.redirect(`${provider.authorizeUrl}?${params}`);
});

router.get('/:provider/callback', async (req, res, next) => {
  const provider = PROVIDERS[req.params.provider];
  if (!provider) return next();

  try {
    const state = jwt.verify(req.query.state || '', process.env.JWT_SECRET);
    if (state.provider !== req.params.provider || !req.query.code) {
      throw new Error('state no válido');
    }

    const tokenRes = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: provider.clientId(),
        client_secret: provider.clientSecret(),
        code: req.query.code,
        redirect_uri: `${backendUrl()}/api/auth/${req.params.provider}/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const { access_token: accessToken } = await tokenRes.json();
    if (!accessToken) throw new Error('sin access token');

    const profile = await provider.getProfile(accessToken);
    if (!profile.email) {
      return redirectWithError(res, `Tu cuenta de ${provider.name} no comparte un email. Regístrate con email y contraseña.`);
    }

    let user = await User.findOne({ email: profile.email.toLowerCase() });
    if (!user) {
      user = await User.create({
        username: await uniqueUsername(profile.name, profile.email),
        email: profile.email,
        // La cuenta entra siempre por OAuth: se le asigna una contraseña aleatoria que nadie conoce
        password: `${crypto.randomBytes(24).toString('base64url')}Aa1`,
        profile: { nombre: profile.name?.slice(0, 50) },
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
    // El token va en el fragmento (#) para que no quede en logs ni en el historial del servidor
    res.redirect(`${frontendUrl()}/oauth#token=${token}`);
  } catch (error) {
    console.error(`Error en el login con ${provider.name}:`, error.message);
    redirectWithError(res, `No se pudo completar el acceso con ${provider.name}. Inténtalo de nuevo.`);
  }
});

export default router;
