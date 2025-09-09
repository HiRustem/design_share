'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/entities/auth';
import styles from './landing-page.module.scss';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Design Share
          </Link>
          
          <nav className={styles.nav}>
            <Link href="#features" className={styles.navLink}>
              Возможности
            </Link>
            <Link href="#how-it-works" className={styles.navLink}>
              Как это работает
            </Link>
            <Link href="#contact" className={styles.navLink}>
              Контакты
            </Link>
          </nav>

          <div className={styles.authButtons}>
            {isAuthenticated ? (
              <Link href="/profile" className={styles.signupButton}>
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className={styles.loginButton}>
                  Войти
                </Link>
                <Link href="/auth/register" className={styles.signupButton}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Безопасный обмен дизайн-проектами
            </h1>
            <p className={styles.heroSubtitle}>
              Платформа для дизайнеров, которая позволяет безопасно делиться 
              проектами с заказчиками, добавляя водяные знаки и создавая 
              временные ссылки для просмотра.
            </p>
            <div className={styles.heroButtons}>
              {isAuthenticated ? (
                <Link href="/profile" className={styles.ctaButton}>
                  Перейти к проектам
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" className={styles.ctaButton}>
                    Начать бесплатно
                  </Link>
                  <Link href="/auth/login" className={styles.secondaryButton}>
                    Войти в аккаунт
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.featuresContent}>
            <h2 className={styles.featuresTitle}>
              Возможности платформы
            </h2>
            <p className={styles.featuresSubtitle}>
              Все необходимые инструменты для профессиональной работы с дизайн-проектами
            </p>
            
            <div className={styles.featuresGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔒</div>
                <h3 className={styles.featureTitle}>Безопасность</h3>
                <p className={styles.featureDescription}>
                  Добавляйте водяные знаки к вашим PDF-файлам для защиты 
                  авторских прав и предотвращения несанкционированного использования.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>⏰</div>
                <h3 className={styles.featureTitle}>Временные ссылки</h3>
                <p className={styles.featureDescription}>
                  Создавайте временные ссылки для просмотра проектов, 
                  которые автоматически истекают через заданное время.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎨</div>
                <h3 className={styles.featureTitle}>Гибкие настройки</h3>
                <p className={styles.featureDescription}>
                  Настраивайте водяные знаки: размер, цвет, прозрачность, 
                  угол поворота и паттерн размещения на страницах.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>📱</div>
                <h3 className={styles.featureTitle}>Удобный интерфейс</h3>
                <p className={styles.featureDescription}>
                  Интуитивно понятный интерфейс для быстрой работы с проектами 
                  и управления настройками водяных знаков.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>Статистика просмотров</h3>
                <p className={styles.featureDescription}>
                  Отслеживайте, кто и когда просматривал ваши проекты, 
                  получайте детальную статистику по каждому файлу.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <h3 className={styles.featureTitle}>Быстрая обработка</h3>
                <p className={styles.featureDescription}>
                  Мгновенная обработка PDF-файлов с применением водяных знаков 
                  и создание ссылок для просмотра.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.howItWorksContent}>
            <h2 className={styles.howItWorksTitle}>
              Как это работает
            </h2>
            
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>Загрузите PDF</h3>
                <p className={styles.stepDescription}>
                  Загрузите ваш дизайн-проект в формате PDF на платформу
                </p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>Настройте водяной знак</h3>
                <p className={styles.stepDescription}>
                  Выберите текст, размер, цвет и паттерн размещения водяного знака
                </p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>Получите ссылку</h3>
                <p className={styles.stepDescription}>
                  Получите временную ссылку для безопасного просмотра проекта
                </p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <h3 className={styles.stepTitle}>Поделитесь с заказчиком</h3>
                <p className={styles.stepDescription}>
                  Отправьте ссылку заказчику для просмотра защищенного проекта
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className={styles.footer}>
        <div className={styles.footerContent}>
          <h3 className={styles.footerTitle}>Design Share</h3>
          <p className={styles.footerDescription}>
            Платформа для безопасного обмена дизайн-проектами
          </p>
          
          <div className={styles.footerLinks}>
            <Link href="/auth/register" className={styles.footerLink}>
              Регистрация
            </Link>
            <Link href="/auth/login" className={styles.footerLink}>
              Вход
            </Link>
            <a href="mailto:support@designshare.com" className={styles.footerLink}>
              Поддержка
            </a>
          </div>
          
          <p className={styles.copyright}>
            © 2024 Design Share. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;