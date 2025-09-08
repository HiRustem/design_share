'use client';

import { useState } from 'react';
import useDesignEditor from '../lib/use-design-editor/use-design-editor';

function DesignEditor() {
  const [fileUrl, setFileUrl] = useState<string>('');
  const {
    pdfCanvasRef,
    fabricCanvasRef,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    addWatermark,
    exportPdf,
  } = useDesignEditor({ fileUrl });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleExport = async () => {
    const bytes = await exportPdf();
    if (bytes) {
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'with-watermark.pdf';
      link.click();
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <input type='file' accept='application/pdf' onChange={handleFileChange} />

      <button
        onClick={() => addWatermark('МОЙ ВОДЯНОЙ ЗНАК')}
        disabled={!fileUrl}
        className='px-4 py-2 bg-blue-600 text-white rounded'
      >
        Добавить watermark
      </button>

      <button
        onClick={handleExport}
        disabled={!fileUrl}
        className='px-4 py-2 bg-green-600 text-white rounded'
      >
        Скачать PDF
      </button>

      {fileUrl && (
        <div className='flex items-center gap-2'>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-gray-600 text-white rounded'
          >
            Назад
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-gray-600 text-white rounded'
          >
            Вперёд
          </button>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <canvas ref={pdfCanvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
        <canvas ref={fabricCanvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>
    </div>
  );
}

export default DesignEditor;
