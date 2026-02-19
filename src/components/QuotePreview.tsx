'use client';

import { QuoteData, TemplateStyle, templates } from '@/types/quote';
import { forwardRef } from 'react';

interface QuotePreviewProps {
  data: QuoteData;
  templateId?: string;
}

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(({ data, templateId = 'modern-blue' }, ref) => {
  const template = templates.find(t => t.id === templateId) || templates[0];
  const { colors, layout } = template;

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

  // Layout: Construction (like the template image)
  if (layout === 'construction') {
    return (
      <div ref={ref} className="quote-preview bg-white shadow-xl overflow-hidden font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Simple Header */}
        <div className="p-8 border-b-4" style={{ borderColor: colors.primary }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: colors.primaryDark }}>{data.headerTitle}</h1>
              <div className="text-sm space-y-0.5" style={{ color: colors.muted }}>
                {data.company.phone && <p>{data.company.phone}</p>}
                {data.company.email && <p>{data.company.email}</p>}
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.muted }}>הצעת מחיר</h2>
              <table className="text-sm">
                <tbody>
                  <tr>
                    <td className="px-2 py-1 font-medium" style={{ color: colors.primary }}>מס׳ הצעה</td>
                    <td className="px-2 py-1">{data.quoteNumber || '---'}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-medium" style={{ color: colors.primary }}>תאריך</td>
                    <td className="px-2 py-1">{formatDate(data.date)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 font-medium" style={{ color: colors.primary }}>בתוקף עד</td>
                    <td className="px-2 py-1">{formatDate(data.validUntil)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Customer */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: colors.primary }}>לכבוד</h3>
            <p className="font-medium">{data.customer.name || '---'}</p>
            <p className="text-sm" style={{ color: colors.muted }}>{getCustomerAddress()}</p>
            <p className="text-sm" style={{ color: colors.muted }}>{data.customer.phone}</p>
          </div>

          {/* Sections */}
          {data.sections.map((section, sectionIndex) => {
            const totals = calculateTotals(sectionIndex);
            return (
              <div key={section.id} className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: colors.primary }}>
                  {section.title}
                </h3>
                {section.description && <p className="text-sm mb-2" style={{ color: colors.muted }}>{section.description}</p>}
                
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: colors.tableHeader }}>
                      <th className="px-3 py-2 text-right text-white font-medium">תיאור</th>
                      <th className="px-3 py-2 text-center text-white font-medium w-20">כמות</th>
                      <th className="px-3 py-2 text-center text-white font-medium w-24">מחיר</th>
                      <th className="px-3 py-2 text-left text-white font-medium w-24">סה״כ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, itemIndex) => (
                      <>
                        <tr key={item.id} style={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : colors.tableBg }}>
                          <td className="px-3 py-2 border-b" style={{ borderColor: colors.border }}>{item.description}</td>
                          <td className="px-3 py-2 border-b text-center" style={{ borderColor: colors.border }}>{item.quantity}</td>
                          <td className="px-3 py-2 border-b text-center" style={{ borderColor: colors.border }}>₪{item.unitPrice.toLocaleString()}</td>
                          <td className="px-3 py-2 border-b text-left" style={{ borderColor: colors.border }}>₪{(item.quantity * item.unitPrice).toLocaleString()}</td>
                        </tr>
                        {item.subItems.map((sub, subIdx) => (
                          <tr key={sub.id} style={{ backgroundColor: colors.tableBg }}>
                            <td className="px-3 py-1 border-b text-sm" style={{ borderColor: colors.border, color: colors.muted }}></td>
                            <td className="px-3 py-1 border-b text-sm" style={{ borderColor: colors.border, color: colors.muted, paddingRight: '1rem' }}>
                              • {sub.description}
                            </td>
                            <td className="px-3 py-1 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>{sub.quantity}</td>
                            <td className="px-3 py-1 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>₪{sub.unitPrice.toLocaleString()}</td>
                            <td className="px-3 py-1 border-b text-sm text-left" style={{ borderColor: colors.border, color: colors.muted }}>₪{(sub.quantity * sub.unitPrice).toLocaleString()}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
                
                {/* Totals */}
                <div className="mt-3 text-sm">
                  <div className="flex gap-6">
                    <span style={{ color: colors.muted }}>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                    <span style={{ color: colors.muted }}>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                    <span className="font-bold" style={{ color: colors.primary }}>סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Notes & Terms */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: colors.primary }}>הערות</h4>
              <p className="text-sm whitespace-pre-wrap" style={{ color: colors.muted }}>{data.notes || '---'}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: colors.primary }}>תנאי תשלום</h4>
              <p className="text-sm whitespace-pre-wrap" style={{ color: colors.muted }}>{data.paymentTerms || '---'}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <div className="border-t-2 pt-2" style={{ borderColor: colors.border }}>
                <p className="text-sm" style={{ color: colors.muted }}>חתימת הלקוח</p>
              </div>
            </div>
            <div>
              <div className="border-t-2 pt-2" style={{ borderColor: colors.border }}>
                <p className="text-sm" style={{ color: colors.muted }}>חתימת החברה</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout: Minimal
  if (layout === 'minimal') {
    return (
      <div ref={ref} className="quote-preview bg-white shadow-xl overflow-hidden font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-12 pb-6 border-b" style={{ borderColor: colors.border }}>
            <div>
              <h1 className="text-4xl font-light mb-2">{data.headerTitle}</h1>
              <div className="text-sm" style={{ color: colors.muted }}>
                {data.company.phone && <span className="ml-4">{data.company.phone}</span>}
                {data.company.email && <span>{data.company.email}</span>}
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm" style={{ color: colors.muted }}>הצעת מחיר #{data.quoteNumber}</p>
              <p className="text-sm" style={{ color: colors.muted }}>{formatDate(data.date)}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-10">
            <p className="text-sm mb-1" style={{ color: colors.muted }}>לכבוד</p>
            <p className="text-xl font-medium">{data.customer.name || '---'}</p>
            <p style={{ color: colors.muted }}>{getCustomerAddress()}</p>
          </div>

          {/* Sections */}
          {data.sections.map((section, sectionIndex) => {
            const totals = calculateTotals(sectionIndex);
            return (
              <div key={section.id} className="mb-10">
                <h3 className="text-lg font-medium mb-4 pb-2 border-b" style={{ borderColor: colors.border }}>{section.title}</h3>
                
                {section.items.map((item, itemIndex) => (
                  <div key={item.id}>
                    <div className="flex justify-between py-3 border-b" style={{ borderColor: colors.border }}>
                      <div className="flex-1">
                        <span className="text-gray-400 ml-3">{itemIndex + 1}.</span>
                        {item.description}
                      </div>
                      <div className="text-left w-32 font-medium">₪{(item.quantity * item.unitPrice).toLocaleString()}</div>
                    </div>
                    {item.subItems.map((sub) => (
                      <div key={sub.id} className="flex items-center py-2 pr-8 text-sm border-b" style={{ borderColor: colors.border, color: colors.muted }}>
                        <div className="flex-1">• {sub.description}</div>
                        <div className="w-16 text-center">{sub.quantity}</div>
                        <div className="w-24 text-center">₪{sub.unitPrice.toLocaleString()}</div>
                        <div className="w-32 text-left">₪{(sub.quantity * sub.unitPrice).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ))}
                
                <div className="py-4 text-sm" style={{ color: colors.muted }}>
                  <div className="flex gap-6">
                    <span>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                    <span>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                    <span className="text-base font-bold" style={{ color: colors.text }}>סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Notes */}
          {(data.notes || data.paymentTerms) && (
            <div className="mt-12 pt-6 border-t text-sm" style={{ borderColor: colors.border, color: colors.muted }}>
              {data.notes && <p className="mb-2">{data.notes}</p>}
              {data.paymentTerms && <p>{data.paymentTerms}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Layout: Elegant (with border frame)
  if (layout === 'elegant') {
    return (
      <div ref={ref} className="quote-preview bg-white shadow-xl overflow-hidden font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="m-4 border-2 min-h-full" style={{ borderColor: colors.primary }}>
          {/* Header */}
          <div className="p-8 text-white text-center" style={{ backgroundColor: colors.headerBg }}>
            <h1 className="text-3xl font-bold mb-2">{data.headerTitle}</h1>
            <p className="text-lg opacity-80">הצעת מחיר</p>
          </div>

          <div className="p-8">
            {/* Quote Info & Customer */}
            <div className="flex justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold mb-2" style={{ color: colors.primary }}>לכבוד</h3>
                <p className="font-medium text-lg">{data.customer.name || '---'}</p>
                <p style={{ color: colors.muted }}>{getCustomerAddress()}</p>
                <p style={{ color: colors.muted }}>{data.customer.phone}</p>
              </div>
              <div className="text-left p-4 rounded" style={{ backgroundColor: colors.tableBg }}>
                <p><span style={{ color: colors.muted }}>מספר:</span> <strong>{data.quoteNumber}</strong></p>
                <p><span style={{ color: colors.muted }}>תאריך:</span> <strong>{formatDate(data.date)}</strong></p>
                <p><span style={{ color: colors.muted }}>בתוקף עד:</span> <strong>{formatDate(data.validUntil)}</strong></p>
              </div>
            </div>

            {/* Sections */}
            {data.sections.map((section, sectionIndex) => {
              const totals = calculateTotals(sectionIndex);
              return (
                <div key={section.id} className="mb-8">
                  <div className="py-2 px-4 mb-2 text-white font-bold" style={{ backgroundColor: colors.primary }}>
                    {section.title}
                  </div>
                  
                  <table className="w-full border" style={{ borderColor: colors.border }}>
                    <thead>
                      <tr style={{ backgroundColor: colors.tableBg }}>
                        <th className="px-4 py-2 text-right border-b" style={{ borderColor: colors.border }}>#</th>
                        <th className="px-4 py-2 text-right border-b" style={{ borderColor: colors.border }}>תיאור</th>
                        <th className="px-4 py-2 text-center border-b" style={{ borderColor: colors.border }}>כמות</th>
                        <th className="px-4 py-2 text-center border-b" style={{ borderColor: colors.border }}>מחיר</th>
                        <th className="px-4 py-2 text-left border-b" style={{ borderColor: colors.border }}>סה״כ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map((item, itemIndex) => (
                        <>
                          <tr key={item.id}>
                            <td className="px-4 py-2 border-b text-center" style={{ borderColor: colors.border }}>{itemIndex + 1}</td>
                            <td className="px-4 py-2 border-b" style={{ borderColor: colors.border }}>{item.description}</td>
                            <td className="px-4 py-2 border-b text-center" style={{ borderColor: colors.border }}>{item.quantity}</td>
                            <td className="px-4 py-2 border-b text-center" style={{ borderColor: colors.border }}>₪{item.unitPrice.toLocaleString()}</td>
                            <td className="px-4 py-2 border-b text-left font-medium" style={{ borderColor: colors.border }}>₪{(item.quantity * item.unitPrice).toLocaleString()}</td>
                          </tr>
                          {item.subItems.map((sub) => (
                            <tr key={sub.id} style={{ backgroundColor: colors.tableBg }}>
                              <td className="px-4 py-1 border-b text-sm" style={{ borderColor: colors.border }}></td>
                              <td className="px-4 py-1 border-b text-sm" style={{ borderColor: colors.border, color: colors.muted }}>• {sub.description}</td>
                              <td className="px-4 py-1 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>{sub.quantity}</td>
                              <td className="px-4 py-1 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>₪{sub.unitPrice.toLocaleString()}</td>
                              <td className="px-4 py-1 border-b text-sm text-left" style={{ borderColor: colors.border, color: colors.muted }}>₪{(sub.quantity * sub.unitPrice).toLocaleString()}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Totals */}
                  <div className="mt-3 text-sm">
                    <div className="flex gap-6">
                      <span style={{ color: colors.muted }}>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                      <span style={{ color: colors.muted }}>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                      <span className="font-bold" style={{ color: colors.primary }}>סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Notes & Signatures */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
              <div className="grid grid-cols-2 gap-8 mb-8">
                {data.notes && (
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: colors.primary }}>הערות</h4>
                    <p className="text-sm" style={{ color: colors.muted }}>{data.notes}</p>
                  </div>
                )}
                {data.paymentTerms && (
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: colors.primary }}>תנאי תשלום</h4>
                    <p className="text-sm" style={{ color: colors.muted }}>{data.paymentTerms}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-t-2 pt-4" style={{ borderColor: colors.primary }}>
                  <p style={{ color: colors.muted }}>חתימת הלקוח</p>
                </div>
                <div className="border-t-2 pt-4" style={{ borderColor: colors.primary }}>
                  <p style={{ color: colors.muted }}>חתימת החברה</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layouts: modern, classic, bold
  const isGradient = colors.headerBg.includes('gradient');
  
  return (
    <div ref={ref} className="quote-preview bg-white shadow-xl overflow-hidden font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div 
        className="p-8 text-white"
        style={{ background: isGradient ? colors.headerBg : colors.headerBg }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.headerTitle}</h1>
            <div className="space-y-1 opacity-80">
              {data.company.phone && (
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">{data.company.phone}</span>
                </p>
              )}
              {data.company.email && (
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span dir="ltr">{data.company.email}</span>
                </p>
              )}
            </div>
          </div>
          <div className="text-left">
            <div className="backdrop-blur px-6 py-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-2xl font-bold mb-2">הצעת מחיר</h2>
              <div className="text-sm space-y-1 opacity-90">
                <p>מס׳: <span className="font-medium">{data.quoteNumber || '---'}</span></p>
                <p>תאריך: <span className="font-medium">{formatDate(data.date)}</span></p>
                <p>בתוקף עד: <span className="font-medium">{formatDate(data.validUntil)}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Customer Info */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.tableBg, border: `1px solid ${colors.border}` }}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
            <svg className="w-5 h-5" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            לכבוד
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-lg">{data.customer.name || '---'}</p>
              <p style={{ color: colors.muted }}>{getCustomerAddress()}</p>
            </div>
            <div className="text-left">
              <p dir="ltr">{data.customer.phone || '---'}</p>
              <p dir="ltr">{data.customer.email || '---'}</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        {data.sections.map((section, sectionIndex) => {
          const totals = calculateTotals(sectionIndex);
          return (
            <div key={section.id} className="mb-8">
              <div className="px-6 py-3 rounded-t-lg text-white" style={{ backgroundColor: colors.primaryDark }}>
                <h3 className="text-xl font-bold">{section.title}</h3>
                {section.description && <p className="text-sm mt-1 opacity-70">{section.description}</p>}
              </div>
              
              <table className="w-full border-collapse" style={{ border: `1px solid ${colors.border}` }}>
                <thead>
                  <tr style={{ backgroundColor: colors.tableHeader }}>
                    <th className="px-4 py-3 text-right font-medium w-12 text-white">#</th>
                    <th className="px-4 py-3 text-right font-medium text-white">תיאור</th>
                    <th className="px-4 py-3 text-center font-medium w-20 text-white">כמות</th>
                    <th className="px-4 py-3 text-center font-medium w-28 text-white">מחיר</th>
                    <th className="px-4 py-3 text-center font-medium w-28 text-white">סה״כ</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, itemIndex) => (
                    <>
                      <tr key={item.id} style={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : colors.tableBg }}>
                        <td className="px-4 py-3 text-center border-b" style={{ color: colors.muted, borderColor: colors.border }}>{itemIndex + 1}</td>
                        <td className="px-4 py-3 border-b font-medium" style={{ borderColor: colors.border }}>{item.description || '---'}</td>
                        <td className="px-4 py-3 text-center border-b" style={{ borderColor: colors.border }}>{item.quantity}</td>
                        <td className="px-4 py-3 text-center border-b" style={{ borderColor: colors.border }}>₪{item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center font-medium border-b" style={{ borderColor: colors.border }}>₪{(item.quantity * item.unitPrice).toLocaleString()}</td>
                      </tr>
                      {item.subItems.map((sub) => (
                        <tr key={sub.id} style={{ backgroundColor: colors.tableBg }}>
                          <td className="px-4 py-2 border-b text-sm" style={{ borderColor: colors.border }}></td>
                          <td className="px-4 py-2 border-b text-sm" style={{ borderColor: colors.border, color: colors.muted }}>• {sub.description}</td>
                          <td className="px-4 py-2 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>{sub.quantity}</td>
                          <td className="px-4 py-2 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>₪{sub.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-sm text-center" style={{ borderColor: colors.border, color: colors.muted }}>₪{(sub.quantity * sub.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 text-sm">
                <div className="flex gap-6 items-center">
                  <span style={{ color: colors.muted }}>סה״כ: <strong style={{ color: colors.text }}>₪{totals.subtotal.toLocaleString()}</strong></span>
                  <span style={{ color: colors.muted }}>מע״מ {data.vatRate}%: <strong style={{ color: colors.text }}>₪{Math.round(totals.vat).toLocaleString()}</strong></span>
                  <span className="py-2 px-4 rounded-lg text-white font-bold" style={{ backgroundColor: colors.primary }}>
                    סה״כ כולל מע״מ: ₪{Math.round(totals.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {data.sections.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-xl" style={{ borderColor: colors.border }}>
            <p className="text-lg" style={{ color: colors.muted }}>אין פריטים להצגה</p>
          </div>
        )}

        {/* Notes & Terms */}
        {(data.notes || data.paymentTerms) && (
          <div className="grid grid-cols-2 gap-6 mt-8">
            {data.notes && (
              <div className="rounded-lg p-4" style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047' }}>
                <h4 className="font-bold mb-2">הערות</h4>
                <p className="text-sm whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}
            {data.paymentTerms && (
              <div className="rounded-lg p-4" style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
                <h4 className="font-bold mb-2">תנאי תשלום</h4>
                <p className="text-sm whitespace-pre-wrap">{data.paymentTerms}</p>
              </div>
            )}
          </div>
        )}

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="pt-4" style={{ borderTop: `2px solid ${colors.muted}` }}>
            <p style={{ color: colors.muted }}>חתימת הלקוח</p>
          </div>
          <div className="pt-4" style={{ borderTop: `2px solid ${colors.muted}` }}>
            <p style={{ color: colors.muted }}>חתימת החברה</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 text-center text-sm" style={{ borderTop: `1px solid ${colors.border}`, color: colors.muted }}>
          <p>תודה על הזדמנות להציע הצעה זו | {data.headerTitle}</p>
        </div>
      </div>
    </div>
  );
});

QuotePreview.displayName = 'QuotePreview';

export default QuotePreview;
