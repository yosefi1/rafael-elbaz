'use client';

import { QuoteData, TemplateStyle, templates, defaultDisplaySettings, defaultSectionDisplayOptions } from '@/types/quote';
import { forwardRef } from 'react';

interface QuotePreviewProps {
  data: QuoteData;
  templateId?: string;
  showPageBreaks?: boolean;
}

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(({ data, templateId = 'modern-blue', showPageBreaks = false }, ref) => {
  const template = templates.find(t => t.id === templateId) || templates[0];
  const { colors, layout } = template;
  
  // Get display settings with defaults
  const settings = { ...defaultDisplaySettings, ...data.displaySettings };
  
  // Dynamic classes based on settings
  const fontSizeClass = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }[settings.fontSize];
  
  const headerPadding = {
    compact: 'px-4 py-2',
    normal: 'px-6 py-4',
    large: 'p-8'
  }[settings.headerSize];
  
  const headerTitleSize = {
    compact: 'text-lg',
    normal: 'text-2xl',
    large: 'text-3xl'
  }[settings.headerSize];
  
  const rowPadding = {
    tight: 'px-2 py-1',
    normal: 'px-3 py-2',
    relaxed: 'px-4 py-3'
  }[settings.tableRowPadding];

  // A4 page height in mm
  const PAGE_HEIGHT_MM = 297;
  const pageEndMargin = settings.pageEndMarginMm || 0;
  
  // Render page break overlay lines
  const renderPageBreakOverlay = (numPages: number = 5) => {
    if (!showPageBreaks) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i}>
            {/* Safe zone line (green) - where content should stop */}
            {pageEndMargin > 0 && (
              <div
                className="absolute left-0 right-0"
                style={{
                  top: `${(i + 1) * PAGE_HEIGHT_MM - pageEndMargin}mm`,
                  borderTop: '2px solid #22c55e',
                  height: 0,
                }}
              >
                <span 
                  className="absolute right-2 -top-4 bg-green-500 text-white text-xs px-2 py-0.5 rounded"
                  style={{ direction: 'rtl' }}
                >
                  ✓ אזור בטוח - עצור כאן ({pageEndMargin} מ״מ לפני סוף)
                </span>
              </div>
            )}
            
            {/* Actual page end line (red) */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${(i + 1) * PAGE_HEIGHT_MM}mm`,
                borderTop: '2px dashed #ef4444',
                height: 0,
              }}
            >
              <span 
                className="absolute right-2 -top-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                style={{ direction: 'rtl' }}
              >
                סוף עמוד {i + 1} ← עמוד {i + 2}
              </span>
            </div>
            
            {/* Danger zone highlight (light red area between green and red) */}
            {pageEndMargin > 0 && (
              <div
                className="absolute left-0 right-0"
                style={{
                  top: `${(i + 1) * PAGE_HEIGHT_MM - pageEndMargin}mm`,
                  height: `${pageEndMargin}mm`,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: '3px solid #ef4444',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const calculateSectionTotal = (sectionIndex: number) => {
    const section = data.sections[sectionIndex];
    if (!section) return 0;
    return section.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotals = (sectionIndex: number) => {
    const subtotal = calculateSectionTotal(sectionIndex);
    const vat = subtotal * (data.vatRate / 100);
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const getCustomerAddress = () => {
    const parts = [];
    if (data.customer.street) {
      let streetPart = data.customer.street;
      if (data.customer.building) streetPart += ` ${data.customer.building}`;
      if (data.customer.apartment) streetPart += ` דירה ${data.customer.apartment}`;
      parts.push(streetPart);
    }
    if (data.customer.city) parts.push(data.customer.city);
    return parts.join(', ') || '---';
  };

  // Layout: Construction - Uses display settings
  if (layout === 'construction') {
    return (
      <div ref={ref} className={`quote-preview bg-white shadow-xl overflow-hidden font-sans ${fontSizeClass} relative`} style={{ width: '210mm', minHeight: '297mm' }}>
        {renderPageBreakOverlay()}
        {/* Header */}
        <div className={`quote-header ${headerPadding} border-b-2`} style={{ borderColor: colors.primary }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`${headerTitleSize} font-bold`} style={{ color: colors.primaryDark }}>{data.headerTitle}</h1>
              <div className="flex gap-4 mt-1" style={{ color: colors.muted }}>
                {data.company.phone && <span>{data.company.phone}</span>}
                {data.company.email && <span>{data.company.email}</span>}
              </div>
            </div>
            <div className="text-left">
              {settings.showQuoteTitle && (
                <h2 className="text-xl font-bold mb-2" style={{ color: colors.muted }}>הצעת מחיר</h2>
              )}
              <div className="space-y-0.5" style={{ color: colors.muted }}>
                <p>מס׳: <strong>{data.quoteNumber || '---'}</strong></p>
                <p>תאריך: <strong>{formatDate(data.date)}</strong></p>
                <p>בתוקף עד: <strong>{formatDate(data.validUntil)}</strong></p>
              </div>
            </div>
          </div>
        </div>

        <div className="quote-customer px-6 py-3 mb-3 bg-gray-50">
          <h3 className="font-bold mb-1" style={{ color: colors.primary }}>לכבוד</h3>
          <p className="font-medium">{data.customer.name || '---'}</p>
          <p style={{ color: colors.muted }}>{getCustomerAddress()}</p>
          <div className="flex gap-4" style={{ color: colors.muted }}>
            {data.customer.phone && <span>{data.customer.phone}</span>}
            {data.customer.email && <span>{data.customer.email}</span>}
          </div>
        </div>

        <div className="px-6">

          {/* Sections */}
          {data.sections.map((section, sectionIndex) => {
            const totals = calculateTotals(sectionIndex);
            const isLastSection = sectionIndex === data.sections.length - 1;
            const sectionOptions = { ...defaultSectionDisplayOptions, ...section.displayOptions };
            return (
              <div key={section.id} className="mb-6" data-section-id={section.id}>
                <div className="font-bold py-2 px-4 rounded-t" style={{ backgroundColor: colors.primary, color: 'white' }}>
                  {section.title}
                  {section.description && <span className="font-normal mr-2 opacity-80">- {section.description}</span>}
                </div>
                
                <table className="w-full" style={{ border: `1px solid ${colors.border}` }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.tableHeader }}>
                      <th className={`${rowPadding} text-right text-white font-medium w-12`}>#</th>
                      <th className={`${rowPadding} text-right text-white font-medium`}>תיאור</th>
                      <th className={`${rowPadding} text-center text-white font-medium w-20`}>כמות</th>
                      <th className={`${rowPadding} text-center text-white font-medium w-24`}>מחיר</th>
                      <th className={`${rowPadding} text-center text-white font-medium w-28`}>סה״כ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, itemIndex) => (
                      <>
                        <tr key={item.id} style={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : colors.tableBg }}>
                          <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border, color: colors.muted }}>{itemIndex + 1}</td>
                          <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border }}>{item.description}</td>
                          <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border }}>{item.quantity}</td>
                          <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border }}>₪{item.unitPrice.toLocaleString()}</td>
                          <td className={`${rowPadding} border-b text-center font-medium`} style={{ borderColor: colors.border }}>₪{(item.quantity * item.unitPrice).toLocaleString()}</td>
                        </tr>
                        {item.subItems.map((sub) => (
                          <tr key={sub.id} style={{ backgroundColor: colors.tableBg }}>
                            <td className="px-2 py-1 border-b" style={{ borderColor: colors.border }}></td>
                            <td className="px-4 py-1 border-b" style={{ borderColor: colors.border, color: colors.muted }}>• {sub.description}</td>
                            <td className="px-2 py-1 border-b text-center" style={{ borderColor: colors.border, color: colors.muted }}>{sub.quantity}</td>
                            <td className="px-2 py-1 border-b text-center" style={{ borderColor: colors.border, color: colors.muted }}>₪{sub.unitPrice.toLocaleString()}</td>
                            <td className="px-2 py-1 border-b text-center" style={{ borderColor: colors.border, color: colors.muted }}>₪{(sub.quantity * sub.unitPrice).toLocaleString()}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
                
                {/* Totals */}
                <div className="mt-3 flex gap-4">
                  <span style={{ color: colors.muted }}>סה״כ: <strong>₪{totals.subtotal.toLocaleString()}</strong></span>
                  <span style={{ color: colors.muted }}>מע״מ {data.vatRate}%: <strong>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                  <span className="font-bold" style={{ color: colors.primary }}>סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}</span>
                </div>

                {/* Notes & Terms - Conditional based on section options */}
                {(sectionOptions.showNotes || sectionOptions.showPaymentTerms) && (
                  <div className="mt-4 flex gap-4">
                    {sectionOptions.showNotes && data.notes && (
                      <div className="flex-1 p-3 rounded" style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047' }}>
                        <strong>הערות:</strong> {data.notes}
                      </div>
                    )}
                    {sectionOptions.showPaymentTerms && data.paymentTerms && (
                      <div className="flex-1 p-3 rounded" style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
                        <strong>תנאי תשלום:</strong> {data.paymentTerms}
                      </div>
                    )}
                  </div>
                )}

                {/* Signatures - Conditional based on section options */}
                {sectionOptions.showSignatures && (
                  <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
                    <div className="pt-3 border-t-2" style={{ borderColor: colors.muted }}>
                      <span style={{ color: colors.muted }}>חתימת הלקוח</span>
                    </div>
                    <div className="pt-3 border-t-2" style={{ borderColor: colors.muted }}>
                      <span style={{ color: colors.muted }}>חתימת החברה</span>
                    </div>
                  </div>
                )}
                
                {/* Extra Spacing - to push content to next page */}
                {sectionOptions.extraSpacingMm > 0 && (
                  <div style={{ height: `${sectionOptions.extraSpacingMm}mm` }} className="bg-white" />
                )}
                
                {/* Page Break Indicator - after each section except last */}
                {!isLastSection && (
                  <div className="mt-4 page-break-marker" style={{ borderTop: '2px dashed #3b82f6', paddingTop: '6px', textAlign: 'center' }}>
                    <span style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 'bold' }}>--- עמוד {sectionIndex + 2}: {data.sections[sectionIndex + 1]?.title} ---</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Layout: Minimal - Uses display settings
  if (layout === 'minimal') {
    return (
      <div ref={ref} className={`quote-preview bg-white shadow-xl overflow-hidden font-sans relative ${fontSizeClass}`} style={{ width: '210mm', minHeight: '297mm' }}>
        {renderPageBreakOverlay()}
        <div className={settings.headerSize === 'compact' ? 'p-6' : settings.headerSize === 'large' ? 'p-12' : 'p-10'}>
          {/* Header */}
          <div className={`flex justify-between items-start ${settings.headerSize === 'compact' ? 'mb-6 pb-3' : settings.headerSize === 'large' ? 'mb-16 pb-8' : 'mb-12 pb-6'} border-b`} style={{ borderColor: colors.border }}>
            <div>
              <h1 className={`${headerTitleSize} font-light mb-2`}>{data.headerTitle}</h1>
              <div style={{ color: colors.muted }}>
                {data.company.phone && <span className="ml-4">{data.company.phone}</span>}
                {data.company.email && <span>{data.company.email}</span>}
              </div>
            </div>
            <div className="text-left">
              {settings.showQuoteTitle && <p style={{ color: colors.muted }}>הצעת מחיר #{data.quoteNumber}</p>}
              {!settings.showQuoteTitle && <p style={{ color: colors.muted }}>מס׳ {data.quoteNumber}</p>}
              <p style={{ color: colors.muted }}>{formatDate(data.date)}</p>
            </div>
          </div>

          {/* Customer */}
          <div className={settings.headerSize === 'compact' ? 'mb-4' : settings.headerSize === 'large' ? 'mb-12' : 'mb-10'}>
            <p className="mb-1" style={{ color: colors.muted }}>לכבוד</p>
            <p className="font-medium" style={{ fontSize: settings.headerSize === 'compact' ? '1rem' : '1.25rem' }}>{data.customer.name || '---'}</p>
            <p style={{ color: colors.muted }}>{getCustomerAddress()}</p>
          </div>

          {/* Sections */}
          {data.sections.map((section, sectionIndex) => {
            const totals = calculateTotals(sectionIndex);
            const isLastSection = sectionIndex === data.sections.length - 1;
            const sectionOptions = { ...defaultSectionDisplayOptions, ...section.displayOptions };
            return (
              <div key={section.id} className={settings.headerSize === 'compact' ? 'mb-6' : 'mb-10'} data-section-id={section.id}>
                <h3 className={`font-medium ${settings.headerSize === 'compact' ? 'mb-2 pb-1' : 'mb-4 pb-2'} border-b`} style={{ borderColor: colors.border }}>{section.title}</h3>
                
                {section.items.map((item, itemIndex) => (
                  <div key={item.id}>
                    <div className={`flex justify-between ${rowPadding} border-b`} style={{ borderColor: colors.border }}>
                      <div className="flex-1">
                        <span className="text-gray-400 ml-3">{itemIndex + 1}.</span>
                        {item.description}
                      </div>
                      <div className="text-left w-32 font-medium">₪{(item.quantity * item.unitPrice).toLocaleString()}</div>
                    </div>
                    {item.subItems.map((sub) => (
                      <div key={sub.id} className={`flex items-center ${rowPadding} pr-8 border-b`} style={{ borderColor: colors.border, color: colors.muted }}>
                        <div className="flex-1">• {sub.description}</div>
                        <div className="w-16 text-center">{sub.quantity}</div>
                        <div className="w-24 text-center">₪{sub.unitPrice.toLocaleString()}</div>
                        <div className="w-32 text-left">₪{(sub.quantity * sub.unitPrice).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ))}
                
                <div className={rowPadding} style={{ color: colors.muted }}>
                  <div className="flex gap-6">
                    <span>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                    <span>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                    <span className="text-base font-bold" style={{ color: colors.text }}>סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Notes & Terms - Per section */}
                {(sectionOptions.showNotes || sectionOptions.showPaymentTerms) && (data.notes || data.paymentTerms) && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border, color: colors.muted }}>
                    {sectionOptions.showNotes && data.notes && <p className="mb-2">{data.notes}</p>}
                    {sectionOptions.showPaymentTerms && data.paymentTerms && <p>{data.paymentTerms}</p>}
                  </div>
                )}
                
                {/* Signatures */}
                {sectionOptions.showSignatures && (
                  <div className="mt-4 grid grid-cols-2 gap-6">
                    <div className="pt-2 border-t" style={{ borderColor: colors.muted }}>
                      <span style={{ color: colors.muted }}>חתימת הלקוח</span>
                    </div>
                    <div className="pt-2 border-t" style={{ borderColor: colors.muted }}>
                      <span style={{ color: colors.muted }}>חתימת החברה</span>
                    </div>
                  </div>
                )}
                
                {/* Extra Spacing */}
                {sectionOptions.extraSpacingMm > 0 && (
                  <div style={{ height: `${sectionOptions.extraSpacingMm}mm` }} className="bg-white" />
                )}
                
                {/* Page Break Indicator */}
                {!isLastSection && (
                  <div className="mt-6 page-break-marker" style={{ borderTop: '2px dashed #f97316', paddingTop: '8px', textAlign: 'center' }}>
                    <span style={{ color: '#f97316', fontWeight: 'bold' }}>--- עמוד {sectionIndex + 2}: {data.sections[sectionIndex + 1]?.title} ---</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Layout: Elegant (with border frame) - Uses display settings
  if (layout === 'elegant') {
    return (
      <div ref={ref} className={`quote-preview bg-white shadow-xl overflow-hidden font-sans relative ${fontSizeClass}`} style={{ width: '210mm', minHeight: '297mm' }}>
        {renderPageBreakOverlay()}
        <div className="m-4 border-2 min-h-full" style={{ borderColor: colors.primary }}>
          {/* Header */}
          <div className={`${headerPadding} text-white text-center`} style={{ backgroundColor: colors.headerBg }}>
            <h1 className={`${headerTitleSize} font-bold mb-2`}>{data.headerTitle}</h1>
            {settings.showQuoteTitle && <p className="opacity-80">הצעת מחיר</p>}
          </div>

          <div className={settings.headerSize === 'compact' ? 'p-4' : settings.headerSize === 'large' ? 'p-10' : 'p-8'}>
            {/* Quote Info & Customer */}
            <div className={`flex justify-between ${settings.headerSize === 'compact' ? 'mb-4' : 'mb-8'}`}>
              <div>
                <h3 className="font-bold mb-2" style={{ color: colors.primary }}>לכבוד</h3>
                <p className="font-medium">{data.customer.name || '---'}</p>
                <p style={{ color: colors.muted }}>{getCustomerAddress()}</p>
                <p style={{ color: colors.muted }}>{data.customer.phone}</p>
              </div>
              <div className={`text-left ${rowPadding} rounded`} style={{ backgroundColor: colors.tableBg }}>
                <p><span style={{ color: colors.muted }}>מספר:</span> <strong>{data.quoteNumber}</strong></p>
                <p><span style={{ color: colors.muted }}>תאריך:</span> <strong>{formatDate(data.date)}</strong></p>
                <p><span style={{ color: colors.muted }}>בתוקף עד:</span> <strong>{formatDate(data.validUntil)}</strong></p>
              </div>
            </div>

            {/* Sections */}
            {data.sections.map((section, sectionIndex) => {
              const totals = calculateTotals(sectionIndex);
              const isLastSection = sectionIndex === data.sections.length - 1;
              const sectionOptions = { ...defaultSectionDisplayOptions, ...section.displayOptions };
              return (
                <div key={section.id} className={settings.headerSize === 'compact' ? 'mb-4' : 'mb-8'} data-section-id={section.id}>
                  <div className={`${rowPadding} mb-2 text-white font-bold`} style={{ backgroundColor: colors.primary }}>
                    {section.title}
                  </div>
                  
                  <table className="w-full border" style={{ borderColor: colors.border }}>
                    <thead>
                      <tr style={{ backgroundColor: colors.tableBg }}>
                        <th className={`${rowPadding} text-right border-b`} style={{ borderColor: colors.border }}>#</th>
                        <th className={`${rowPadding} text-right border-b`} style={{ borderColor: colors.border }}>תיאור</th>
                        <th className={`${rowPadding} text-center border-b`} style={{ borderColor: colors.border }}>כמות</th>
                        <th className={`${rowPadding} text-center border-b`} style={{ borderColor: colors.border }}>מחיר</th>
                        <th className={`${rowPadding} text-left border-b`} style={{ borderColor: colors.border }}>סה״כ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map((item, itemIndex) => (
                        <>
                          <tr key={item.id}>
                            <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border }}>{itemIndex + 1}</td>
                            <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border }}>{item.description}</td>
                            <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border }}>{item.quantity}</td>
                            <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border }}>₪{item.unitPrice.toLocaleString()}</td>
                            <td className={`${rowPadding} border-b text-left font-medium`} style={{ borderColor: colors.border }}>₪{(item.quantity * item.unitPrice).toLocaleString()}</td>
                          </tr>
                          {item.subItems.map((sub) => (
                            <tr key={sub.id} style={{ backgroundColor: colors.tableBg }}>
                              <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border }}></td>
                              <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border, color: colors.muted }}>• {sub.description}</td>
                              <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border, color: colors.muted }}>{sub.quantity}</td>
                              <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border, color: colors.muted }}>₪{sub.unitPrice.toLocaleString()}</td>
                              <td className={`${rowPadding} border-b text-left`} style={{ borderColor: colors.border, color: colors.muted }}>₪{(sub.quantity * sub.unitPrice).toLocaleString()}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Totals */}
                  <div className="mt-3">
                    <div className="flex gap-6">
                      <span style={{ color: colors.muted }}>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                      <span style={{ color: colors.muted }}>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                      <span className="font-bold" style={{ color: colors.primary }}>סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Notes & Terms - Per section */}
                  {(sectionOptions.showNotes || sectionOptions.showPaymentTerms) && (data.notes || data.paymentTerms) && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-8" style={{ borderColor: colors.border }}>
                      {sectionOptions.showNotes && data.notes && (
                        <div>
                          <h4 className="font-bold mb-2" style={{ color: colors.primary }}>הערות</h4>
                          <p style={{ color: colors.muted }}>{data.notes}</p>
                        </div>
                      )}
                      {sectionOptions.showPaymentTerms && data.paymentTerms && (
                        <div>
                          <h4 className="font-bold mb-2" style={{ color: colors.primary }}>תנאי תשלום</h4>
                          <p style={{ color: colors.muted }}>{data.paymentTerms}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Signatures */}
                  {sectionOptions.showSignatures && (
                    <div className="mt-4 grid grid-cols-2 gap-8">
                      <div className="pt-4 border-t-2" style={{ borderColor: colors.muted }}>
                        <span style={{ color: colors.muted }}>חתימת הלקוח</span>
                      </div>
                      <div className="pt-4 border-t-2" style={{ borderColor: colors.muted }}>
                        <span style={{ color: colors.muted }}>חתימת החברה</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Extra Spacing */}
                  {sectionOptions.extraSpacingMm > 0 && (
                    <div style={{ height: `${sectionOptions.extraSpacingMm}mm` }} className="bg-white" />
                  )}
                  
                  {/* Page Break Indicator */}
                  {!isLastSection && (
                    <div className="mt-6 page-break-marker" style={{ borderTop: '2px dashed #1e3a5f', paddingTop: '8px', textAlign: 'center' }}>
                      <span style={{ color: '#1e3a5f', fontWeight: 'bold' }}>--- עמוד {sectionIndex + 2}: {data.sections[sectionIndex + 1]?.title} ---</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default layouts: modern, classic, bold - Uses display settings
  const isGradient = colors.headerBg.includes('gradient');
  
  // Helper to render notes and signature (used after each section)
  const renderNotesAndSignature = (sectionOptions: { showNotes: boolean; showPaymentTerms: boolean; showSignatures: boolean }) => (
    <>
      {/* Notes & Terms - Single row - Conditional */}
      {(sectionOptions.showNotes || sectionOptions.showPaymentTerms) && (data.notes || data.paymentTerms) && (
        <div className="flex gap-3 mt-3">
          {sectionOptions.showNotes && data.notes && (
            <div className={`flex-1 rounded ${rowPadding}`} style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047' }}>
              <span className="font-bold">הערות: </span>
              <span>{data.notes}</span>
            </div>
          )}
          {sectionOptions.showPaymentTerms && data.paymentTerms && (
            <div className={`flex-1 rounded ${rowPadding}`} style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
              <span className="font-bold">תנאי תשלום: </span>
              <span>{data.paymentTerms}</span>
            </div>
          )}
        </div>
      )}

      {/* Signatures - Compact - Conditional */}
      {sectionOptions.showSignatures && (
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="pt-2" style={{ borderTop: `1px solid ${colors.muted}` }}>
            <p style={{ color: colors.muted }}>חתימת הלקוח</p>
          </div>
          <div className="pt-2" style={{ borderTop: `1px solid ${colors.muted}` }}>
            <p style={{ color: colors.muted }}>חתימת החברה</p>
          </div>
        </div>
      )}
    </>
  );
  
  return (
    <div ref={ref} className={`quote-preview bg-white shadow-xl overflow-hidden font-sans relative ${fontSizeClass}`} style={{ width: '210mm', minHeight: '297mm' }}>
      {renderPageBreakOverlay()}
      {/* Header - respects settings */}
      <div 
        className={`text-white ${headerPadding}`}
        style={{ background: isGradient ? colors.headerBg : colors.headerBg }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className={`font-bold ${headerTitleSize}`}>{data.headerTitle}</span>
            {data.company.phone && <span dir="ltr" className="opacity-80">{data.company.phone}</span>}
            {data.company.email && <span dir="ltr" className="opacity-80">{data.company.email}</span>}
          </div>
          <div className="flex items-center gap-3 opacity-90">
            {settings.showQuoteTitle && <span className="font-bold">הצעת מחיר</span>}
            <span>מס׳: <strong>{data.quoteNumber || '---'}</strong></span>
            <span>תאריך: <strong>{formatDate(data.date)}</strong></span>
            <span>בתוקף עד: <strong>{formatDate(data.validUntil)}</strong></span>
          </div>
        </div>
      </div>

      <div className={settings.headerSize === 'compact' ? 'px-3 py-2' : settings.headerSize === 'large' ? 'px-6 py-5' : 'px-4 py-3'}>
        {/* Customer Info */}
        <div className={`mb-3 ${rowPadding} rounded`} style={{ backgroundColor: colors.tableBg, border: `1px solid ${colors.border}` }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: colors.primary }}>לכבוד:</span>
              <span className="font-medium">{data.customer.name || '---'}</span>
              {getCustomerAddress() !== '---' && <span style={{ color: colors.muted }}>| {getCustomerAddress()}</span>}
            </div>
            <div className="flex gap-3" style={{ color: colors.muted }}>
              {data.customer.phone && <span dir="ltr">{data.customer.phone}</span>}
              {data.customer.email && <span dir="ltr">{data.customer.email}</span>}
            </div>
          </div>
        </div>

        {/* Sections - Each section after the first will auto page-break */}
        {data.sections.map((section, sectionIndex) => {
          const totals = calculateTotals(sectionIndex);
          const isLastSection = sectionIndex === data.sections.length - 1;
          const sectionOptions = { ...defaultSectionDisplayOptions, ...section.displayOptions };
          
          return (
            <div 
              key={section.id} 
              className={settings.headerSize === 'compact' ? 'mb-3' : 'mb-4'}
              data-section-id={section.id}
            >
              <div className={`${rowPadding} rounded-t-lg text-white`} style={{ backgroundColor: colors.primaryDark }}>
                <span className="font-bold">{section.title}</span>
                {section.description && <span className="mr-2 opacity-70">- {section.description}</span>}
              </div>
              
              <table className="w-full border-collapse" style={{ border: `1px solid ${colors.border}` }}>
                <thead>
                  <tr style={{ backgroundColor: colors.tableHeader }}>
                    <th className={`${rowPadding} text-right font-medium w-8 text-white`}>#</th>
                    <th className={`${rowPadding} text-right font-medium text-white`}>תיאור</th>
                    <th className={`${rowPadding} text-center font-medium w-14 text-white`}>כמות</th>
                    <th className={`${rowPadding} text-center font-medium w-20 text-white`}>מחיר</th>
                    <th className={`${rowPadding} text-center font-medium w-20 text-white`}>סה״כ</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, itemIndex) => (
                    <>
                      <tr key={item.id} style={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : colors.tableBg }}>
                        <td className={`${rowPadding} text-center border-b`} style={{ color: colors.muted, borderColor: colors.border }}>{itemIndex + 1}</td>
                        <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border }}>{item.description || '---'}</td>
                        <td className={`${rowPadding} text-center border-b`} style={{ borderColor: colors.border }}>{item.quantity}</td>
                        <td className={`${rowPadding} text-center border-b`} style={{ borderColor: colors.border }}>₪{item.unitPrice.toLocaleString()}</td>
                        <td className={`${rowPadding} text-center font-medium border-b`} style={{ borderColor: colors.border }}>₪{(item.quantity * item.unitPrice).toLocaleString()}</td>
                      </tr>
                      {item.subItems.map((sub) => (
                        <tr key={sub.id} style={{ backgroundColor: colors.tableBg }}>
                          <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border }}></td>
                          <td className={`${rowPadding} border-b`} style={{ borderColor: colors.border, color: colors.muted }}>• {sub.description}</td>
                          <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border, color: colors.muted }}>{sub.quantity}</td>
                          <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border, color: colors.muted }}>₪{sub.unitPrice.toLocaleString()}</td>
                          <td className={`${rowPadding} border-b text-center`} style={{ borderColor: colors.border, color: colors.muted }}>₪{(sub.quantity * sub.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-2 flex gap-3 items-center">
                <span style={{ color: colors.muted }}>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                <span style={{ color: colors.muted }}>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                <span className={`${rowPadding} rounded text-white font-bold`} style={{ backgroundColor: colors.primary }}>
                  סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}
                </span>
              </div>
              
              {/* Notes, Signature after each section */}
              {renderNotesAndSignature(sectionOptions)}
              
              {/* Extra Spacing - to push content to next page */}
              {sectionOptions.extraSpacingMm > 0 && (
                <div style={{ height: `${sectionOptions.extraSpacingMm}mm` }} className="bg-white" />
              )}
              
              {/* Page Break Indicator - show if not last section */}
              {!isLastSection && (
                <div className="mt-4 page-break-marker" style={{ borderTop: '2px dashed #3b82f6', paddingTop: '4px', textAlign: 'center' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>--- עמוד {sectionIndex + 2}: {data.sections[sectionIndex + 1]?.title || 'חלופה נוספת'} ---</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {data.sections.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded" style={{ borderColor: colors.border }}>
            <p className="text-sm" style={{ color: colors.muted }}>אין פריטים להצגה</p>
          </div>
        )}
      </div>
    </div>
  );
});

QuotePreview.displayName = 'QuotePreview';

export default QuotePreview;
