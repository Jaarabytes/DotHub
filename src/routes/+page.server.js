import Database from 'better-sqlite3';

let db;
try {
  db = new Database('/home/trafalgar/todo/dotHub/dotHub.sqlite', { verbose: console.log });
} catch (error) {
  console.error('Error connecting to the database:', error.message);
  throw error;
}

const ITEMS_PER_PAGE = 30;

export async function load({ url }) {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const dotfilesParam = url.searchParams.getAll('dotfiles') || [];

    // Build the base count query
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as count 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
      LEFT JOIN configurations c ON rc.configuration_id = c.id
    `;

    // Add filtering condition based on dotfiles if provided
    if (dotfilesParam.length > 0) {
      const placeholders = dotfilesParam.map(() => '?').join(', ');
      countQuery += `WHERE c.name IN (${placeholders})`;
    }

    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(...dotfilesParam);
    const totalRepositories = countResult.count;

    const totalPages = Math.ceil(totalRepositories / ITEMS_PER_PAGE);
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Build the base fetch query
    let fetchQuery = `
      SELECT r.id, r.owner, r.url, r.description, r.stars, r.last_updated 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
      LEFT JOIN configurations c ON rc.configuration_id = c.id
    `;

    // Add filtering condition based on dotfiles if provided
    if (dotfilesParam.length > 0) {
      const placeholders = dotfilesParam.map(() => '?').join(', ');
      fetchQuery += `WHERE c.name IN (${placeholders}) `;
    }

    // Complete the fetch query with pagination and ordering
    fetchQuery += `GROUP BY r.id ORDER BY r.stars DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};`;

    const fetchStmt = db.prepare(fetchQuery);
    const repositories = fetchStmt.all(...dotfilesParam);

    // Fetch all distinct dotfile types for the filter options
    const dotfiles = db.prepare(`SELECT DISTINCT(name) FROM configurations;`).all();

    return {
      totalRepositories,
      totalPages,
      currentPage: page,
      repositories,
      dotfiles
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      totalRepositories: 0,
      totalPages: 0,
      currentPage: 1,
      repositories: [],
      dotfiles: []
    };
  }
}
