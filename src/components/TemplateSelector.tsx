'use client';

import { templates, TemplateStyle } from '@/types/quote';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: TemplateStyle) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Color Preview */}
            <div className="mb-3 h-16 rounded-lg overflow-hidden shadow-inner">
              <div 
                className="h-1/2 w-full"
                style={{ background: `linear-gradient(to left, ${template.colors.primary}, ${template.colors.primaryDark})` }}
              />
              <div className="h-1/2 w-full bg-gray-50 flex items-center justify-center">
                <div 
                  className="h-3 w-3/4 rounded"
                  style={{ backgroundColor: template.colors.primary + '20' }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-2xl mb-1 block">{template.preview}</span>
              <h3 className="font-medium text-gray-800 text-sm">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
