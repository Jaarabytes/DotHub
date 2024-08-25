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

    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as count 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
    `;

    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get();
    const totalRepositories = countResult.count;

    const totalPages = Math.ceil(totalRepositories / ITEMS_PER_PAGE);

    const offset = (page - 1) * ITEMS_PER_PAGE;
    let query = `
      SELECT r.id, r.owner, r.github_url, r.description, r.stars, r.last_updated 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
    `;

    query += ` GROUP BY r.id ORDER BY r.stars DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};`;
    const fetchStmt = db.prepare(query);
    const dotfiles = db.prepare(`SELECT DISTINCT(name) FROM configurations;`).all()
    const repositories = fetchStmt.all();
    console.log(`Total number of repositories are ${totalRepositories}`)
    console.log(`Total number of pages is ${totalPages}`)
    console.log(`Repositories include: ${JSON.stringify(repositories)}`)
    console.log(`Dotfiles include: ${JSON.stringify(dotfiles)}`)
    console.log(`The current page is ${page}`)
    console.log(`It's currently ${new Date}`)
    return {
      totalRepositories,
      totalPages,
      currentPage: page,
      repositories,
      dotfiles
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      error: "Failed to load data"
    };
  }
}
