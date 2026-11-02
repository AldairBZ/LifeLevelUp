import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout.jsx';
import styles from './SaludBienestar.module.css';
import gatoMedico from '../../../assets/gato-medico.png';

const catTips = [
  "¡Hola! Recuerda beber agua cada hora 🥤",
  "Una manzana al día mantiene al doctor lejos 🍎",
  "El ejercicio libera endorfinas, ¡la hormona de la felicidad! 🏃‍♂️",
  "Dormir bien es clave para tu salud mental 😴",
  "La meditación reduce el estrés y mejora la concentración 🧘‍♀️"
];

export default function SaludBienestar() {
  const [showHabitsDropdown, setShowHabitsDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showCatTip, setShowCatTip] = useState(false);
  const [healthStatus, setHealthStatus] = useState('Neutro');
  const [healthEmoji, setHealthEmoji] = useState('😐');
  const [userHabits, setUserHabits] = useState([]);
  const [userActions, setUserActions] = useState([]);
  const [avatarMood, setAvatarMood] = useState('happy');
  const [currentTip, setCurrentTip] = useState('');
  const [showAchievements, setShowAchievements] = useState(true);
  const [achievements] = useState([
    { id: 1, name: 'Primer paso saludable', icon: '🌱', unlocked: true },
    { id: 2, name: 'Come-frutas', icon: '🍎', unlocked: true },
    { id: 3, name: 'Hidratación perfecta', icon: '💧', unlocked: false },
    { id: 4, name: 'Ejercicio diario', icon: '🏃‍♂️', unlocked: false },
    { id: 5, name: 'Descanso óptimo', icon: '😴', unlocked: false }
  ]);

  const habits = [
    { id: 1, name: 'Beber 8 vasos de agua', impact: 15, icon: '💧' },
    { id: 2, name: 'Comer 5 frutas al día', impact: 20, icon: '🍎' },
    { id: 3, name: 'Ejercicio 30 min', impact: 25, icon: '🏃‍♂️' },
    { id: 4, name: 'Dormir 8 horas', impact: 30, icon: '😴' },
    { id: 5, name: 'Meditar 10 min', impact: 10, icon: '🧘‍♀️' }
  ];

  const actions = [
    { id: 1, name: 'Tomar vitaminas', impact: 5, icon: '💊' },
    { id: 2, name: 'Salir a caminar', impact: 15, icon: '🚶‍♂️' },
    { id: 3, name: 'Leer un libro', impact: 8, icon: '📚' },
    { id: 4, name: 'Llamar a un amigo', impact: 12, icon: '📞' }
  ];


  useEffect(() => {
    const tipInterval = setInterval(() => {
      const randomTip = catTips[Math.floor(Math.random() * catTips.length)];
      setCurrentTip(randomTip);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, []);

  const addHabit = (habit) => {
    if (!userHabits.find(h => h.id === habit.id)) {
      setUserHabits([...userHabits, habit]);
      updateHealthStatus(habit.impact);
    }
  };

  const addAction = (action) => {
    if (!userActions.find(a => a.id === action.id)) {
      setUserActions([...userActions, action]);
      updateHealthStatus(action.impact);
    }
  };

  const removeHabit = (habitId) => {
    const habit = userHabits.find(h => h.id === habitId);
    if (habit) {
      setUserHabits(userHabits.filter(h => h.id !== habitId));
      updateHealthStatus(-habit.impact);
    }
  };

  const removeAction = (actionId) => {
    const action = userActions.find(a => a.id === actionId);
    if (action) {
      setUserActions(userActions.filter(a => a.id !== actionId));
      updateHealthStatus(-action.impact);
    }
  };

  const updateHealthStatus = (impact) => {
    const totalImpact = userHabits.reduce((sum, h) => sum + h.impact, 0) + 
                       userActions.reduce((sum, a) => sum + a.impact, 0) + impact;
    
    if (totalImpact >= 80) {
      setHealthStatus('Excelente');
      setHealthEmoji('😄');
      setAvatarMood('excited');
    } else if (totalImpact >= 60) {
      setHealthStatus('Muy Bueno');
      setHealthEmoji('😊');
      setAvatarMood('happy');
    } else if (totalImpact >= 40) {
      setHealthStatus('Bueno');
      setHealthEmoji('🙂');
      setAvatarMood('neutral');
    } else if (totalImpact >= 20) {
      setHealthStatus('Regular');
      setHealthEmoji('😐');
      setAvatarMood('worried');
    } else {
      setHealthStatus('Necesita Mejora');
      setHealthEmoji('😟');
      setAvatarMood('sad');
    }
  };

  const getImpactColor = (impact) => {
    if (impact >= 80) return '#10b981';
    if (impact >= 60) return '#34d399';
    if (impact >= 40) return '#fbbf24';
    if (impact >= 20) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Layout>
      <div className={styles.saludBienestarWrapper}>
        {/* ===== HERO SECTION MODERNO ===== */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroParticles}></div>
            <div className={styles.heroGradient}></div>
          </div>
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>🌱</span>
                Interactivo
              </div>
              <h1 className={styles.heroTitle}>
                Interactúa con tu
                <span className={styles.heroTitleHighlight}> avatar de salud</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Simula hábitos y rutinas para ver cómo impactan en tu bienestar. 
                ¡Tu avatar reacciona a tus decisiones en tiempo real!
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN PRINCIPAL INTERACTIVA ===== */}
        <section className={styles.mainInteractiveSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>¿Por qué es importante la salud y el bienestar?</h2>
            <p className={styles.sectionSubtitle}>
              La salud y el bienestar son la base para una vida plena. Adoptar hábitos saludables y tomar buenas decisiones diarias impacta directamente en tu energía, ánimo y calidad de vida. ¡Empieza hoy a mejorar tu salud y verás cómo todo cambia a tu alrededor!
            </p>
          </div>

          <div className={styles.interactiveContainer}>
            {/* ===== PANEL IZQUIERDO - HÁBITOS Y ACCIONES ===== */}
            <div className={styles.leftPanel}>
              {/* Panel de Hábitos */}
              <div className={styles.habitsPanel}>
                <button 
                  className={styles.dropdownButton}
                  onClick={() => setShowHabitsDropdown(!showHabitsDropdown)}
                >
                  Hábitos ▼
                </button>
                
                {showHabitsDropdown && (
                  <div className={styles.dropdownMenu}>
                    {habits.map(habit => (
                      <div 
                        key={habit.id} 
                        className={styles.dropdownItem}
                        onClick={() => addHabit(habit)}
                      >
                        <span className={styles.itemIcon}>{habit.icon}</span>
                        <span className={styles.itemName}>{habit.name}</span>
                        <span 
                          className={styles.itemImpact}
                          style={{ color: getImpactColor(habit.impact) }}
                        >
                          {habit.impact} años
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hábitos Seleccionados */}
                <div className={styles.selectedItems}>
                  {userHabits.map(habit => (
                    <div key={habit.id} className={styles.selectedItem}>
                      <span className={styles.itemIcon}>{habit.icon}</span>
                      <span className={styles.itemName}>{habit.name}</span>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeHabit(habit.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel de Acciones */}
              <div className={styles.actionsPanel}>
                <button 
                  className={styles.dropdownButton}
                  onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                >
                  Acciones ▼
                </button>
                
                {showActionsDropdown && (
                  <div className={styles.dropdownMenu}>
                    {actions.map(action => (
                      <div 
                        key={action.id} 
                        className={styles.dropdownItem}
                        onClick={() => addAction(action)}
                      >
                        <span className={styles.itemIcon}>{action.icon}</span>
                        <span className={styles.itemName}>{action.name}</span>
                        <span 
                          className={styles.itemImpact}
                          style={{ color: getImpactColor(action.impact) }}
                        >
                          {action.impact} años
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acciones Seleccionadas */}
                <div className={styles.selectedItems}>
                  {userActions.map(action => (
                    <div key={action.id} className={styles.selectedItem}>
                      <span className={styles.itemIcon}>{action.icon}</span>
                      <span className={styles.itemName}>{action.name}</span>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeAction(action.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== PANEL CENTRAL - AVATAR ===== */}
            <div className={styles.centerPanel}>
              <div className={styles.avatarContainer}>
                <div className={`${styles.avatar} ${styles[avatarMood]}`}>
                  <div className={styles.avatarFace}>
                    <div className={styles.avatarEyes}>
                      <div className={styles.eye}></div>
                      <div className={styles.eye}></div>
                    </div>
                    <div className={styles.avatarMouth}></div>
                  </div>
                  <div className={styles.avatarBody}>
                    <div className={styles.avatarShirt}></div>
                  </div>
                </div>
              </div>
              
              <div className={styles.healthStatus}>
                <h3>Estado de salud: {healthStatus}</h3>
                <span className={styles.healthEmoji}>{healthEmoji}</span>
              </div>

              {/* Simulador de Impacto */}
              <div className={styles.impactSimulator}>
                <h4>Impacto en tu vida:</h4>
                <div className={styles.impactBar}>
                  <div 
                    className={styles.impactFill}
                    style={{ 
                      width: `${Math.max(0, Math.min(100, 50 + (userHabits.reduce((sum, h) => sum + h.impact, 0) + userActions.reduce((sum, a) => sum + a.impact, 0)) * 5))}%`,
                      backgroundColor: getImpactColor(userHabits.reduce((sum, h) => sum + h.impact, 0) + userActions.reduce((sum, a) => sum + a.impact, 0))
                    }}
                  ></div>
                </div>
                <p className={styles.impactText}>
                  {userHabits.reduce((sum, h) => sum + h.impact, 0) + userActions.reduce((sum, a) => sum + a.impact, 0)} años de impacto
                </p>
              </div>
            </div>

            {/* ===== PANEL DERECHO - BOT Y LOGROS ===== */}
            <div className={styles.rightPanel}>
              {/* Bot de Gato */}
              <div className={styles.catBot}>
                <div className={styles.catAvatar} onClick={() => setShowCatTip(!showCatTip)}>
                  <img 
                    src={gatoMedico} 
                    alt="Gato Doctor" 
                    className={styles.catImage}
                  />
                </div>
                
                {showCatTip && (
                  <div className={styles.catTip}>
                    <p>{currentTip}</p>
                    <button 
                      className={styles.closeTipButton}
                      onClick={() => setShowCatTip(false)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Recordatorio de Agua */}
              <div className={styles.waterReminder}>
                <span className={styles.waterIcon}>💧</span>
                <p>Recuerda beber 2 litros de agua al día.</p>
              </div>

              {/* Panel de Logros */}
              <div className={styles.achievementsPanel}>
                <div className={styles.achievementsHeader}>
                  <span className={styles.trophyIcon}>🏆</span>
                  <h3>Logros</h3>
                </div>
                
                {showAchievements && (
                <div className={styles.achievementsList}>
                  {achievements.map(achievement => (
                    <div 
                      key={achievement.id} 
                      className={`${styles.achievement} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
                    >
                      <span className={styles.achievementIcon}>{achievement.icon}</span>
                      <span className={styles.achievementName}>{achievement.name}</span>
                      {achievement.unlocked && <span className={styles.unlockBadge}>✓</span>}
                    </div>
                  ))}
                </div>
                )}

                <button 
                  className={styles.closeAchievementsButton}
                  onClick={() => setShowAchievements(!showAchievements)}
                >
                  {showAchievements ? 'Cerrar' : 'Ver logros'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN DE PROGRESO (MOVIDA DESDE HOME) ===== */}
        <section className={styles.progressSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎮 Tu Progreso</h2>
            <p className={styles.sectionSubtitle}>
              Desbloquea logros y sube de nivel mientras mejoras tus hábitos
            </p>
          </div>
          
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <div className={styles.progressIcon}>🏆</div>
              <h3 className={styles.progressTitle}>Nivel Actual</h3>
              <div className={styles.progressLevel}>Nivel 7 - Eco Guerrero</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '75%'}}></div>
              </div>
              <div className={styles.progressText}>75% completado</div>
            </div>
            
            <div className={styles.progressCard}>
              <div className={styles.progressIcon}>⭐</div>
              <h3 className={styles.progressTitle}>Puntos Totales</h3>
              <div className={styles.progressPoints}>2,847 puntos</div>
              <div className={styles.progressRank}>Top 15% de usuarios</div>
            </div>
            
            <div className={styles.progressCard}>
              <div className={styles.progressIcon}>🏅</div>
              <h3 className={styles.progressTitle}>Insignias Desbloqueadas</h3>
              <div className={styles.badgesGrid}>
                <span className={styles.badge}>🌱</span>
                <span className={styles.badge}>💧</span>
                <span className={styles.badge}>♻️</span>
                <span className={styles.badge}>🚶‍♀️</span>
                <span className={styles.badge}>🥦</span>
                <span className={styles.badge}>⚡</span>
              </div>
              <div className={styles.progressText}>6 de 12 insignias</div>
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN DE HÁBITOS DIARIOS SOSTENIBLES (MOVIDA DESDE HOME) ===== */}
        <section className={styles.habitsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>💡 Hábitos Diarios Sostenibles</h2>
            <p className={styles.sectionSubtitle}>
              Pequeños cambios que generan un gran impacto en tu vida y el planeta
            </p>
          </div>
          
          <div className={styles.habitsGrid}>
            <div className={styles.habitCard}>
              <div className={styles.habitHeader}>
                <span className={styles.habitEmoji}>🌅</span>
                <h3 className={styles.habitTitle}>Mañana Sostenible</h3>
              </div>
              <ul className={styles.habitList}>
                <li>Desayuna alimentos locales y de temporada</li>
                <li>Usa una taza reutilizable para el café</li>
                <li>Camina o usa bici para distancias cortas</li>
                <li>Dúchate en menos de 5 minutos</li>
              </ul>
            </div>
            
            <div className={styles.habitCard}>
              <div className={styles.habitHeader}>
                <span className={styles.habitEmoji}>🌞</span>
                <h3 className={styles.habitTitle}>Durante el Día</h3>
              </div>
              <ul className={styles.habitList}>
                <li>Lleva tu propia botella de agua</li>
                <li>Come más vegetales y menos carne</li>
                <li>Apaga luces y dispositivos innecesarios</li>
                <li>Usa escaleras en lugar de ascensor</li>
              </ul>
            </div>
            
            <div className={styles.habitCard}>
              <div className={styles.habitHeader}>
                <span className={styles.habitEmoji}>🌙</span>
                <h3 className={styles.habitTitle}>Noche Consciente</h3>
              </div>
              <ul className={styles.habitList}>
                <li>Recicla y separa residuos correctamente</li>
                <li>Reflexiona sobre tu impacto diario</li>
                <li>Desconecta dispositivos antes de dormir</li>
                <li>Planifica el día siguiente de forma sostenible</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 