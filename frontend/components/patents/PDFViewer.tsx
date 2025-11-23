"use client";

import React from "react";

interface PDFViewerProps {
  pdfUrl?: string; // cuando el backend esté listo, aquí irá la URL del PDF
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-10 p-6 bg-card text-card-foreground rounded-lg shadow-md flex flex-col items-center justify-center">
      {!pdfUrl ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <span className="text-gray-400">PDF</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            PDF viewer placeholder. The document will be displayed here once the backend is ready.
          </p>
        </div>
      ) : (
        <iframe
          src={pdfUrl}
          className="w-full h-[80vh] border border-gray-300 rounded-md"
        />
      )}
    </div>
  );
};
