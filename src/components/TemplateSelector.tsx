'use client';

import { templates, TemplateStyle } from '@/types/quote';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: TemplateStyle) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  const getLayoutLabel = (layout: string) => {
    switch (layout) {
      case 'modern': return 'מודרני';
      case 'classic': return 'קלאסי';
      case 'minimal': return 'מינימלי';
      case 'bold': return 'בולט';
      case 'elegant': return 'מסגרת';
      case 'construction': return 'קבלני';
      default: return layout;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </span>
        בחירת תבנית עיצוב
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg text-right ${
              selectedTemplate === template.id
                ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Template Preview */}
            <div className="mb-3 h-24 rounded-lg overflow-hidden shadow-inner border border-gray-100">
              {/* Header simulation */}
              <div 
                className="h-8 w-full"
                style={{ 
                  background: template.colors.headerBg.includes('gradient') 
                    ? template.colors.headerBg 
                    : template.colors.headerBg 
                }}
              />
              {/* Content simulation */}
              <div className="h-16 bg-white p-2">
                <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: template.colors.border }} />
                <div className="flex gap-1">
                  <div className="h-2 flex-1 rounded" style={{ backgroundColor: template.colors.tableBg, border: `1px solid ${template.colors.border}` }} />
                  <div className="h-2 w-8 rounded" style={{ backgroundColor: template.colors.tableHeader }} />
                </div>
                <div className="h-2 w-1/2 rounded mt-1" style={{ backgroundColor: template.colors.border }} />
                <div className="h-3 w-1/3 rounded mt-1" style={{ backgroundColor: template.colors.primary }} />
              </div>
            </div>
            
            <div>
              <span className="text-2xl mb-1 block">{template.preview}</span>
              <h3 className="font-bold text-gray-800">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: template.colors.tableBg, color: template.colors.primary }}>
                {getLayoutLabel(template.layout)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
