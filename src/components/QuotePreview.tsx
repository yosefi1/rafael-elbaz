'use client';

import { QuoteData, TemplateStyle, templates } from '@/types/quote';
import { forwardRef } from 'react';

interface QuotePreviewProps {
  data: QuoteData;
  templateId?: string;
}

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(({ data, templateId = 'modern-blue' }, ref) => {
  const template = templates.find(t => t.id === templateId) || templates[0];
  const { colors } = template;

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

  const getLayoutStyles = () => {
    switch (template.layout) {
      case 'classic':
        return {
          headerPadding: 'p-6',
          headerRadius: 'rounded-none',
          sectionHeaderRadius: 'rounded-none',
          tableBorder: 'border-2',
          fontStyle: 'font-serif'
        };
      case 'minimal':
        return {
          headerPadding: 'p-8',
          headerRadius: 'rounded-none',
          sectionHeaderRadius: 'rounded-t-none',
          tableBorder: 'border',
          fontStyle: 'font-sans'
        };
      case 'bold':
        return {
          headerPadding: 'p-10',
          headerRadius: 'rounded-none',
          sectionHeaderRadius: 'rounded-t-xl',
          tableBorder: 'border-2',
          fontStyle: 'font-sans'
        };
      default: // modern
        return {
          headerPadding: 'p-8',
          headerRadius: 'rounded-none',
          sectionHeaderRadius: 'rounded-t-lg',
          tableBorder: 'border',
          fontStyle: 'font-sans'
        };
    }
  };

  const styles = getLayoutStyles();

  return (
    <div 
      ref={ref} 
      className={`quote-preview bg-white shadow-xl overflow-hidden ${styles.fontStyle}`} 
      style={{ width: '210mm', minHeight: '297mm' }}
    >
      {/* Header */}
      <div 
        className={styles.headerPadding}
        style={{ background: `linear-gradient(to left, ${colors.primary}, ${colors.primaryDark})` }}
      >
        <div className="flex justify-between items-start text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.company.name}</h1>
            <div className="space-y-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {data.company.address}
              </p>
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
            <div className="backdrop-blur px-6 py-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <h2 className="text-2xl font-bold mb-2">הצעת מחיר</h2>
              <div className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <p>מס׳: <span className="text-white font-medium">{data.quoteNumber || '---'}</span></p>
                <p>תאריך: <span className="text-white font-medium">{formatDate(data.date)}</span></p>
                <p>בתוקף עד: <span className="text-white font-medium">{formatDate(data.validUntil)}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Customer Info */}
        <div className="mb-8 p-6 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
            <svg className="w-5 h-5" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            לכבוד
          </h3>
          <div className="grid grid-cols-2 gap-4" style={{ color: colors.text }}>
            <div>
              <p className="font-medium text-lg">{data.customer.name || '---'}</p>
              <p style={{ color: colors.muted }}>{data.customer.address || '---'}</p>
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
              <div 
                className={`px-6 py-3 ${styles.sectionHeaderRadius}`}
                style={{ backgroundColor: colors.primaryDark }}
              >
                <h3 className="text-xl font-bold text-white">{section.title}</h3>
                {section.description && (
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{section.description}</p>
                )}
              </div>
              
              <table className={`w-full border-collapse ${styles.tableBorder}`} style={{ borderColor: '#e2e8f0' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.primary }}>
                    <th className="px-4 py-3 text-right font-medium w-12 text-white">#</th>
                    <th className="px-4 py-3 text-right font-medium text-white">תיאור</th>
                    <th className="px-4 py-3 text-center font-medium w-24 text-white">כמות</th>
                    <th className="px-4 py-3 text-center font-medium w-32 text-white">מחיר יחידה</th>
                    <th className="px-4 py-3 text-center font-medium w-32 text-white">סה״כ</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, itemIndex) => (
                    <tr key={item.id} style={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td className="px-4 py-3 text-center border-b" style={{ color: colors.muted, borderColor: '#e2e8f0' }}>
                        {itemIndex + 1}
                      </td>
                      <td className="px-4 py-3 border-b" style={{ borderColor: '#e2e8f0' }}>
                        {item.description || '---'}
                      </td>
                      <td className="px-4 py-3 text-center border-b" style={{ borderColor: '#e2e8f0' }}>
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-center border-b" style={{ borderColor: '#e2e8f0' }}>
                        ₪{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center font-medium border-b" style={{ borderColor: '#e2e8f0' }}>
                        ₪{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Section Totals */}
              <div className="border border-t-0 rounded-b-lg" style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }}>
                <div className="flex justify-end">
                  <div className="w-72 p-4">
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: '#d1d5db' }}>
                      <span style={{ color: colors.muted }}>סה״כ לפני מע״מ:</span>
                      <span className="font-medium">₪{totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: '#d1d5db' }}>
                      <span style={{ color: colors.muted }}>מע״מ ({data.vatRate}%):</span>
                      <span className="font-medium">₪{Math.round(totals.vat).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg">
                      <span className="font-bold" style={{ color: colors.primaryDark }}>סה״כ כולל מע״מ:</span>
                      <span className="font-bold" style={{ color: colors.primaryDark }}>₪{Math.round(totals.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {data.sections.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-xl" style={{ borderColor: '#e2e8f0' }}>
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg" style={{ color: colors.muted }}>אין פריטים להצגה</p>
            <p className="text-sm" style={{ color: colors.muted }}>הוסף חלופות ופריטים בטופס העריכה</p>
          </div>
        )}

        {/* Notes & Terms */}
        {(data.notes || data.paymentTerms) && (
          <div className="grid grid-cols-2 gap-6 mt-8">
            {data.notes && (
              <div className="rounded-lg p-4 border" style={{ backgroundColor: '#fef9c3', borderColor: '#fde047' }}>
                <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  הערות
                </h4>
                <p className="text-sm whitespace-pre-wrap" style={{ color: colors.text }}>{data.notes}</p>
              </div>
            )}
            {data.paymentTerms && (
              <div className="rounded-lg p-4 border" style={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}>
                <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  תנאי תשלום
                </h4>
                <p className="text-sm whitespace-pre-wrap" style={{ color: colors.text }}>{data.paymentTerms}</p>
              </div>
            )}
          </div>
        )}

        {/* Signature Area */}
        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="pt-4" style={{ borderTop: `2px solid ${colors.muted}` }}>
            <p className="text-center" style={{ color: colors.muted }}>חתימת הלקוח</p>
          </div>
          <div className="pt-4" style={{ borderTop: `2px solid ${colors.muted}` }}>
            <p className="text-center" style={{ color: colors.muted }}>חתימת החברה</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 text-center text-sm" style={{ borderTop: `1px solid #e2e8f0`, color: colors.muted }}>
          <p>תודה על הזדמנות להציע הצעה זו | {data.company.name}</p>
        </div>
      </div>
    </div>
  );
});

QuotePreview.displayName = 'QuotePreview';

export default QuotePreview;
