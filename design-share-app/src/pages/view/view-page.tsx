'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useProjectBySlug } from '@/entities/project';
import styles from './view-page.module.scss';

interface ViewPageProps {
  slug: string;
}

const ViewPage: React.FC<ViewPageProps> = ({ slug }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: project, isLoading: projectLoading, error: projectError } = useProjectBySlug(slug);

  // Загрузка PDF для просмотра
  useEffect(() => {
    if (!project?.viewUrl) return;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString();

        const loadingTask = pdfjsLib.getDocument(project.viewUrl!);
        const pdf = await loadingTask.promise;

        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [project?.viewUrl]);

  // Рендер страницы
  useEffect(() => {
    if (!project?.viewUrl || !canvasRef.current || totalPages === 0) return;

    const renderPage = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        const loadingTask = pdfjsLib.getDocument(project.viewUrl!);
        const pdf = await loadingTask.promise;
        
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render page');
      }
    };

    renderPage();
  }, [project?.viewUrl, currentPage, scale, totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  }, [currentPage]);

  const zoomIn = useCallback(() => {
    setScale(s => Math.min(s + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(s => Math.max(s - 0.25, 0.5));
  }, []);

  if (projectLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Загрузка проекта...
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>❌</div>
          <h2 className={styles.errorTitle}>Ошибка загрузки</h2>
          <p className={styles.errorDescription}>
            Не удалось загрузить проект. Возможно, ссылка недействительна или проект был удален.
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>🔍</div>
          <h2 className={styles.notFoundTitle}>Проект не найден</h2>
          <p className={styles.notFoundDescription}>
            Проект с указанной ссылкой не существует или был удален.
          </p>
          <Link href="/" className={styles.backLink}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  if (project.status !== 'ready') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⏳</div>
          <h2 className={styles.errorTitle}>Проект не готов</h2>
          <p className={styles.errorDescription}>
            Проект еще обрабатывается. Попробуйте позже.
          </p>
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
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.viewer}>
          <div className={styles.viewerHeader}>
            <h1 className={styles.projectTitle}>{project.name}</h1>
            
            <div className={styles.viewerControls}>
              <div className={styles.zoomControls}>
                <button
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  className={styles.zoomButton}
                  title="Уменьшить"
                >
                  −
                </button>
                <span className={styles.zoomLevel}>
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 3}
                  className={styles.zoomButton}
                  title="Увеличить"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className={styles.pdfContainer}>
            {isLoading ? (
              <div className={styles.loading}>
                Загрузка PDF...
              </div>
            ) : error ? (
              <div className={styles.error}>
                <div className={styles.errorIcon}>❌</div>
                <h3 className={styles.errorTitle}>Ошибка отображения</h3>
                <p className={styles.errorDescription}>{error}</p>
              </div>
            ) : (
              <canvas ref={canvasRef} className={styles.pdfCanvas} />
            )}
          </div>

          {totalPages > 0 && (
            <div className={styles.navigation}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={styles.navButton}
              >
                ← Предыдущая
              </button>
              <span className={styles.pageInfo}>
                Страница {currentPage} из {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={styles.navButton}
              >
                Следующая →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewPage;