'use client';

import { useState } from 'react';
import { QuoteData, QuoteSection, QuoteItem, SubItem, DisplaySettings, defaultDisplaySettings, SectionDisplayOptions, defaultSectionDisplayOptions } from '@/types/quote';

interface QuoteFormProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export default function QuoteForm({ data, onChange }: QuoteFormProps) {
  const [draggedItem, setDraggedItem] = useState<{ sectionId: string; itemId: string } | null>(null);
  
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateCustomer = (field: string, value: string) => {
    onChange({
      ...data,
      customer: { ...data.customer, [field]: value }
    });
  };

  const updateCompany = (field: string, value: string) => {
    onChange({
      ...data,
      company: { ...data.company, [field]: value }
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

  const updateSection = (sectionId: string, field: string, value: string | boolean) => {
    onChange({
      ...data,
      sections: data.sections.map(s =>
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    });
  };

  const updateSectionDisplayOptions = (sectionId: string, field: keyof SectionDisplayOptions, value: boolean | number) => {
    onChange({
      ...data,
      sections: data.sections.map(s =>
        s.id === sectionId 
          ? { 
              ...s, 
              displayOptions: { 
                ...(s.displayOptions || defaultSectionDisplayOptions), 
                [field]: value 
              } 
            } 
          : s
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
      total: 0,
      isComplex: false,
      subItems: []
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

  const updateItem = (sectionId: string, itemId: string, field: string, value: string | number | boolean) => {
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

  const toggleComplex = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, isComplex: !item.isComplex };
          })
        };
      })
    });
  };

  const addSubItem = (sectionId: string, itemId: string) => {
    const newSubItem: SubItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, isComplex: true, subItems: [...item.subItems, newSubItem] };
          })
        };
      })
    });
  };

  const updateSubItem = (sectionId: string, itemId: string, subItemId: string, field: string, value: string | number) => {
    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map(item => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              subItems: item.subItems.map(sub => {
                if (sub.id !== subItemId) return sub;
                const updated = { ...sub, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                  updated.total = Number(updated.quantity) * Number(updated.unitPrice);
                }
                return updated;
              })
            };
          })
        };
      })
    });
  };

  const promoteSubItemToItem = (sectionId: string, itemId: string, subItemId: string) => {
    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;
    const parentItem = section.items.find(i => i.id === itemId);
    if (!parentItem) return;
    const subItem = parentItem.subItems.find(s => s.id === subItemId);
    if (!subItem) return;

    const newItem: QuoteItem = {
      id: generateId(),
      description: subItem.description,
      quantity: subItem.quantity,
      unitPrice: subItem.unitPrice,
      total: subItem.total,
      isComplex: false,
      subItems: []
    };

    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== sectionId) return s;
        const updatedItems = s.items.map(item => {
          if (item.id !== itemId) return item;
          const newSubItems = item.subItems.filter(sub => sub.id !== subItemId);
          return {
            ...item,
            subItems: newSubItems,
            isComplex: newSubItems.length > 0
          };
        });
        const parentIndex = updatedItems.findIndex(i => i.id === itemId);
        updatedItems.splice(parentIndex + 1, 0, newItem);
        return { ...s, items: updatedItems };
      })
    });
  };

  const removeSubItem = (sectionId: string, itemId: string, subItemId: string) => {
    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map(item => {
            if (item.id !== itemId) return item;
            const newSubItems = item.subItems.filter(sub => sub.id !== subItemId);
            return {
              ...item,
              subItems: newSubItems,
              isComplex: newSubItems.length > 0
            };
          })
        };
      })
    });
  };

  // Drag and drop to convert item to sub-item OR copy to another section
  const handleDragStart = (sectionId: string, itemId: string) => {
    setDraggedItem({ sectionId, itemId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnItem = (targetSectionId: string, targetItemId: string) => {
    if (!draggedItem) return;
    if (draggedItem.sectionId !== targetSectionId) return;
    if (draggedItem.itemId === targetItemId) return;

    const section = data.sections.find(s => s.id === targetSectionId);
    if (!section) return;

    const draggedItemData = section.items.find(i => i.id === draggedItem.itemId);
    if (!draggedItemData) return;

    // Convert dragged item to sub-item of target
    const newSubItem: SubItem = {
      id: generateId(),
      description: draggedItemData.description,
      quantity: draggedItemData.quantity,
      unitPrice: draggedItemData.unitPrice,
      total: draggedItemData.total
    };

    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== targetSectionId) return s;
        return {
          ...s,
          items: s.items
            .filter(item => item.id !== draggedItem.itemId) // Remove dragged item
            .map(item => {
              if (item.id !== targetItemId) return item;
              return {
                ...item,
                isComplex: true,
                subItems: [...item.subItems, newSubItem]
              };
            })
        };
      })
    });

    setDraggedItem(null);
  };

  // Drop on section to COPY item to that section
  const handleDropOnSection = (targetSectionId: string) => {
    if (!draggedItem) return;
    if (draggedItem.sectionId === targetSectionId) return; // Same section - ignore

    const sourceSection = data.sections.find(s => s.id === draggedItem.sectionId);
    if (!sourceSection) return;

    const draggedItemData = sourceSection.items.find(i => i.id === draggedItem.itemId);
    if (!draggedItemData) return;

    // Create a copy of the item (not move!)
    const copiedItem: QuoteItem = {
      id: generateId(),
      description: draggedItemData.description,
      quantity: draggedItemData.quantity,
      unitPrice: draggedItemData.unitPrice,
      total: draggedItemData.total,
      isComplex: draggedItemData.isComplex,
      subItems: draggedItemData.subItems.map(sub => ({
        ...sub,
        id: generateId()
      }))
    };

    onChange({
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== targetSectionId) return s;
        return {
          ...s,
          items: [...s.items, copiedItem]
        };
      })
    });

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
          הגדרות כותרת
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם החברה (כותרת)</label>
            <input
              type="text"
              value={data.headerTitle}
              onChange={(e) => updateQuoteInfo('headerTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="רפאל אלבז - קבלן שיפוצים"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">טלפון חברה</label>
            <input
              type="tel"
              value={data.company.phone}
              onChange={(e) => updateCompany('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="050-0000000"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל חברה</label>
            <input
              type="email"
              value={data.company.email}
              onChange={(e) => updateCompany('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="info@company.com"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Quote Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">2</span>
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
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">3</span>
          פרטי לקוח
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
            <input
              type="text"
              value={data.customer.city}
              onChange={(e) => updateCustomer('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="תל אביב"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">רחוב</label>
            <input
              type="text"
              value={data.customer.street}
              onChange={(e) => updateCustomer('street', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הרצל"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">בניין</label>
              <input
                type="text"
                value={data.customer.building}
                onChange={(e) => updateCustomer('building', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">דירה</label>
              <input
                type="text"
                value={data.customer.apartment}
                onChange={(e) => updateCustomer('apartment', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">4</span>
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

        <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
          <strong>טיפ:</strong> גרור סעיף על סעיף אחר באותה חלופה להפיכתו לתת-סעיף. גרור סעיף לחלופה אחרת כדי <strong>להעתיק</strong> אותו (לא מעביר!). לחץ על ↑ להחזרת תת-סעיף לסעיף עצמאי.
        </div>

        {data.sections.map((section) => (
          <div 
            key={section.id} 
            className={`mb-6 border-2 rounded-lg p-4 transition-colors ${
              draggedItem && draggedItem.sectionId !== section.id
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDropOnSection(section.id)}
          >
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

            {/* Items Header */}
            {section.items.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 mb-2">
                <div className="w-8 text-center">#</div>
                <div className="flex-1">תיאור</div>
                <div className="w-20 text-center">כמות</div>
                <div className="w-4"></div>
                <div className="w-28 text-center">מחיר</div>
                <div className="w-4"></div>
                <div className="w-28 text-center">סה״כ</div>
                <div className="w-9"></div>
              </div>
            )}

            {/* Items */}
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={item.id} 
                  className={`bg-white border rounded-lg p-4 transition-all ${
                    draggedItem?.itemId === item.id 
                      ? 'border-purple-400 opacity-50' 
                      : 'border-gray-200'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(section.id, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnItem(section.id, item.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-start gap-3">
                    {/* Number + Add Sub-item button */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <span 
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm cursor-grab active:cursor-grabbing"
                        title="גרור לסעיף אחר להפיכה לתת-סעיף"
                      >
                        {itemIndex + 1}
                      </span>
                      <button
                        onClick={() => addSubItem(section.id, item.id)}
                        className="w-6 h-6 bg-purple-100 hover:bg-purple-200 rounded flex items-center justify-center text-purple-600 transition-colors"
                        title="הוסף תת-סעיף"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="תיאור הפריט"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                            placeholder="כמות"
                            min="0"
                          />
                          <span className="text-gray-400">×</span>
                          <input
                            type="number"
                            value={item.unitPrice || ''}
                            onChange={(e) => updateItem(section.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                            placeholder="מחיר"
                            min="0"
                          />
                          <span className="text-gray-400">=</span>
                          <span className="w-28 px-3 py-2 bg-gray-50 rounded-lg text-center font-medium">
                            ₪{(item.quantity * item.unitPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Sub-items */}
                      {item.subItems.length > 0 && (
                        <div className="mr-4 space-y-2 border-r-2 border-purple-200 pr-4">
                          {item.subItems.map((subItem, subIndex) => (
                            <div key={subItem.id} className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                              <span className="text-purple-500 text-sm font-medium w-8">{itemIndex + 1}.{subIndex + 1}</span>
                              <input
                                type="text"
                                value={subItem.description}
                                onChange={(e) => updateSubItem(section.id, item.id, subItem.id, 'description', e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                placeholder="תיאור תת-סעיף"
                              />
                              <input
                                type="number"
                                value={subItem.quantity || ''}
                                onChange={(e) => updateSubItem(section.id, item.id, subItem.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 text-sm text-center"
                                placeholder="כמות"
                                min="0"
                              />
                              <span className="text-gray-400 text-sm">×</span>
                              <input
                                type="number"
                                value={subItem.unitPrice || ''}
                                onChange={(e) => updateSubItem(section.id, item.id, subItem.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 text-sm text-center"
                                placeholder="מחיר"
                                min="0"
                              />
                              <span className="text-gray-400 text-sm">=</span>
                              <span className="w-20 text-sm font-medium text-purple-700">
                                ₪{(subItem.quantity * subItem.unitPrice).toLocaleString()}
                              </span>
                              <button
                                onClick={() => promoteSubItemToItem(section.id, item.id, subItem.id)}
                                className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                                title="הפוך לסעיף עצמאי"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeSubItem(section.id, item.id, subItem.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(section.id, item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
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

            {/* Section Display Options */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-600 font-medium">הצג בסוף חלופה:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.displayOptions?.showNotes ?? true}
                    onChange={(e) => updateSectionDisplayOptions(section.id, 'showNotes', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">הערות</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.displayOptions?.showPaymentTerms ?? true}
                    onChange={(e) => updateSectionDisplayOptions(section.id, 'showPaymentTerms', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">תנאי תשלום</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.displayOptions?.showSignatures ?? true}
                    onChange={(e) => updateSectionDisplayOptions(section.id, 'showSignatures', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">חתימות</span>
                </label>
                <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
                  <span className="text-gray-600">רווח נוסף:</span>
                  <select
                    value={section.displayOptions?.extraSpacingMm ?? 0}
                    onChange={(e) => updateSectionDisplayOptions(section.id, 'extraSpacingMm', parseInt(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={0}>ללא</option>
                    <option value={20}>20 מ״מ</option>
                    <option value={40}>40 מ״מ</option>
                    <option value={60}>60 מ״מ</option>
                    <option value={80}>80 מ״מ</option>
                    <option value={100}>100 מ״מ</option>
                    <option value={150}>150 מ״מ (חצי עמוד)</option>
                    <option value={297}>297 מ״מ (עמוד שלם)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Totals - Left Side */}
            {section.items.length > 0 && (() => {
              const subtotal = section.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
              const vat = subtotal * (data.vatRate / 100);
              const total = subtotal + vat;
              const sectionIndex = data.sections.findIndex(s => s.id === section.id);
              const isLastSection = sectionIndex === data.sections.length - 1;
              return (
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm flex justify-between items-center">
                  {!isLastSection && (
                    <span className="flex items-center gap-2 text-blue-500 text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      מעבר עמוד אוטומטי
                    </span>
                  )}
                  {isLastSection && <span></span>}
                  <div className="flex gap-6 items-center">
                    <span className="text-gray-500">סה״כ: <strong className="text-gray-800">₪{subtotal.toLocaleString()}</strong></span>
                    <span className="text-gray-500">מע״מ {data.vatRate}%: <strong className="text-gray-800">₪{Math.round(vat).toLocaleString()}</strong></span>
                    <span className="py-2 px-4 bg-blue-600 text-white rounded-lg font-bold">
                      סה״כ כולל מע״מ: ₪{Math.round(total).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })()}
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
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">5</span>
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

      {/* Display Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">⚙</span>
          הגדרות תצוגה
        </h2>
        <p className="text-sm text-green-600 mb-4">✓ הגדרות אלו עובדות עם כל התבניות</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">גודל גופן</label>
            <select
              value={data.displaySettings?.fontSize || 'medium'}
              onChange={(e) => onChange({
                ...data,
                displaySettings: { ...(data.displaySettings || defaultDisplaySettings), fontSize: e.target.value as 'small' | 'medium' | 'large' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="small">קטן</option>
              <option value="medium">בינוני</option>
              <option value="large">גדול</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">גודל כותרת</label>
            <select
              value={data.displaySettings?.headerSize || 'normal'}
              onChange={(e) => onChange({
                ...data,
                displaySettings: { ...(data.displaySettings || defaultDisplaySettings), headerSize: e.target.value as 'compact' | 'normal' | 'large' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="compact">קומפקטי</option>
              <option value="normal">רגיל</option>
              <option value="large">גדול</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ריווח שורות</label>
            <select
              value={data.displaySettings?.tableRowPadding || 'normal'}
              onChange={(e) => onChange({
                ...data,
                displaySettings: { ...(data.displaySettings || defaultDisplaySettings), tableRowPadding: e.target.value as 'tight' | 'normal' | 'relaxed' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="tight">צפוף</option>
              <option value="normal">רגיל</option>
              <option value="relaxed">מרווח</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="showQuoteTitle"
              checked={data.displaySettings?.showQuoteTitle !== false}
              onChange={(e) => onChange({
                ...data,
                displaySettings: { ...(data.displaySettings || defaultDisplaySettings), showQuoteTitle: e.target.checked }
              })}
              className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="showQuoteTitle" className="text-sm text-gray-700">הצג "הצעת מחיר"</label>
          </div>
        </div>
        
        {/* Page End Margin - Advanced Setting */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🟢 שוליים מסוף עמוד (אזור בטוח)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                כמה מ״מ לפני סוף העמוד להפסיק תוכן. קו ירוק יסמן את האזור הבטוח.
              </p>
            </div>
            <select
              value={data.displaySettings?.pageEndMarginMm || 0}
              onChange={(e) => onChange({
                ...data,
                displaySettings: { ...(data.displaySettings || defaultDisplaySettings), pageEndMarginMm: parseInt(e.target.value) }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value={0}>ללא (0 מ״מ)</option>
              <option value={10}>10 מ״מ</option>
              <option value={20}>20 מ״מ</option>
              <option value={30}>30 מ״מ</option>
              <option value={40}>40 מ״מ</option>
              <option value={50}>50 מ״מ</option>
              <option value={60}>60 מ״מ</option>
              <option value={80}>80 מ״מ</option>
              <option value={100}>100 מ״מ</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
