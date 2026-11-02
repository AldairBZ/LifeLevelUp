import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import Layout from '../../components/Layout.jsx';
import HeroSection from './HeroSection';

export default function Home() {
  const [userCount, setUserCount] = useState(1247);
  const [co2Saved] = useState(128304);
  const [waterSaved] = useState(1032000);
  const [kmWalked] = useState(82000);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Simular contador de usuarios en tiempo real
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <HeroSection />
      
      {/* Contador de usuarios en tiempo real */}
      <div className={styles.liveCounter}>
        <div className={styles.counterContent}>
          <span className={styles.counterIcon}>👥</span>
          <span className={styles.counterText}>
            <strong>{userCount.toLocaleString()}</strong> personas transformando sus hábitos ahora mismo
          </span>
          <div className={styles.counterPulse}></div>
        </div>
      </div>



      {/* Sección de Impacto Colectivo */}
      <section className={styles.impactSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🌍 Impacto Colectivo</h2>
          <p className={styles.sectionSubtitle}>
            Juntos estamos creando un cambio real. Estos son nuestros números en tiempo real:
          </p>
        </div>
        
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>🌱</div>
            <div className={styles.impactNumber}>
              {isVisible ? co2Saved.toLocaleString() : '0'}
            </div>
            <div className={styles.impactLabel}>kg de CO₂ evitados</div>
            <div className={styles.impactDescription}>
              Equivale a plantar {Math.floor(co2Saved / 22)} árboles
            </div>
          </div>
          
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>💧</div>
            <div className={styles.impactNumber}>
              {isVisible ? (waterSaved / 1000).toLocaleString() : '0'}
            </div>
            <div className={styles.impactLabel}>litros de agua ahorrados</div>
            <div className={styles.impactDescription}>
              Equivale a {Math.floor(waterSaved / 150)} duchas de 5 minutos
            </div>
          </div>
          
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>🚶‍♂️</div>
            <div className={styles.impactNumber}>
              {isVisible ? kmWalked.toLocaleString() : '0'}
            </div>
            <div className={styles.impactLabel}>km caminados</div>
            <div className={styles.impactDescription}>
              Equivale a dar la vuelta al mundo {Math.floor(kmWalked / 40075)} veces
            </div>
          </div>
        </div>
      </section>

      {/* Sección Newsletter (mejorada) */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterCard}>
          <div className={styles.newsletterHeader}>
            <span className={styles.newsletterEmoji}>🌱</span>
            <h2 className={styles.newsletterTitle}>¡Únete a la revolución sostenible!</h2>
          </div>
          <p className={styles.newsletterText}>
            Recibe consejos personalizados, nuevos desafíos y actualizaciones exclusivas. 
            Sé parte del cambio que el planeta necesita.
          </p>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className={styles.newsletterInput}
              required 
            />
            <button type="submit" className={styles.newsletterButton}>
              🌱 Suscribirme
            </button>
          </form>
          <p className={styles.newsletterDisclaimer}>
            * Solo contenido de valor. Sin spam, puedes darte de baja cuando quieras.
          </p>
        </div>
      </section>
    </Layout>
  );
} 