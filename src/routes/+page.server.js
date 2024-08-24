import Database from 'better-sqlite3';

let db;
try {
  db = new Database('/home/trafalgar/todo/dotHub/dotHub.sqlite', { verbose: console.log });
} catch (error) {
  console.error('Error connecting to the database:', error.message);
  throw error;
}

const ITEMS_PER_PAGE = 15;

export async function load({ url }) {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const dotfiles = url.searchParams.get('dotfiles')?.split(',').filter(Boolean) || [];

    // Count total repositories (for pagination)
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as count 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
    `;
    const countParams = [];

    if (dotfiles.length > 0) {
      countQuery += ` WHERE rc.configuration_id IN (${dotfiles.map(() => '?').join(',')})`;
      countParams.push(...dotfiles);
    }

    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(...countParams);
    const totalProjects = countResult.count;

    // Calculate total pages
    const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);

    // Fetch repositories for the current page
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let query = `
      SELECT r.id, r.owner, r.github_url, r.description, r.stars, r.last_updated 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
    `;

    if (dotfiles.length > 0) {
      query += ` WHERE rc.configuration_id IN (${dotfiles.map(() => '?').join(',')})`;
    }

    query += ` GROUP BY r.id ORDER BY r.stars DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    const fetchStmt = db.prepare(query);
    const projects = fetchStmt.all(...dotfiles);

    // Return the result
    return {
      totalProjects,
      totalPages,
      currentPage: page,
      projects
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      error: "Failed to load data"
    };
  }
  finally {
    if ( db ) db.close();
  }
}
