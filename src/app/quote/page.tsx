'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import QuoteForm from '@/components/QuoteForm';
import TemplateSelector from '@/components/TemplateSelector';
import FileUpload from '@/components/FileUpload';
import QuotePreview from '@/components/QuotePreview';
import { QuoteData, defaultDisplaySettings } from '@/types/quote';

const STORAGE_KEY = 'quote_draft';

interface SavedQuote {
  id: number;
  name: string;
  data: QuoteData;
  template: string;
  created_at: string;
  updated_at: string;
  quote_number: string;
  customer_name: string;
}

export default function QuotePage() {
  const pdfExportRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-blue');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showPageBreaks, setShowPageBreaks] = useState(false);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      vatRate: 18,
      vatAmount: 0,
      total: 0,
      displaySettings: defaultDisplaySettings
    };
  };

  const [quoteData, setQuoteData] = useState<QuoteData>(getInitialData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setQuoteData(parsed.data);
        if (parsed.template) setSelectedTemplate(parsed.template);
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Load saved quotes from database
  const fetchSavedQuotes = async () => {
    setIsLoadingQuotes(true);
    try {
      const response = await fetch('/api/quotes');
      if (response.ok) {
        const quotes = await response.json();
        setSavedQuotes(quotes);
      }
    } catch (e) {
      console.error('Error loading quotes from database:', e);
    }
    setIsLoadingQuotes(false);
  };

  // Auto-save draft to localStorage when data changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: quoteData,
        template: selectedTemplate
      }));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [quoteData, selectedTemplate, isLoaded]);

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

  // Save current quote to database
  const saveQuote = async () => {
    const name = prompt('שם להצעה:', quoteData.customer.name || `הצעה ${quoteData.quoteNumber}`);
    if (!name) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          data: quoteData,
          template: selectedTemplate
        })
      });
      
      if (response.ok) {
        setSaveMessage('ההצעה נשמרה בהצלחה!');
        await fetchSavedQuotes();
      } else {
        setSaveMessage('שגיאה בשמירה');
      }
    } catch (e) {
      console.error('Error saving quote:', e);
      setSaveMessage('שגיאה בשמירה');
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Load a saved quote from database
  const loadQuote = async (quote: SavedQuote) => {
    if (confirm(`לטעון את "${quote.name}"? הנתונים הנוכחיים יאבדו.`)) {
      try {
        const response = await fetch(`/api/quotes/${quote.id}`);
        if (response.ok) {
          const fullQuote = await response.json();
          setQuoteData(fullQuote.data);
          setSelectedTemplate(fullQuote.template);
          setShowSavedQuotes(false);
        }
      } catch (e) {
        console.error('Error loading quote:', e);
        alert('שגיאה בטעינת ההצעה');
      }
    }
  };

  // Delete a saved quote from database
  const deleteQuote = async (id: number) => {
    if (confirm('למחוק הצעה זו?')) {
      try {
        const response = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
        if (response.ok) {
          await fetchSavedQuotes();
        }
      } catch (e) {
        console.error('Error deleting quote:', e);
        alert('שגיאה במחיקה');
      }
    }
  };

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
    if (!pdfExportRef.current) {
      alert('שגיאה: לא ניתן למצוא את התצוגה המקדימה. רענן את הדף ונסה שוב.');
      return;
    }
    
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const element = pdfExportRef.current;
      
      // Capture the whole preview
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Get page end margin from settings (safe zone)
      const pageEndMargin = quoteData.displaySettings?.pageEndMarginMm || 0;
      const effectivePageHeight = pageHeight - pageEndMargin; // Content height per page
      
      // Calculate image dimensions to fit page width
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // How many pages do we need based on effective page height?
      const totalPages = Math.ceil(imgHeight / effectivePageHeight);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Content offset - each page shows effectivePageHeight of content
        const yOffset = -(page * effectivePageHeight);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, yOffset, imgWidth, imgHeight);
        
        // Draw white rectangle to cover the bottom margin area (hide content in the "danger zone")
        if (pageEndMargin > 0) {
          pdf.setFillColor(255, 255, 255); // White
          pdf.rect(0, effectivePageHeight, pageWidth, pageEndMargin, 'F'); // Fill rectangle at bottom
        }
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
                onClick={() => { fetchSavedQuotes(); setShowSavedQuotes(true); }}
                className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                הצעות שמורות
              </button>
              <button
                onClick={saveQuote}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {isSaving ? 'שומר...' : 'שמור הצעה'}
              </button>
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
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-5xl mx-auto'}`}>
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

          {/* Right Side - Preview (always rendered for PDF export, hidden when showPreview is false) */}
          <div className={`lg:sticky lg:top-14 lg:self-start w-fit ${showPreview ? '' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-lg p-4 w-fit">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-base font-bold text-gray-800 flex items-center gap-2 hover:text-amber-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  תצוגה מקדימה
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPageBreaks(!showPageBreaks)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${showPageBreaks ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title="הצג/הסתר קווי מעבר עמוד"
                  >
                    {showPageBreaks ? '📏 הסתר קווי עמוד' : '📏 הצג קווי עמוד'}
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-xs text-center text-gray-400 mb-1">
                תבנית: <span className="font-medium">{selectedTemplate}</span>
                {showPageBreaks && <span className="text-red-500 mr-2">• קווים אדומים = סוף עמוד A4</span>}
              </div>
              <div 
                className="border border-gray-200 rounded-lg overflow-auto pl-2"
                style={{ width: '530px', maxHeight: 'calc(100vh - 160px)' }}
              >
                <div style={{ transform: 'scale(0.65)', transformOrigin: 'top right', width: '794px', marginBottom: '-400px' }}>
                  <QuotePreview 
                    key={`${selectedTemplate}-${JSON.stringify(quoteData.displaySettings)}-${showPageBreaks}`}
                    data={quoteData}
                    templateId={selectedTemplate}
                    showPageBreaks={showPageBreaks}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hidden full-size preview for PDF export (always rendered, positioned off-screen) */}
          <div className="fixed -left-[9999px] top-0" style={{ width: '210mm' }}>
            <QuotePreview 
              ref={pdfExportRef}
              data={quoteData}
              templateId={selectedTemplate}
            />
          </div>
        </div>
      </main>

      {/* Save Success Message */}
      {saveMessage && (
        <div className="fixed bottom-6 left-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {saveMessage}
        </div>
      )}

      {/* Saved Quotes Modal */}
      {showSavedQuotes && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">הצעות שמורות</h3>
              <button
                onClick={() => setShowSavedQuotes(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isLoadingQuotes ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg">טוען הצעות...</p>
              </div>
            ) : savedQuotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-lg">אין הצעות שמורות</p>
                <p className="text-sm">לחץ על &quot;שמור הצעה&quot; כדי לשמור את ההצעה הנוכחית</p>
              </div>
            ) : (
              <div className="overflow-auto flex-1">
                <div className="space-y-3">
                  {savedQuotes.map((quote) => (
                    <div key={quote.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{quote.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {quote.quote_number} • {quote.customer_name || 'לקוח לא מוגדר'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            נשמר: {new Date(quote.updated_at).toLocaleString('he-IL')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadQuote(quote)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            טען
                          </button>
                          <button
                            onClick={() => deleteQuote(quote.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                ההצעות נשמרות בענן ומסונכרנות בין כל המכשירים.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
