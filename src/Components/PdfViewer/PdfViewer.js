import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "../../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
import "./PdfViewer.css";

function PdfViewer({ url, width = 800, height = 1000 }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);

  useEffect(() => {
    if (!url) return;

    const loadPdf = async () => {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const pdf = await pdfjsLib.getDocument(url).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        renderPage(pdf, 1);
      } catch (error) {
        console.error("Erreur lors du chargement du PDF:", error);
        setError(error.message);
      }
    };

    loadPdf();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [url]);

  const renderPage = async (pdf, pageNum) => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const page = await pdf.getPage(pageNum);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const viewport = page.getViewport({ scale: 1.0 });
    const scaleX = width / viewport.width;
    const scaleY = height / viewport.height;
    const scale = Math.min(scaleX, scaleY);

    const scaledViewport = page.getViewport({ scale });

    canvas.width = width;
    canvas.height = height;

    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };

    containerRef.current.appendChild(canvas);
    await page.render(renderContext).promise;
  };

  const changePage = (delta) => {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
      renderPage(pdfDoc, newPage);
    }
  };

  if (error) {
    return <div>Erreur de chargement du PDF : {error}</div>;
  }

  return (
    <div>
      <div className='container-canvas' ref={containerRef}></div>
      {numPages > 1 && (
        <div className='pdf-controls'>
          <button onClick={() => changePage(-1)} disabled={currentPage <= 1}>
            ←
          </button>
          <span>
            Page {currentPage} sur {numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={currentPage >= numPages}>
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default PdfViewer;
