'use client';

import { useState, useRef } from 'react';
import { QuoteData, QuoteSection, QuoteItem } from '@/types/quote';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataParsed: (data: Partial<QuoteData>) => void;
}

export default function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const parseExcelFile = async (file: File): Promise<Partial<QuoteData>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
          
          const parsedData = parseQuoteFromRows(jsonData);
          resolve(parsedData);
        } catch (err) {
          reject(new Error('שגיאה בקריאת קובץ Excel'));
        }
      };
      
      reader.onerror = () => reject(new Error('שגיאה בטעינת הקובץ'));
      reader.readAsBinaryString(file);
    });
  };

  const parseQuoteFromRows = (rows: (string | number)[][]): Partial<QuoteData> => {
    const sections: QuoteSection[] = [];
    let currentSection: QuoteSection | null = null;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      
      const firstCell = String(row[0] || '').trim();
      
      // Check for section headers (חלופה)
      if (firstCell.includes('חלופה')) {
        if (currentSection && currentSection.items.length > 0) {
          currentSection.subtotal = currentSection.items.reduce((sum, item) => sum + item.total, 0);
          sections.push(currentSection);
        }
        
        currentSection = {
          id: generateId(),
          title: firstCell,
          description: '',
          items: [],
          subtotal: 0
        };
        continue;
      }
      
      // Skip header rows and summary rows
      if (firstCell === 'תיאור' || firstCell === '#' || 
          firstCell.includes('סה"כ') || firstCell.includes('סה״כ') ||
          firstCell.includes('מע"מ') || firstCell.includes('מע״מ')) {
        continue;
      }
      
      // Try to parse as an item row
      if (currentSection) {
        const item = parseItemRow(row, currentSection.items.length + 1);
        if (item) {
          currentSection.items.push(item);
        }
      } else if (sections.length === 0) {
        // No section yet, create a default one
        currentSection = {
          id: generateId(),
          title: "חלופה א'",
          description: '',
          items: [],
          subtotal: 0
        };
        
        const item = parseItemRow(row, 1);
        if (item) {
          currentSection.items.push(item);
        }
      }
    }
    
    // Add the last section
    if (currentSection && currentSection.items.length > 0) {
      currentSection.subtotal = currentSection.items.reduce((sum, item) => sum + item.total, 0);
      sections.push(currentSection);
    }
    
    return { sections };
  };

  const parseItemRow = (row: (string | number)[], index: number): QuoteItem | null => {
    // Try different column layouts
    // Layout 1: [index, description, quantity, price, total]
    // Layout 2: [description, quantity, price, total]
    // Layout 3: [description, quantity, price] (calculate total)
    
    let description = '';
    let quantity = 1;
    let unitPrice = 0;
    let total = 0;
    
    // Filter out empty cells and get meaningful values
    const cells = row.filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
    
    if (cells.length < 2) return null;
    
    // Find numeric values (likely quantity, price, total)
    const numericValues: number[] = [];
    const textValues: string[] = [];
    
    for (const cell of cells) {
      const numVal = typeof cell === 'number' ? cell : parseFloat(String(cell).replace(/[,₪]/g, ''));
      if (!isNaN(numVal) && numVal > 0) {
        numericValues.push(numVal);
      } else if (typeof cell === 'string' && cell.trim().length > 1) {
        textValues.push(cell.trim());
      }
    }
    
    // Use first text as description
    if (textValues.length > 0) {
      description = textValues[0];
    }
    
    // Parse numbers based on count
    if (numericValues.length >= 3) {
      // Assume: quantity, unitPrice, total
      quantity = numericValues[0];
      unitPrice = numericValues[1];
      total = numericValues[2];
    } else if (numericValues.length === 2) {
      // Could be: quantity+price, or price+total
      // If second number is much larger, it's likely total
      if (numericValues[1] > numericValues[0] * 10) {
        quantity = 1;
        unitPrice = numericValues[1];
        total = numericValues[1];
      } else {
        quantity = numericValues[0];
        unitPrice = numericValues[1];
        total = quantity * unitPrice;
      }
    } else if (numericValues.length === 1) {
      total = numericValues[0];
      unitPrice = total;
      quantity = 1;
    }
    
    if (!description || total === 0) return null;
    
    return {
      id: generateId(),
      description,
      quantity,
      unitPrice,
      total
    };
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    setIsProcessing(true);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      let parsedData: Partial<QuoteData>;
      
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        parsedData = await parseExcelFile(file);
      } else if (fileExtension === 'csv') {
        parsedData = await parseExcelFile(file);
      } else {
        throw new Error('סוג קובץ לא נתמך. אנא העלה קובץ Excel (.xlsx, .xls) או CSV');
      }
      
      if (parsedData.sections && parsedData.sections.length > 0) {
        const totalItems = parsedData.sections.reduce((sum, s) => sum + s.items.length, 0);
        setSuccess(`נטענו ${parsedData.sections.length} חלופות עם ${totalItems} פריטים`);
        onDataParsed(parsedData);
      } else {
        throw new Error('לא נמצאו נתונים בקובץ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בעיבוד הקובץ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </span>
        ייבוא מקובץ
      </h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-12 h-12 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">מעבד את הקובץ...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              גרור קובץ לכאן או לחץ לבחירה
            </p>
            <p className="text-sm text-gray-500">
              תומך בקבצי Excel (.xlsx, .xls) ו-CSV
            </p>
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          טיפים לייבוא מוצלח
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 mr-6 list-disc">
          <li>ודא שיש כותרת &quot;חלופה&quot; לכל קבוצת עבודות</li>
          <li>כל שורת פריט צריכה להכיל: תיאור, כמות, מחיר</li>
          <li>המערכת תזהה אוטומטית סיכומים ותחשב מחדש</li>
        </ul>
      </div>
    </div>
  );
}
