'use client';

import { useState, useRef, useCallback } from 'react';
import QuoteForm from '@/components/QuoteForm';
import QuotePreview from '@/components/QuotePreview';
import TemplateSelector from '@/components/TemplateSelector';
import FileUpload from '@/components/FileUpload';
import { QuoteData, TemplateStyle, templates } from '@/types/quote';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const initialData: QuoteData = {
  quoteNumber: 'Q-001',
  date: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  customer: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  company: {
    name: 'לונה שקד בע״מ',
    address: 'טללים 8/2, צור הדסה',
    phone: '',
    email: ''
  },
  sections: [],
  notes: '',
  paymentTerms: '50% מקדמה בתחילת העבודה\n50% בסיום העבודה',
  subtotal: 0,
  vatRate: 18,
  vatAmount: 0,
  total: 0
};

export default function Home() {
  const [data, setData] = useState<QuoteData>(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-blue');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = useCallback((newData: QuoteData) => {
    setData(newData);
  }, []);

  const handleTemplateSelect = useCallback((template: TemplateStyle) => {
    setSelectedTemplate(template.id);
  }, []);

  const handleFileParsed = useCallback((parsedData: Partial<QuoteData>) => {
    setData(prev => ({
      ...prev,
      ...parsedData
    }));
  }, []);

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    setActiveTab('preview');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }
      
      const customerName = data.customer.name || 'לקוח';
      const fileName = `הצעת_מחיר_${customerName}_${data.quoteNumber}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('שגיאה בייצוא ל-PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const printQuote = () => {
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const resetForm = () => {
    if (confirm('האם למחוק את כל הנתונים ולהתחיל מחדש?')) {
      setData(initialData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">מחולל הצעות מחיר</h1>
                <p className="text-sm text-gray-500">{data.company.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Tabs */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'form'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    עריכה
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    תצוגה מקדימה
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-r border-gray-200 pr-3 mr-3">
                <button
                  onClick={resetForm}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="נקה הכל"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={printQuote}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  הדפס
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      מייצא...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ייצא PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {activeTab === 'form' ? (
          <div className="space-y-6">
            {/* File Upload */}
            <FileUpload onDataParsed={handleFileParsed} />
            
            {/* Template Selector */}
            <TemplateSelector 
              selectedTemplate={selectedTemplate} 
              onSelect={handleTemplateSelect} 
            />
            
            {/* Quote Form */}
            <QuoteForm data={data} onChange={handleDataChange} />
          </div>
        ) : (
          <div className="flex justify-center">
            <QuotePreview ref={previewRef} data={data} templateId={selectedTemplate} />
          </div>
        )}
      </main>

      {/* Quick Stats Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {data.sections.length} חלופות | {data.sections.reduce((sum, s) => sum + s.items.length, 0)} פריטים
            </span>
            <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {templates.find(t => t.id === selectedTemplate)?.name}
            </span>
          </div>
          <div className="flex items-center gap-6">
            {data.sections.map((section) => {
              const total = section.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
              const withVat = total * (1 + data.vatRate / 100);
              return (
                <div key={section.id} className="text-sm">
                  <span className="text-gray-500">{section.title}:</span>{' '}
                  <span className="font-bold text-blue-600">₪{Math.round(withVat).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
