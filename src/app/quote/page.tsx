'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import QuoteForm from '@/components/QuoteForm';
import TemplateSelector from '@/components/TemplateSelector';
import FileUpload from '@/components/FileUpload';
import { QuoteData } from '@/types/quote';

const QuotePreview = dynamic(() => import('@/components/QuotePreview'), { ssr: false });

export default function QuotePage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-blue');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const getInitialData = (): QuoteData => {
    const today = new Date();
    const validUntil = new Date();
    validUntil.setDate(today.getDate() + 30);

    return {
      quoteNumber: `Q-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      date: today.toISOString().split('T')[0],
      validUntil: validUntil.toISOString().split('T')[0],
      headerTitle: 'רפאל אלבז - קבלן שיפוצים ובנייה',
      customer: {
        name: '',
        phone: '',
        email: '',
        city: '',
        street: '',
        building: '',
        apartment: ''
      },
      company: {
        name: 'רפאל אלבז',
        phone: '050-123-4567',
        email: 'info@rafaelelbaz.co.il'
      },
      sections: [],
      notes: '',
      paymentTerms: 'תשלום ב-3 תשלומים שווים',
      subtotal: 0,
      vatRate: 17,
      vatAmount: 0,
      total: 0
    };
  };

  const [quoteData, setQuoteData] = useState<QuoteData>(getInitialData());

  useEffect(() => {
    const subtotal = quoteData.sections.reduce((sum, section) => 
      sum + section.items.reduce((itemSum, item) => itemSum + item.quantity * item.unitPrice, 0), 0
    );
    const vatAmount = subtotal * (quoteData.vatRate / 100);
    const total = subtotal + vatAmount;
    
    if (quoteData.subtotal !== subtotal || quoteData.vatAmount !== vatAmount || quoteData.total !== total) {
      setQuoteData(prev => ({ ...prev, subtotal, vatAmount, total }));
    }
  }, [quoteData.sections, quoteData.vatRate, quoteData.subtotal, quoteData.vatAmount, quoteData.total]);

  const handleFileParsed = (parsedData: Partial<QuoteData>) => {
    setQuoteData(prev => ({
      ...prev,
      ...parsedData,
      company: prev.company,
      headerTitle: prev.headerTitle
    }));
  };

  const resetForm = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את הטופס?')) {
      setQuoteData(getInitialData());
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`הצעת-מחיר-${quoteData.quoteNumber}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('שגיאה בייצוא ה-PDF');
    }
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Compact */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">מחולל הצעות מחיר</h1>
              <span className="text-sm text-gray-500">רפאל אלבז - קבלן שיפוצים ובנייה</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Show preview toggle button only when preview is hidden */}
              {!showPreview && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-3 py-1.5 text-sm text-amber-600 border border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  הצג תצוגה מקדימה
                </button>
              )}
              <button
                onClick={resetForm}
                className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                אפס טופס
              </button>
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="px-4 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    מייצא...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    ייצא PDF
                  </>
                )}
              </button>
              <Link 
                href="/"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                חזרה לאתר
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-4xl'}`}>
          {/* Left Side - Form */}
          <div className="space-y-6">
            <FileUpload onDataParsed={handleFileParsed} />
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onSelect={(template) => setSelectedTemplate(template.id)}
            />
            <QuoteForm 
              data={quoteData}
              onChange={setQuoteData}
            />
          </div>

          {/* Right Side - Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-14 lg:self-start w-fit">
              <div className="bg-white rounded-xl shadow-lg p-4 w-fit">
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full text-base font-bold text-gray-800 mb-3 flex items-center gap-2 hover:text-amber-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  תצוגה מקדימה
                  <svg className="w-4 h-4 mr-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div 
                  className="border border-gray-200 rounded-lg overflow-auto pl-2"
                  style={{ width: '530px', maxHeight: 'calc(100vh - 140px)' }}
                >
                  <div style={{ transform: 'scale(0.65)', transformOrigin: 'top right', width: '794px', marginBottom: '-400px' }}>
                    <QuotePreview 
                      ref={previewRef}
                      data={quoteData}
                      templateId={selectedTemplate}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
