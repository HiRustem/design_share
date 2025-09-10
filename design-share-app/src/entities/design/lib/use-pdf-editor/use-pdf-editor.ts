'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { IWatermarkConfig } from '@/entities/project/model/types';

interface UsePdfEditorProps {
  fileUrl: string;
  scale?: number;
}

interface PdfEditorReturn {
  pdfCanvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.RefObject<HTMLCanvasElement>;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  addWatermark: (config: IWatermarkConfig) => void;
  applyWatermarkToAllPages: (config: IWatermarkConfig) => void;
  exportPdf: () => Promise<Uint8Array>;
  clearWatermarks: () => void;
  isLoading: boolean;
  error: string | null;
}

function usePdfEditor({ fileUrl, scale = 1.5 }: UsePdfEditorProps): PdfEditorReturn {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentFabric = useRef<fabric.Canvas | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Храним JSON-состояние для каждой страницы
  const fabricStates = useRef<Record<number, object>>({});

  // Загрузка PDF
  useEffect(() => {
    if (!fileUrl) return;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString();

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [fileUrl]);

  // Установка стилей для наложения канвасов
  useEffect(() => {
    const pdfCanvas = pdfCanvasRef.current;
    const fabricCanvas = fabricCanvasRef.current;

    if (pdfCanvas) {
      pdfCanvas.style.position = 'absolute';
      pdfCanvas.style.top = '0';
      pdfCanvas.style.left = '0';
      pdfCanvas.style.zIndex = '1';
      pdfCanvas.style.pointerEvents = 'none'; // чтобы события проходили на fabric
    }

    if (fabricCanvas) {
      fabricCanvas.style.position = 'absolute';
      fabricCanvas.style.top = '0';
      fabricCanvas.style.left = '0';
      fabricCanvas.style.zIndex = '2';
    }
  }, []);

  // Рендер страницы
  useEffect(() => {
    if (!pdfDoc || !pdfCanvasRef.current || !fabricCanvasRef.current) return;

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = pdfCanvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.width = viewport.width;
          fabricCanvasRef.current.height = viewport.height;

          const instance = new fabric.Canvas(fabricCanvasRef.current, {
            selection: true,
          });
          currentFabric.current = instance;

          const state = fabricStates.current[currentPage];

          if (state) {
            await new Promise((resolve) => {
              instance.loadFromJSON(state, () => {
                instance.renderAll();
                resolve(null);
              });
            });
          } else {
            instance.renderAll();
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render page');
      }
    };

    render();

    return () => {
      // Сохранение состояния и dispose перед сменой страницы
      if (currentFabric.current) {
        const json = currentFabric.current.toJSON();
        fabricStates.current = { ...fabricStates.current, [currentPage]: json };
        currentFabric.current.dispose();
        currentFabric.current = null;
      }
    };
  }, [pdfDoc, currentPage, scale]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }, [currentPage]);

  // Добавляем водяной знак только на текущую страницу
  const addWatermark = useCallback((config: IWatermarkConfig) => {
    const fabricInstance = currentFabric.current;
    if (!fabricInstance) return;

    const textbox = new fabric.Textbox(config.text, {
      left: config.position.x,
      top: config.position.y,
      fontSize: config.fontSize,
      fill: config.color,
      opacity: config.opacity,
      angle: config.angle,
      editable: true,
      selectable: true,
    });

    fabricInstance.add(textbox);
    fabricInstance.setActiveObject(textbox);
    fabricInstance.renderAll();
  }, []);

  // Применяем водяной знак ко всем страницам по паттерну
  const applyWatermarkToAllPages = useCallback((config: IWatermarkConfig) => {
    if (!pdfDoc) return;

    // Сохраняем текущее состояние
    if (currentFabric.current) {
      const json = currentFabric.current.toJSON();
      fabricStates.current = { ...fabricStates.current, [currentPage]: json };
    }

    // Применяем водяной знак ко всем страницам
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const state = fabricStates.current[pageNum] || { objects: [] };
      const objects = (state as any).objects || [];

      // Создаем водяной знак для каждой страницы
      const watermark = {
        type: 'textbox',
        text: config.text,
        fontSize: config.fontSize,
        fill: config.color,
        opacity: config.opacity,
        angle: config.angle,
        left: config.position.x,
        top: config.position.y,
        editable: false,
        selectable: false,
      };

      // Применяем паттерн
      switch (config.pattern) {
        case 'diagonal':
          // Диагональный паттерн - водяной знак через каждые 200px по диагонали
          for (let x = 0; x < 1000; x += 200) {
            for (let y = 0; y < 1000; y += 200) {
              objects.push({
                ...watermark,
                left: x,
                top: y,
                angle: config.angle + 45, // Диагональный поворот
              });
            }
          }
          break;
        case 'grid':
          // Сетка - водяной знак в узлах сетки
          for (let x = 100; x < 800; x += 300) {
            for (let y = 100; y < 600; y += 200) {
              objects.push({
                ...watermark,
                left: x,
                top: y,
              });
            }
          }
          break;
        case 'center':
          // Центр - один водяной знак в центре
          objects.push({
            ...watermark,
            left: 400,
            top: 300,
          });
          break;
        default:
          // single - один водяной знак в указанной позиции
          objects.push(watermark);
      }

      fabricStates.current[pageNum] = { ...state, objects };
    }

    // Перерисовываем текущую страницу
    if (currentFabric.current) {
      const currentState = fabricStates.current[currentPage];
      currentFabric.current.loadFromJSON(currentState, () => {
        currentFabric.current?.renderAll();
      });
    }
  }, [pdfDoc, totalPages, currentPage]);

  // Очистка всех водяных знаков
  const clearWatermarks = useCallback(() => {
    if (currentFabric.current) {
      currentFabric.current.clear();
      currentFabric.current.renderAll();
    }

    // Очищаем состояния всех страниц
    fabricStates.current = {};
  }, []);

  // Экспорт PDF с водяными знаками на каждой странице
  const exportPdf = useCallback(async (): Promise<Uint8Array> => {
    if (!fileUrl || !pdfDoc) {
      throw new Error('PDF not loaded');
    }

    // Сохраняем текущее состояние перед экспортом
    if (currentFabric.current) {
      const json = currentFabric.current.toJSON();
      fabricStates.current = { ...fabricStates.current, [currentPage]: json };
    }

    const pdfLib = await import('pdf-lib');
    const { PDFDocument, StandardFonts, rgb, degrees } = pdfLib;

    const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const pdfDocOut = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDocOut.getPages();
    const helvetica = await pdfDocOut.embedFont(StandardFonts.Helvetica);

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pages[pageIndex];
      const pageNum = pageIndex + 1;

      // Получаем JSON для страницы
      let json: any;
      if (pageNum === currentPage && currentFabric.current) {
        json = currentFabric.current.toJSON();
      } else {
        json = fabricStates.current[pageNum];
      }

      if (!json || !json.objects?.length) continue;

      const originalPage = await pdfDoc.getPage(pageNum);
      const viewport = originalPage.getViewport({ scale });
      const renderWidth = viewport.width;
      const renderHeight = viewport.height;

      const { width: pdfWidth, height: pdfHeight } = page.getSize();

      json.objects.forEach((obj: any) => {
        if (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text') {
          const normX = (obj.left ?? 0) / renderWidth;
          const normY = (obj.top ?? 0) / renderHeight;

          const xPdf = normX * pdfWidth;
          let yPdf = pdfHeight - normY * pdfHeight;

          const fontSizePts = ((obj.fontSize ?? 12) / renderHeight) * pdfHeight;

          // Adjust for baseline using ascent
          const ascent = helvetica.heightAtSize(fontSizePts, { descender: false });
          yPdf -= ascent;

          // Парсинг цвета
          let r = 1, g = 0, b = 0;
          let opacity = obj.opacity ?? 1;
          const fill = (obj.fill as string) ?? '';

          if (fill.startsWith('#')) {
            const hex = fill.replace('#', '');
            if (hex.length === 6) {
              r = parseInt(hex.slice(0, 2), 16) / 255;
              g = parseInt(hex.slice(2, 4), 16) / 255;
              b = parseInt(hex.slice(4, 6), 16) / 255;
            } else if (hex.length === 3) {
              r = parseInt(hex[0] + hex[0], 16) / 255;
              g = parseInt(hex[1] + hex[1], 16) / 255;
              b = parseInt(hex[2] + hex[2], 16) / 255;
            }
          } else if (fill.startsWith('rgba(')) {
            const parts = fill.match(/[\d.]+/g);
            if (parts && parts.length === 4) {
              r = parseFloat(parts[0]) / 255;
              g = parseFloat(parts[1]) / 255;
              b = parseFloat(parts[2]) / 255;
              const a = parseFloat(parts[3]);
              opacity *= a;
            }
          } else if (fill.startsWith('rgb(')) {
            const parts = fill.match(/[\d.]+/g);
            if (parts && parts.length === 3) {
              r = parseFloat(parts[0]) / 255;
              g = parseFloat(parts[1]) / 255;
              b = parseFloat(parts[2]) / 255;
            }
          }

          // Handle multiline text
          const lines = (obj.text ?? '').split('\n');
          const lineHeight = obj.lineHeight ?? 1.16;

          lines.forEach((line: string, index: number) => {
            const lineYPdf = yPdf - index * fontSizePts * lineHeight;
            page.drawText(line, {
              x: xPdf,
              y: lineYPdf,
              size: fontSizePts,
              font: helvetica,
              color: rgb(r, g, b),
              rotate: degrees(-(obj.angle ?? 0)),
              opacity,
            });
          });
        }
      });
    }

    return await pdfDocOut.save();
  }, [fileUrl, pdfDoc, currentPage, scale]);

  return {
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
  };
}

export default usePdfEditor;