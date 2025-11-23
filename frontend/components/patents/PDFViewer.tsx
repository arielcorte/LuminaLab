"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

interface PDFViewerProps {
  pdfUrl?: string;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;
    let currentUrl: string | null = null;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(pdfUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch PDF (status ${response.status}).`
          );
        }

        const blob = await response.blob();
        currentUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setObjectUrl(currentUrl);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Unable to load PDF from Lighthouse."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [pdfUrl]);

  const downloadLabel = useMemo(() => {
    if (!pdfUrl) return "Download PDF";
    try {
      const url = new URL(pdfUrl);
      return `Download ${url.pathname.split("/").pop() || "PDF"}`;
    } catch {
      return "Download PDF";
    }
  }, [pdfUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto my-10 p-6 bg-card text-card-foreground rounded-lg shadow-md flex flex-col gap-4 items-center">
      {!pdfUrl && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <span className="text-gray-400">PDF</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            PDF viewer placeholder. The document will be displayed here once the backend is ready.
          </p>
        </div>
      )}

      {pdfUrl && (
        <>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              disabled={!pdfUrl}
            >
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                {downloadLabel}
              </a>
            </Button>
          </div>

          {loading && <p className="text-sm text-gray-500">Loading PDF preview...</p>}

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error} You can still download the file using the button above.
            </p>
          )}

          {!loading && !error && objectUrl && (
            <iframe
              src={objectUrl}
              className="w-full h-[80vh] border border-gray-300 rounded-md"
              title="Patent PDF"
            />
          )}
        </>
      )}
    </div>
  );
};
