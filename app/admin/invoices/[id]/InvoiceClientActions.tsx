"use client";

import { useState } from "react";
import Image from "next/image";

interface InvoiceClientActionsProps {
  receiptUrl?: string;
  clientName: string;
  invoiceNumber?: string;
}

export default function InvoiceClientActions({ receiptUrl, clientName, invoiceNumber }: InvoiceClientActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Direct PDF Download using html2canvas-pro and jspdf
  const handleDownloadPDF = async () => {
    setDownloading(true);
    
    try {
      // Dynamically import to avoid server-side rendering (SSR) window/document errors
      // @ts-ignore
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");
      
      const element = document.querySelector(".invoice-card") as HTMLElement;
      if (!element) {
        setDownloading(false);
        return;
      }
      
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      
      // A4 dimensions: 210mm x 297mm
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      
      // Apply 8mm margins
      const margin = 8;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, contentHeight);
      pdf.save(`invoice-${invoiceNumber || "document"}.pdf`);
      setDownloading(false);
    } catch (err: any) {
      console.error("PDF download failed:", err);
      setDownloading(false);
      alert("Direct PDF download failed. Please use the Print option and choose 'Save as PDF' instead.");
    }
  };

  // Direct Word Document (.doc) Download
  const handleDownloadWord = () => {
    const element = document.querySelector(".invoice-card");
    if (!element) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Invoice Receipt</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #ffffff;
            color: #064e3b;
            margin: 1in;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #d1dcd5;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f0f4f1;
            color: #064e3b;
            font-weight: bold;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .font-black { font-weight: 900; }
          .text-red { color: #dc2626; }
          .text-green { color: #047857; }
          .text-xs { font-size: 10px; }
          .text-sm { font-size: 12px; }
          .text-base { font-size: 14px; }
          .text-lg { font-size: 18px; }
          .text-xl { font-size: 20px; }
          .text-2xl { font-size: 24px; }
          .bg-surface { background-color: #f8faf8; }
          .border-b { border-bottom: 1px solid #e5e7eb; }
          .p-4 { padding: 16px; }
          .rounded-xl { border-radius: 8px; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + htmlContent], {
      type: "application/msword"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceNumber || "document"}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Action Buttons (Hidden during Print) */}
      <div className="flex flex-wrap gap-2.5 print:hidden justify-end mb-4">
        {/* Direct Download Word Document (.doc) */}
        <button
          onClick={handleDownloadWord}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Word (.doc)
        </button>

        {/* Direct Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Preparing PDF...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </>
          )}
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 border border-emerald-850 hover:bg-emerald-50 text-emerald-850 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Document
        </button>
      </div>

      {/* Payment Receipt Area */}
      {receiptUrl && (
        <div className="mt-6 bg-[#f8faf8] p-5 rounded-2xl border border-emerald-900/5 shadow-sm print:break-inside-avoid print:hidden">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-2 font-[family-name:var(--font-heading)]">
            Uploaded Proof of Payment
          </h4>
          <p className="text-[10.5px] text-text-muted mb-3.5 leading-normal">
            A scan/photo of the transaction receipt is attached. Click below to inspect.
          </p>
          <div
            onClick={() => setIsOpen(true)}
            className="relative w-32 h-20 rounded-xl border border-gray-150 overflow-hidden cursor-pointer group shadow-sm bg-white hover:border-emerald-850 hover:shadow-md transition-all duration-200"
          >
            <Image
              src={receiptUrl}
              alt="Payment Receipt Preview"
              fill
              className="object-cover group-hover:scale-103 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9.5px] font-bold">
              View Receipt
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Receipt Modal (Hidden during Print) */}
      {isOpen && receiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl z-10 animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-dark text-sm font-[family-name:var(--font-heading)]">
                  Payment Receipt Document
                </h3>
                <p className="text-[10px] text-text-light">Attached for client: {clientName}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-dark p-1 rounded-lg hover:bg-gray-100 transition-colors font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 flex justify-center bg-surface max-h-[70vh] overflow-y-auto">
              <div className="relative w-full h-[50vh] min-h-[300px]">
                <Image
                  src={receiptUrl}
                  alt="Full Payment Receipt"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-gray-50 flex justify-end gap-3">
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Download Receipt
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="border border-border text-text-muted font-bold text-xs px-4 py-2 rounded-xl hover:bg-white transition-all"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
