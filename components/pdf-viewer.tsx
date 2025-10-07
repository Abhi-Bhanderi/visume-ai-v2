"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LoaderOne } from "./ui/loader";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({
  cloudFrontUrl,
}: {
  cloudFrontUrl: string;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  console.log("🚀 ~ PDFViewer ~ numPages:", numPages);
  const [loading, setLoading] = useState(true);

  // Create the proxied URL
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(cloudFrontUrl)}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="pdf-container relative">
      {loading && (
        <div className="flex items-center justify-center h-full flex-col gap-4">
          <LoaderOne />
        </div>
      )}

      <Document
        file={proxyUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={null}
        onLoadError={(error) => console.error("Error loading PDF:", error)}
        options={{
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        }}
        className="space-y-6"
      >
        {Array.from({ length: numPages ? numPages : 1 }).map((_, i) => (
          <Page
            key={i}
            className="w-full border-2 rounded-sm overflow-hidden"
            width={800}
            pageNumber={i + 1}
            loading={null}
          />
        ))}
      </Document>
    </div>
  );
}
