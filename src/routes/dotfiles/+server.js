import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit';
let db;
try {
  db = new Database('/home/trafalgar/todo/dotHub/dotHub.sqlite', { verbose: console.log });
} catch (error) {
  console.error('Error connecting to the database:', error.message);
  throw error;
}

export async function POST({ request }) {
  const selectedDotfiles = await request.json();
  console.log(`Dotfiles received from request are ${selectedDotfiles}`)
  const dbData = await db.prepare(`
  SELECT DISTINCT r.owner, r.url, r.description, r.last_updated, r.stars
  FROM repositories r
  JOIN repository_configurations rc ON r.id = rc.repository_id
  JOIN configurations c ON rc.configuration_id = c.id
  WHERE c.name = 'kitty'
  ORDER BY r.owner;`
    ).all();
  console.log(`Db says ${JSON.stringify(dbData)}`)
  return json(dbData);
}
