'use client';

import { QuoteData, QuoteSection, QuoteItem } from '@/types/quote';

interface QuoteFormProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export default function QuoteForm({ data, onChange }: QuoteFormProps) {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateCustomer = (field: string, value: string) => {
    onChange({
      ...data,
      customer: { ...data.customer, [field]: value }
    });
  };

  const updateQuoteInfo = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addSection = () => {
    const newSection: QuoteSection = {
      id: generateId(),
      title: `חלופה ${String.fromCharCode(1488 + data.sections.length)}'`,
      description: '',
      items: [],
      subtotal: 0
    };
    onChange({
      ...data,
      sections: [...data.sections, newSection]
    });
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    onChange({
      ...data,
      sections: data.sections.map(s =>
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    });
  };

  const removeSection = (sectionId: string) => {
    onChange({
      ...data,
      sections: data.sections.filter(s => s.id !== sectionId)
    });
  };

  const addItem = (sectionId: string) => {
    const newItem: QuoteItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    onChange({
      ...data,
      sections: data.sections.map(s =>
        s.id === sectionId
          ? { ...s, items: [...s.items, newItem] }
          : s
      )
    });
  };

  const updateItem = (sectionId: string, itemId: string, field: string, value: string | number) => {
    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map(item => {
            if (item.id !== itemId) return item;
            const updated = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
              updated.total = Number(updated.quantity) * Number(updated.unitPrice);
            }
            return updated;
          })
        };
      })
    });
  };

  const removeItem = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      sections: data.sections.map(s =>
        s.id === sectionId
          ? { ...s, items: s.items.filter(item => item.id !== itemId) }
          : s
      )
    });
  };

  return (
    <div className="space-y-8">
      {/* Quote Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
          פרטי הצעה
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר הצעה</label>
            <input
              type="text"
              value={data.quoteNumber}
              onChange={(e) => updateQuoteInfo('quoteNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Q-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => updateQuoteInfo('date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תוקף עד</label>
            <input
              type="date"
              value={data.validUntil}
              onChange={(e) => updateQuoteInfo('validUntil', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">2</span>
          פרטי לקוח
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם הלקוח</label>
            <input
              type="text"
              value={data.customer.name}
              onChange={(e) => updateCustomer('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ישראל ישראלי"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
            <input
              type="tel"
              value={data.customer.phone}
              onChange={(e) => updateCustomer('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="050-0000000"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
            <input
              type="email"
              value={data.customer.email}
              onChange={(e) => updateCustomer('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@example.com"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
            <input
              type="text"
              value={data.customer.address}
              onChange={(e) => updateCustomer('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="כתובת מלאה"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">3</span>
            פריטי העבודה
          </h2>
          <button
            onClick={addSection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            הוסף חלופה
          </button>
        </div>

        {data.sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת חלופה</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="חלופה א'"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור כללי</label>
                <input
                  type="text"
                  value={section.description}
                  onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="תיאור קצר של החלופה"
                />
              </div>
              <button
                onClick={() => removeSection(section.id)}
                className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="מחק חלופה"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-right px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200">#</th>
                    <th className="text-right px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200">תיאור</th>
                    <th className="text-right px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 w-24">כמות</th>
                    <th className="text-right px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 w-32">מחיר יחידה</th>
                    <th className="text-right px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 w-32">סה״כ</th>
                    <th className="px-3 py-2 border border-gray-200 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, itemIndex) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-3 py-2 border border-gray-200 text-center text-gray-600">
                        {itemIndex + 1}
                      </td>
                      <td className="px-3 py-2 border border-gray-200">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="תיאור הפריט"
                        />
                      </td>
                      <td className="px-3 py-2 border border-gray-200">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                          min="0"
                          step="1"
                        />
                      </td>
                      <td className="px-3 py-2 border border-gray-200">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(section.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                          min="0"
                          step="100"
                        />
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center font-medium">
                        ₪{item.total.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        <button
                          onClick={() => removeItem(section.id, item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => addItem(section.id)}
              className="mt-3 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              הוסף פריט
            </button>
          </div>
        ))}

        {data.sections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">אין חלופות עדיין</p>
            <p className="text-sm">לחץ על ״הוסף חלופה״ כדי להתחיל</p>
          </div>
        )}
      </div>

      {/* Notes & Terms */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">4</span>
          הערות ותנאים
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea
              value={data.notes}
              onChange={(e) => updateQuoteInfo('notes', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="הערות נוספות..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תנאי תשלום</label>
            <textarea
              value={data.paymentTerms}
              onChange={(e) => updateQuoteInfo('paymentTerms', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="תנאי תשלום..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
