import { NextRequest, NextResponse } from 'next/server';
import { getQuotes, createQuote, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const quotes = await getQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { name, data, template } = body;
    
    if (!name || !data) {
      return NextResponse.json({ error: 'Name and data are required' }, { status: 400 });
    }
    
    const quote = await createQuote(name, data, template || 'modern-blue');
    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
