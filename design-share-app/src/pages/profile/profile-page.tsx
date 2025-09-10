'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth';
import { useProjects } from '@/entities/project';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import styles from './profile-page.module.scss';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const { data: projectsData, isLoading, error } = useProjects();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Можно добавить уведомление об успешном копировании
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Обрабатывается';
      case 'ready':
        return 'Готов';
      case 'error':
        return 'Ошибка';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processing':
        return styles.statusProcessing;
      case 'ready':
        return styles.statusReady;
      case 'error':
        return styles.statusError;
      default:
        return '';
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Пользователь не авторизован
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Design Share
          </Link>
          
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              Привет, {user.name}!
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.welcome}>
          <h1 className={styles.welcomeTitle}>
            Добро пожаловать в личный кабинет
          </h1>
          <p className={styles.welcomeSubtitle}>
            Управляйте своими проектами и настройками
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {projectsData?.total || 0}
            </div>
            <p className={styles.statLabel}>Всего проектов</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {projectsData?.projects?.filter(p => p.status === 'ready').length || 0}
            </div>
            <p className={styles.statLabel}>Готовых проектов</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {projectsData?.projects?.filter(p => p.status === 'processing').length || 0}
            </div>
            <p className={styles.statLabel}>В обработке</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Мои проекты</h2>
            <Link href="/edit/new" className={styles.createButton}>
              Создать проект
            </Link>
          </div>

          {isLoading && (
            <div className={styles.loading}>
              Загрузка проектов...
            </div>
          )}

          {error && (
            <div className={styles.error}>
              Ошибка загрузки проектов: {error.message}
            </div>
          )}

          {!isLoading && !error && (!projectsData?.projects || projectsData.projects.length === 0) && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📄</div>
              <h3 className={styles.emptyStateTitle}>Нет проектов</h3>
              <p className={styles.emptyStateDescription}>
                Создайте свой первый проект, чтобы начать работу
              </p>
              <Link href="/edit/new" className={styles.createButton}>
                Создать проект
              </Link>
            </div>
          )}

          {!isLoading && !error && projectsData?.projects && projectsData.projects.length > 0 && (
            <ul className={styles.projectsList}>
              {projectsData.projects.map((project) => (
                <li key={project.id} className={styles.projectItem}>
                  <div className={styles.projectInfo}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <div className={styles.projectMeta}>
                      <span className={`${styles.status} ${getStatusClass(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      <span>{new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span>{project.originalFileName}</span>
                    </div>
                  </div>
                  
                  <div className={styles.projectActions}>
                    <button
                      onClick={() => handleProjectClick(project)}
                      className={styles.actionButton}
                      title="Просмотреть детали"
                    >
                      👁️
                    </button>
                    {project.status === 'ready' && (
                      <Link
                        href={`/view/${project.slug}`}
                        className={styles.actionButton}
                        title="Открыть для просмотра"
                      >
                        🔗
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Modal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        title={selectedProject?.name}
        size="md"
      >
        {selectedProject && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Статус:</strong> {getStatusText(selectedProject.status)}</p>
              <p><strong>Создан:</strong> {new Date(selectedProject.createdAt).toLocaleString('ru-RU')}</p>
              <p><strong>Файл:</strong> {selectedProject.originalFileName}</p>
              <p><strong>Размер:</strong> {(selectedProject.fileSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>

            {selectedProject.status === 'ready' && selectedProject.viewUrl && (
              <div>
                <h4>Ссылка для просмотра:</h4>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'center',
                  marginTop: '0.5rem'
                }}>
                  <input
                    type="text"
                    value={selectedProject.viewUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Button
                    onClick={() => copyToClipboard(selectedProject.viewUrl)}
                    size="small"
                  >
                    Копировать
                  </Button>
                </div>
              </div>
            )}

            {selectedProject.status === 'processing' && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#fef3c7', 
                borderRadius: '0.5rem',
                color: '#92400e'
              }}>
                <p>Проект обрабатывается. Ссылка для просмотра будет доступна после завершения обработки.</p>
              </div>
            )}

            {selectedProject.status === 'error' && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#fee2e2', 
                borderRadius: '0.5rem',
                color: '#991b1b'
              }}>
                <p>Произошла ошибка при обработке проекта. Попробуйте загрузить файл заново.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProfilePage;