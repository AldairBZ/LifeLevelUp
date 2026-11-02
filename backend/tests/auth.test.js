import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';

// Base de datos propia para los tests, para no tocar los datos de desarrollo
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secreto-solo-para-tests';
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/livelevelup_test';

const { default: app } = await import('../app.js');

const user = { username: 'tester_1', email: 'tester@example.com', password: 'Prueba1234' };

before(async () => {
  await mongoose.connect(MONGODB_URI);
  await mongoose.connection.dropDatabase();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('la API responde en /api/health-check', async () => {
  const res = await request(app).get('/api/health-check');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'OK');
});

test('el registro rechaza contraseñas débiles', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ ...user, password: 'debil' });
  assert.equal(res.status, 400);
});

test('el registro crea el usuario y devuelve un token', async () => {
  const res = await request(app).post('/api/auth/register').send(user);
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, user.email);
  assert.equal(res.body.user.password, undefined, 'nunca se devuelve la contraseña');
});

test('no se puede registrar dos veces el mismo email', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ ...user, username: 'otro_nombre' });
  assert.equal(res.status, 400);
});

test('el login con contraseña incorrecta falla', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'Incorrecta1' });
  assert.equal(res.status, 401);
});

test('con el token del login se accede a /api/auth/me', async () => {
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password });
  assert.equal(login.status, 200);

  const me = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${login.body.token}`);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.username, user.username);
});

test('sin token no se accede a rutas protegidas', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.equal(res.status, 401);
});

test('una ruta inexistente devuelve 404', async () => {
  const res = await request(app).get('/api/no-existe');
  assert.equal(res.status, 404);
});

test('un proveedor social sin configurar vuelve al login con un aviso', async () => {
  delete process.env.GOOGLE_CLIENT_ID;
  const res = await request(app).get('/api/auth/google');
  assert.equal(res.status, 302);
  assert.match(res.headers.location, /\/login\?error=.*Google/);
});

test('un proveedor configurado redirige a su página de acceso', async () => {
  process.env.GITHUB_CLIENT_ID = 'id-de-prueba';
  process.env.GITHUB_CLIENT_SECRET = 'secreto-de-prueba';
  const res = await request(app).get('/api/auth/github');
  assert.equal(res.status, 302);
  assert.match(res.headers.location, /^https:\/\/github\.com\/login\/oauth\/authorize\?/);
  assert.match(res.headers.location, /state=/);
});

test('el callback rechaza un state falsificado', async () => {
  const res = await request(app).get('/api/auth/github/callback?code=x&state=falso');
  assert.equal(res.status, 302);
  assert.match(res.headers.location, /\/login\?error=/);
});

test('un proveedor que no existe devuelve 404', async () => {
  const res = await request(app).get('/api/auth/myspace');
  assert.equal(res.status, 404);
});
