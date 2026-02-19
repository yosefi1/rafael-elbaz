export interface SubItem {
  id: string;
  description: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isComplex: boolean;
  subItems: SubItem[];
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
  city: string;
  street: string;
  building: string;
  apartment: string;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
}

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  headerTitle: string;
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
    headerBg: string;
    tableBg: string;
    tableHeader: string;
    text: string;
    muted: string;
    border: string;
  };
  layout: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant' | 'construction';
}

export const templates: TemplateStyle[] = [
  {
    id: 'modern-blue',
    name: 'מודרני כחול',
    description: 'עיצוב מודרני עם גרדיאנט',
    preview: '🔵',
    colors: {
      primary: '#2563eb',
      primaryDark: '#1e40af',
      secondary: '#3b82f6',
      accent: '#0ea5e9',
      background: '#ffffff',
      headerBg: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
      tableBg: '#f8fafc',
      tableHeader: '#2563eb',
      text: '#1e293b',
      muted: '#64748b',
      border: '#e2e8f0'
    },
    layout: 'modern'
  },
  {
    id: 'construction-gray',
    name: 'קבלני מקצועי',
    description: 'סגנון הצעת מחיר לקבלנות',
    preview: '🏗️',
    colors: {
      primary: '#374151',
      primaryDark: '#1f2937',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff',
      headerBg: '#1f2937',
      tableBg: '#f9fafb',
      tableHeader: '#6b7280',
      text: '#111827',
      muted: '#6b7280',
      border: '#d1d5db'
    },
    layout: 'construction'
  },
  {
    id: 'elegant-navy',
    name: 'אלגנטי כהה',
    description: 'מראה יוקרתי עם מסגרת',
    preview: '🔷',
    colors: {
      primary: '#1e3a5f',
      primaryDark: '#0f2744',
      secondary: '#2d4a6f',
      accent: '#4a7c9b',
      background: '#ffffff',
      headerBg: '#0f2744',
      tableBg: '#f8fafc',
      tableHeader: '#1e3a5f',
      text: '#1a1a2e',
      muted: '#6b7280',
      border: '#1e3a5f'
    },
    layout: 'elegant'
  },
  {
    id: 'minimal-clean',
    name: 'מינימלי נקי',
    description: 'עיצוב פשוט ונקי',
    preview: '⬜',
    colors: {
      primary: '#000000',
      primaryDark: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#ffffff',
      headerBg: '#ffffff',
      tableBg: '#ffffff',
      tableHeader: '#f3f4f6',
      text: '#111827',
      muted: '#6b7280',
      border: '#e5e7eb'
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
      headerBg: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
      tableBg: '#fff7ed',
      tableHeader: '#ea580c',
      text: '#1c1917',
      muted: '#78716c',
      border: '#fed7aa'
    },
    layout: 'bold'
  },
  {
    id: 'classic-green',
    name: 'קלאסי ירוק',
    description: 'מראה מסורתי ומקצועי',
    preview: '🟢',
    colors: {
      primary: '#166534',
      primaryDark: '#14532d',
      secondary: '#22c55e',
      accent: '#4ade80',
      background: '#ffffff',
      headerBg: '#14532d',
      tableBg: '#f0fdf4',
      tableHeader: '#166534',
      text: '#1f2937',
      muted: '#6b7280',
      border: '#bbf7d0'
    },
    layout: 'classic'
  },
  {
    id: 'royal-purple',
    name: 'מלכותי סגול',
    description: 'עיצוב יוקרתי ומרשים',
    preview: '🟣',
    colors: {
      primary: '#7c3aed',
      primaryDark: '#5b21b6',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      background: '#ffffff',
      headerBg: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
      tableBg: '#faf5ff',
      tableHeader: '#7c3aed',
      text: '#1f2937',
      muted: '#6b7280',
      border: '#ddd6fe'
    },
    layout: 'modern'
  },
  {
    id: 'professional-red',
    name: 'מקצועי אדום',
    description: 'מראה חזק ומקצועי',
    preview: '🔴',
    colors: {
      primary: '#dc2626',
      primaryDark: '#991b1b',
      secondary: '#ef4444',
      accent: '#f87171',
      background: '#ffffff',
      headerBg: '#991b1b',
      tableBg: '#fef2f2',
      tableHeader: '#dc2626',
      text: '#1f2937',
      muted: '#6b7280',
      border: '#fecaca'
    },
    layout: 'classic'
  }
];
