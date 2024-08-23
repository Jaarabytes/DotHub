import Database from 'better-sqlite3';

let db;
try {
  db = new Database('/home/trafalgar/todo/dotHub/dotHub.sqlite', { verbose: console.log });
} catch (error) {
  console.error('Error connecting to the database:', error.message);
  throw error;
}

const ITEMS_PER_PAGE = 15;
const REPOSITORIES = 'repositories';
const CONFIGURATIONS = 'configurations';
const REPOSITORY_CONFIGURATIONS = 'repository_configurations';

export async function load(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const categories = url.searchParams.get('categories')?.split(',').filter(Boolean) || [];

    // Count total projects (for pagination)
    let countQuery = `SELECT COUNT(*) as count FROM ${REPOSITORIES}`;
    const countParams = [];

    if (categories.length > 0) {
      countQuery += ` WHERE ${REPOSITORIES}.id IN (SELECT repository_id FROM ${REPOSITORY_CONFIGURATIONS} WHERE configuration_id IN (${categories.map(() => '?').join(',')}))`;
      countParams.push(...categories);
    }

    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(...countParams);
    const totalProjects = countResult.count;

    // Fetch projects for the current page
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let query = `SELECT * FROM ${REPOSITORIES}`;

    if (categories.length > 0) {
      query += ` WHERE id IN (SELECT repository_id FROM ${REPOSITORY_CONFIGURATIONS} WHERE configuration_id IN (${categories.map(() => '?').join(',')}))`;
    }

    query += ` LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    const fetchStmt = db.prepare(query);
    const projects = fetchStmt.all(...categories);

    // Return the result
    return {
      totalProjects,
      projects
    };
  } catch (error) {
    console.error('Error during request processing:', error.message);
    throw error;
  } finally {
    if (db) db.close(); // Ensure the database is closed after operations
  }
}
