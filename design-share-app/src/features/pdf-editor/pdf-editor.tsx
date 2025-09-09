'use client';

import React, { useState, useCallback } from 'react';
import { usePdfEditor } from '@/entities/design';
import { IWatermarkConfig } from '@/entities/project/model/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import styles from './pdf-editor.module.scss';

interface PdfEditorProps {
  fileUrl: string;
  onSave: (pdfBytes: Uint8Array, name: string) => void;
  onCancel: () => void;
}

const PdfEditor: React.FC<PdfEditorProps> = ({ fileUrl, onSave, onCancel }) => {
  const [projectName, setProjectName] = useState('');
  const [watermarkConfig, setWatermarkConfig] = useState<IWatermarkConfig>({
    text: 'CONFIDENTIAL',
    fontSize: 32,
    color: 'rgba(255, 0, 0, 0.3)',
    opacity: 0.3,
    angle: -45,
    position: { x: 50, y: 50 },
    pattern: 'diagonal',
  });

  const {
    pdfCanvasRef,
    fabricCanvasRef,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    addWatermark,
    applyWatermarkToAllPages,
    exportPdf,
    clearWatermarks,
    isLoading,
    error,
  } = usePdfEditor({ fileUrl });

  const handleWatermarkChange = useCallback((field: keyof IWatermarkConfig, value: any) => {
    setWatermarkConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePositionChange = useCallback((field: 'x' | 'y', value: number) => {
    setWatermarkConfig(prev => ({
      ...prev,
      position: {
        ...prev.position,
        [field]: value,
      },
    }));
  }, []);

  const handleAddWatermark = useCallback(() => {
    addWatermark(watermarkConfig);
  }, [addWatermark, watermarkConfig]);

  const handleApplyToAllPages = useCallback(() => {
    applyWatermarkToAllPages(watermarkConfig);
  }, [applyWatermarkToAllPages, watermarkConfig]);

  const handleSave = useCallback(async () => {
    try {
      const pdfBytes = await exportPdf();
      onSave(pdfBytes, projectName || 'document');
    } catch (err) {
      console.error('Failed to save PDF:', err);
    }
  }, [exportPdf, onSave, projectName]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Загрузка PDF документа...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Ошибка загрузки PDF: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Редактор PDF</h1>
        <div className={styles.controls}>
          <Input
            placeholder="Название проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={styles.input}
          />
          <Button onClick={handleSave} disabled={!projectName}>
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Настройки водяного знака</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Текст</label>
              <input
                type="text"
                className={styles.input}
                value={watermarkConfig.text}
                onChange={(e) => handleWatermarkChange('text', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Размер шрифта: {watermarkConfig.fontSize}px</label>
              <input
                type="range"
                min="12"
                max="72"
                value={watermarkConfig.fontSize}
                onChange={(e) => handleWatermarkChange('fontSize', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Цвет</label>
              <input
                type="color"
                value={watermarkConfig.color.replace('rgba(', '').replace(')', '').split(',').slice(0, 3).map((c, i) => 
                  i === 0 ? parseInt(c.trim()).toString(16).padStart(2, '0') :
                  i === 1 ? parseInt(c.trim()).toString(16).padStart(2, '0') :
                  parseInt(c.trim()).toString(16).padStart(2, '0')
                ).join('')}
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  handleWatermarkChange('color', `rgba(${r}, ${g}, ${b}, ${watermarkConfig.opacity})`);
                }}
                className={styles.colorInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Прозрачность: {Math.round(watermarkConfig.opacity * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={watermarkConfig.opacity}
                onChange={(e) => {
                  const opacity = parseFloat(e.target.value);
                  const color = watermarkConfig.color.replace(/[\d.]+\)$/, `${opacity})`);
                  handleWatermarkChange('opacity', opacity);
                  handleWatermarkChange('color', color);
                }}
                className={styles.rangeInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Угол поворота: {watermarkConfig.angle}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={watermarkConfig.angle}
                onChange={(e) => handleWatermarkChange('angle', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Позиция X: {watermarkConfig.position.x}px</label>
              <input
                type="range"
                min="0"
                max="800"
                value={watermarkConfig.position.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Позиция Y: {watermarkConfig.position.y}px</label>
              <input
                type="range"
                min="0"
                max="600"
                value={watermarkConfig.position.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Паттерн</label>
              <select
                className={styles.select}
                value={watermarkConfig.pattern}
                onChange={(e) => handleWatermarkChange('pattern', e.target.value as IWatermarkConfig['pattern'])}
              >
                <option value="single">Один знак</option>
                <option value="diagonal">Диагональный</option>
                <option value="grid">Сетка</option>
                <option value="center">Центр</option>
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <Button onClick={handleAddWatermark} size="small">
                Добавить на страницу
              </Button>
              <Button onClick={handleApplyToAllPages} size="small" variant="secondary">
                Применить ко всем
              </Button>
              <Button onClick={clearWatermarks} size="small" variant="outline">
                Очистить
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.viewer}>
          <div className={styles.canvasContainer}>
            <canvas ref={pdfCanvasRef} className={styles.pdfCanvas} />
            <canvas ref={fabricCanvasRef} className={styles.fabricCanvas} />
          </div>
          
          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              ← Предыдущая
            </button>
            <span className={styles.pageInfo}>
              Страница {currentPage} из {totalPages}
            </span>
            <button
              className={styles.navButton}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Следующая →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;