import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tip from '../models/Tip.js';

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livelevelup')
.then(() => {
  console.log('✅ Conectado a MongoDB para poblar datos');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Datos iniciales de tips
const initialTips = [
  // Tips de Salud
  {
    title: 'Bebe 8 vasos de agua al día',
    content: 'Mantenerte hidratado es fundamental para tu salud. El agua ayuda a transportar nutrientes, eliminar toxinas y mantener la temperatura corporal.',
    category: 'salud',
    subcategory: 'nutricion',
    impact: {
      health: 15,
      planet: 0
    },
    difficulty: 'facil',
    timeRequired: 'diario',
    icon: '💧',
    tags: ['hidratación', 'agua', 'salud', 'nutrición'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'OMS',
      url: 'https://www.who.int/'
    }
  },
  {
    title: 'Come 5 porciones de frutas y verduras',
    content: 'Las frutas y verduras son ricas en vitaminas, minerales y fibra. Ayudan a prevenir enfermedades crónicas y mantener un peso saludable.',
    category: 'salud',
    subcategory: 'nutricion',
    impact: {
      health: 20,
      planet: 5
    },
    difficulty: 'moderado',
    timeRequired: 'diario',
    icon: '🍎',
    tags: ['nutrición', 'frutas', 'verduras', 'vitaminas'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'OMS',
      url: 'https://www.who.int/'
    }
  },
  {
    title: 'Ejercicio moderado 30 minutos',
    content: 'El ejercicio regular fortalece el corazón, mejora la circulación y libera endorfinas que mejoran tu estado de ánimo.',
    category: 'salud',
    subcategory: 'ejercicio',
    impact: {
      health: 25,
      planet: 0
    },
    difficulty: 'moderado',
    timeRequired: '30min',
    icon: '🏃‍♂️',
    tags: ['ejercicio', 'cardio', 'salud', 'bienestar'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'OMS',
      url: 'https://www.who.int/'
    }
  },
  {
    title: 'Duerme 7-9 horas por noche',
    content: 'El sueño es esencial para la recuperación del cuerpo y la mente. Mejora la memoria, el sistema inmune y el estado de ánimo.',
    category: 'salud',
    subcategory: 'sueño',
    impact: {
      health: 30,
      planet: 0
    },
    difficulty: 'moderado',
    timeRequired: 'diario',
    icon: '😴',
    tags: ['sueño', 'descanso', 'recuperación', 'salud mental'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'National Sleep Foundation',
      url: 'https://www.sleepfoundation.org/'
    }
  },
  {
    title: 'Medita 10 minutos al día',
    content: 'La meditación reduce el estrés, mejora la concentración y promueve la paz mental. Es una práctica simple pero poderosa.',
    category: 'salud',
    subcategory: 'estres',
    impact: {
      health: 10,
      planet: 0
    },
    difficulty: 'facil',
    timeRequired: '15min',
    icon: '🧘‍♀️',
    tags: ['meditación', 'estrés', 'mindfulness', 'bienestar mental'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Harvard Health',
      url: 'https://www.health.harvard.edu/'
    }
  },
  {
    title: 'Toma descansos regulares',
    content: 'Los descansos cortos durante el trabajo mejoran la productividad, reducen la fatiga y previenen problemas de visión.',
    category: 'salud',
    subcategory: 'estres',
    impact: {
      health: 8,
      planet: 0
    },
    difficulty: 'facil',
    timeRequired: '15min',
    icon: '⏰',
    tags: ['productividad', 'descanso', 'trabajo', 'salud ocular'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Mayo Clinic',
      url: 'https://www.mayoclinic.org/'
    }
  },

  // Tips del Planeta
  {
    title: 'Usa transporte público o bicicleta',
    content: 'El transporte público reduce las emisiones de CO2 en un 45% comparado con el coche privado. La bicicleta es aún más ecológica.',
    category: 'planeta',
    subcategory: 'transporte',
    impact: {
      health: 15,
      planet: 25
    },
    difficulty: 'moderado',
    timeRequired: 'diario',
    icon: '🚌',
    tags: ['transporte', 'CO2', 'sostenibilidad', 'aire limpio'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'EPA',
      url: 'https://www.epa.gov/'
    }
  },
  {
    title: 'Recicla papel, plástico y vidrio',
    content: 'Reciclar una tonelada de papel salva 17 árboles y ahorra 26,500 litros de agua. Cada material reciclado reduce la contaminación.',
    category: 'planeta',
    subcategory: 'reciclaje',
    impact: {
      health: 0,
      planet: 20
    },
    difficulty: 'facil',
    timeRequired: '5min',
    icon: '♻️',
    tags: ['reciclaje', 'residuos', 'árboles', 'agua'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'EPA',
      url: 'https://www.epa.gov/'
    }
  },
  {
    title: 'Apaga las luces cuando salgas',
    content: 'Apagar las luces innecesarias puede ahorrar hasta 15% en tu factura de electricidad y reducir las emisiones de CO2.',
    category: 'planeta',
    subcategory: 'energia',
    impact: {
      health: 0,
      planet: 10
    },
    difficulty: 'facil',
    timeRequired: '5min',
    icon: '💡',
    tags: ['energía', 'electricidad', 'ahorro', 'CO2'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Energy.gov',
      url: 'https://www.energy.gov/'
    }
  },
  {
    title: 'Compra productos locales',
    content: 'Los productos locales viajan menos distancia, reduciendo las emisiones de transporte y apoyando la economía local.',
    category: 'planeta',
    subcategory: 'biodiversidad',
    impact: {
      health: 5,
      planet: 15
    },
    difficulty: 'moderado',
    timeRequired: '15min',
    icon: '🛒',
    tags: ['local', 'transporte', 'economía', 'fresco'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'USDA',
      url: 'https://www.usda.gov/'
    }
  },
  {
    title: 'Reduce el uso de plásticos desechables',
    content: 'Los plásticos de un solo uso tardan hasta 500 años en degradarse. Usa botellas reutilizables y bolsas de tela.',
    category: 'planeta',
    subcategory: 'reciclaje',
    impact: {
      health: 0,
      planet: 18
    },
    difficulty: 'moderado',
    timeRequired: 'diario',
    icon: '🥤',
    tags: ['plástico', 'desechable', 'océanos', 'contaminación'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'UN Environment',
      url: 'https://www.unenvironment.org/'
    }
  },
  {
    title: 'Planta un árbol o cuida plantas',
    content: 'Un árbol absorbe hasta 22kg de CO2 al año y produce oxígeno para 4 personas. Las plantas también mejoran la calidad del aire interior.',
    category: 'planeta',
    subcategory: 'biodiversidad',
    impact: {
      health: 5,
      planet: 30
    },
    difficulty: 'moderado',
    timeRequired: '30min',
    icon: '🌳',
    tags: ['árboles', 'CO2', 'oxígeno', 'aire limpio'],
    isActive: true,
    isFeatured: true,
    source: {
      name: 'Arbor Day Foundation',
      url: 'https://www.arborday.org/'
    }
  },
  {
    title: 'Usa electrodomésticos eficientes',
    content: 'Los electrodomésticos con etiqueta energética A+++ consumen hasta 70% menos energía que los modelos antiguos.',
    category: 'planeta',
    subcategory: 'energia',
    impact: {
      health: 0,
      planet: 20
    },
    difficulty: 'dificil',
    timeRequired: '1hora',
    icon: '⚡',
    tags: ['energía', 'eficiencia', 'electrodomésticos', 'ahorro'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Energy Star',
      url: 'https://www.energystar.gov/'
    }
  },

  // Tips Generales
  {
    title: 'Practica la gratitud diaria',
    content: 'Escribir 3 cosas por las que estés agradecido cada día mejora el bienestar mental y reduce el estrés.',
    category: 'general',
    subcategory: 'bienestar',
    impact: {
      health: 12,
      planet: 0
    },
    difficulty: 'facil',
    timeRequired: '15min',
    icon: '🙏',
    tags: ['gratitud', 'bienestar mental', 'estrés', 'positividad'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Psychology Today',
      url: 'https://www.psychologytoday.com/'
    }
  },
  {
    title: 'Aprende algo nuevo cada día',
    content: 'El aprendizaje continuo mantiene tu mente activa, mejora la memoria y puede abrir nuevas oportunidades.',
    category: 'general',
    subcategory: 'productividad',
    impact: {
      health: 8,
      planet: 0
    },
    difficulty: 'facil',
    timeRequired: '15min',
    icon: '📚',
    tags: ['aprendizaje', 'mente', 'memoria', 'crecimiento'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Harvard Health',
      url: 'https://www.health.harvard.edu/'
    }
  },
  {
    title: 'Conecta con la naturaleza',
    content: 'Pasar tiempo en la naturaleza reduce el estrés, mejora el estado de ánimo y aumenta la creatividad.',
    category: 'general',
    subcategory: 'bienestar',
    impact: {
      health: 15,
      planet: 5
    },
    difficulty: 'facil',
    timeRequired: '30min',
    icon: '🌿',
    tags: ['naturaleza', 'estrés', 'bienestar', 'aire libre'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Nature',
      url: 'https://www.nature.com/'
    }
  },
  {
    title: 'Ayuda a otros',
    content: 'Ayudar a otros no solo beneficia a quien recibe la ayuda, sino que también mejora tu propio bienestar y sentido de propósito.',
    category: 'general',
    subcategory: 'social',
    impact: {
      health: 10,
      planet: 5
    },
    difficulty: 'moderado',
    timeRequired: '1hora',
    icon: '🤝',
    tags: ['ayuda', 'comunidad', 'bienestar', 'propósito'],
    isActive: true,
    isFeatured: false,
    source: {
      name: 'Greater Good Science Center',
      url: 'https://greatergood.berkeley.edu/'
    }
  }
];

// Función para poblar la base de datos
const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando población de datos...');

    // Limpiar datos existentes
    await Tip.deleteMany({});
    console.log('🗑️ Datos existentes eliminados');

    // Insertar nuevos datos
    const createdTips = await Tip.insertMany(initialTips);
    console.log(`✅ ${createdTips.length} tips creados exitosamente`);

    // Mostrar estadísticas
    const totalTips = await Tip.countDocuments();
    const featuredTips = await Tip.countDocuments({ isFeatured: true });
    const healthTips = await Tip.countDocuments({ category: 'salud' });
    const planetTips = await Tip.countDocuments({ category: 'planeta' });
    const generalTips = await Tip.countDocuments({ category: 'general' });

    console.log('\n📊 Estadísticas de la base de datos:');
    console.log(`📝 Total de tips: ${totalTips}`);
    console.log(`⭐ Tips destacados: ${featuredTips}`);
    console.log(`🏥 Tips de salud: ${healthTips}`);
    console.log(`🌍 Tips del planeta: ${planetTips}`);
    console.log(`💡 Tips generales: ${generalTips}`);

    console.log('\n🎉 Población de datos completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase(); 