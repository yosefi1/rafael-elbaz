import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      quote_number VARCHAR(50) NOT NULL,
      customer_name VARCHAR(255),
      data JSONB NOT NULL,
      template VARCHAR(100) DEFAULT 'modern-blue',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function getQuotes() {
  const rows = await sql`
    SELECT id, name, quote_number, customer_name, template, created_at, updated_at
    FROM quotes
    ORDER BY updated_at DESC
  `;
  return rows;
}

export async function getQuoteById(id: number) {
  const rows = await sql`
    SELECT * FROM quotes WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function createQuote(name: string, data: object, template: string) {
  const quoteData = data as { quoteNumber?: string; customer?: { name?: string } };
  const rows = await sql`
    INSERT INTO quotes (name, quote_number, customer_name, data, template)
    VALUES (
      ${name},
      ${quoteData.quoteNumber || ''},
      ${quoteData.customer?.name || ''},
      ${JSON.stringify(data)},
      ${template}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function updateQuote(id: number, name: string, data: object, template: string) {
  const quoteData = data as { quoteNumber?: string; customer?: { name?: string } };
  const rows = await sql`
    UPDATE quotes
    SET 
      name = ${name},
      quote_number = ${quoteData.quoteNumber || ''},
      customer_name = ${quoteData.customer?.name || ''},
      data = ${JSON.stringify(data)},
      template = ${template},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function deleteQuote(id: number) {
  await sql`DELETE FROM quotes WHERE id = ${id}`;
}

export { sql };
