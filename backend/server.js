// Las variables de entorno se cargan antes que cualquier otro módulo
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livelevelup')
.then(() => {
  console.log('✅ Conectado a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
});

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  try {
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error cerrando conexión a MongoDB:', error);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  try {
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error cerrando conexión a MongoDB:', error);
  }
  process.exit(0);
}); 