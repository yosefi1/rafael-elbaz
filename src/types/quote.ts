export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteSection {
  id: string;
  title: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  customer: CustomerInfo;
  company: CompanyInfo;
  sections: QuoteSection[];
  notes: string;
  paymentTerms: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export interface TemplateStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  layout: 'modern' | 'classic' | 'minimal' | 'bold';
}

export const templates: TemplateStyle[] = [
  {
    id: 'modern-blue',
    name: 'מודרני כחול',
    description: 'עיצוב מודרני ומקצועי בגווני כחול',
    preview: '🔵',
    colors: {
      primary: '#2563eb',
      primaryDark: '#1e40af',
      secondary: '#3b82f6',
      accent: '#0ea5e9',
      background: '#ffffff',
      text: '#1e293b',
      muted: '#64748b'
    },
    layout: 'modern'
  },
  {
    id: 'classic-navy',
    name: 'קלאסי כהה',
    description: 'מראה קלאסי ויוקרתי',
    preview: '🔷',
    colors: {
      primary: '#1e3a5f',
      primaryDark: '#0f2744',
      secondary: '#2d4a6f',
      accent: '#4a7c9b',
      background: '#ffffff',
      text: '#1a1a2e',
      muted: '#6b7280'
    },
    layout: 'classic'
  },
  {
    id: 'minimal-gray',
    name: 'מינימלי אפור',
    description: 'עיצוב נקי ופשוט',
    preview: '⬜',
    colors: {
      primary: '#374151',
      primaryDark: '#1f2937',
      secondary: '#4b5563',
      accent: '#6b7280',
      background: '#ffffff',
      text: '#111827',
      muted: '#9ca3af'
    },
    layout: 'minimal'
  },
  {
    id: 'bold-orange',
    name: 'בולט כתום',
    description: 'עיצוב אנרגטי ובולט',
    preview: '🟠',
    colors: {
      primary: '#ea580c',
      primaryDark: '#c2410c',
      secondary: '#f97316',
      accent: '#fb923c',
      background: '#ffffff',
      text: '#1c1917',
      muted: '#78716c'
    },
    layout: 'bold'
  },
  {
    id: 'elegant-green',
    name: 'אלגנטי ירוק',
    description: 'מראה רענן ומקצועי',
    preview: '🟢',
    colors: {
      primary: '#047857',
      primaryDark: '#065f46',
      secondary: '#059669',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1f2937',
      muted: '#6b7280'
    },
    layout: 'modern'
  },
  {
    id: 'royal-purple',
    name: 'מלכותי סגול',
    description: 'עיצוב יוקרתי ומרשים',
    preview: '🟣',
    colors: {
      primary: '#7c3aed',
      primaryDark: '#6d28d9',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      background: '#ffffff',
      text: '#1f2937',
      muted: '#6b7280'
    },
    layout: 'modern'
  }
];
