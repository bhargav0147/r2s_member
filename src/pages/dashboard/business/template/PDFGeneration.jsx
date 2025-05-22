import html2pdf from 'html2pdf.js';
import React, { useRef } from 'react';

const PDFGeneration = ({content}) => {
  const contentRef = useRef();

  const handleGeneratePDF = () => {
    const element = contentRef.current;

    html2pdf(element);
  };

  return (
    <div>
      <div ref={contentRef}>{content}</div>
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
  );
};

export default PDFGeneration;
