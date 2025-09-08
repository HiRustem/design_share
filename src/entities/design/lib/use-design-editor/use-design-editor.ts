'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

interface UsePdfEditorProps {
  fileUrl: string;
  scale?: number;
}

function useDesignEditor({ fileUrl, scale = 1.5 }: UsePdfEditorProps) {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentFabric = useRef<fabric.Canvas | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // храним JSON-состояние для каждой страницы
  const fabricStates = useRef<Record<number, object>>({});

  // загрузка pdf
  useEffect(() => {
    if (!fileUrl) return;

    (async () => {
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
    })();
  }, [fileUrl]);

  // установка стилей для наложения канвасов
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

  // рендер страницы
  useEffect(() => {
    if (!pdfDoc || !pdfCanvasRef.current || !fabricCanvasRef.current) return;

    const render = async () => {
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
    };

    render();

    return () => {
      // сохранение состояния и dispose перед сменой страницы
      if (currentFabric.current) {
        const json = currentFabric.current.toJSON();
        fabricStates.current = { ...fabricStates.current, [currentPage]: json };
        currentFabric.current.dispose();
        currentFabric.current = null;
      }
    };
  }, [pdfDoc, currentPage, scale]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // добавляем watermark только в текущую страницу
  const addWatermark = (text: string) => {
    const fabricInstance = currentFabric.current;
    if (!fabricInstance) return;

    const textbox = new fabric.Textbox(text, {
      left: 50,
      top: 50,
      fontSize: 32,
      fill: 'rgba(255, 0, 0, 0.3)',
      editable: true,
    });

    fabricInstance.add(textbox);
    fabricInstance.setActiveObject(textbox);
    fabricInstance.renderAll();
  };

  // экспорт PDF с водяными знаками на каждой странице
  const exportPdf = async () => {
    if (!fileUrl || !pdfDoc) return;

    // сохраняем текущее состояние перед экспортом для надежности
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

      // получаем JSON для страницы (из состояния или текущего canvas, если совпадает)
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

          // парсинг цвета
          let r = 1,
            g = 0,
            b = 0;
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
  };

  return {
    pdfCanvasRef,
    fabricCanvasRef,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    addWatermark,
    exportPdf,
  };
}

export default useDesignEditor;
