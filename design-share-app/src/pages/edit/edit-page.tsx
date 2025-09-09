'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PdfEditor } from '@/features/pdf-editor';
import { useCreateProject, useProcessProject } from '@/entities/project';
import { useAuthStore } from '@/entities/auth';
import styles from './edit-page.module.scss';

interface EditPageProps {
  slug: string;
}

const EditPage: React.FC<EditPageProps> = ({ slug }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const createProjectMutation = useCreateProject({
    onSuccess: (project) => {
      router.push(`/profile`);
    },
    onError: (error) => {
      setUploadError(error.message || 'Ошибка создания проекта');
      setIsUploading(false);
    },
  });

  const processProjectMutation = useProcessProject({
    onSuccess: () => {
      router.push(`/profile`);
    },
    onError: (error) => {
      setUploadError(error.message || 'Ошибка обработки проекта');
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Пожалуйста, выберите PDF файл');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setUploadError('Размер файла не должен превышать 50MB');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    
    // Создаем URL для предпросмотра
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setShowEditor(true);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSave = useCallback(async (pdfBytes: Uint8Array, name: string) => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Создаем новый файл из обработанных байтов
      const processedFile = new File([pdfBytes], `${name}.pdf`, {
        type: 'application/pdf',
      });

      // Создаем проект
      await createProjectMutation.mutateAsync({
        name,
        file: processedFile,
      });
    } catch (error) {
      // Ошибка уже обработана в onError
    }
  }, [selectedFile, user, createProjectMutation]);

  const handleCancel = useCallback(() => {
    setShowEditor(false);
    setSelectedFile(null);
    setFileUrl('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.error}>
            Необходимо войти в аккаунт для создания проектов
          </div>
        </div>
      </div>
    );
  }

  if (showEditor && fileUrl) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/profile" className={styles.logo}>
              Design Share
            </Link>
            <Link href="/profile" className={styles.backButton}>
              ← Вернуться к проектам
            </Link>
          </div>
        </header>
        
        <PdfEditor
          fileUrl={fileUrl}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/profile" className={styles.logo}>
            Design Share
          </Link>
          <Link href="/profile" className={styles.backButton}>
            ← Вернуться к проектам
          </Link>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.uploadSection}>
          <h1 className={styles.uploadTitle}>Создать новый проект</h1>
          <p className={styles.uploadDescription}>
            Загрузите PDF файл для добавления водяных знаков и создания ссылки для просмотра
          </p>

          <div
            className={styles.uploadArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={styles.uploadIcon}>📄</div>
            <p className={styles.uploadText}>
              Перетащите PDF файл сюда или нажмите для выбора
            </p>
            <p className={styles.uploadSubtext}>
              Поддерживаются файлы до 50MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            className={styles.fileInput}
          />

          {selectedFile && (
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <p className={styles.fileSize}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {uploadError && (
            <div className={styles.error}>
              {uploadError}
            </div>
          )}

          {isUploading && (
            <div className={styles.loading}>
              Создание проекта...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditPage;