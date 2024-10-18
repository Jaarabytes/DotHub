import pg from 'pg';
import { env } from '$env/dynamic/private';

const { Pool } = pg;
const connectionString = env.PRIVATE_POSTGRES_URL
const pool = new Pool({
  connectionString: env.PRIVATE_POSTGRES_URL,
})

console.log(connectionString == undefined ? `Missing postgres connection URI` : `Postgres url is ${env.PRIVATE_POSTGRES_URL}`)

const ITEMS_PER_PAGE = 30;

export async function load({ url }) {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const dotfilesParam = url.searchParams.getAll('dotfiles') || [];
    const client = await pool.connect();
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as count 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
      LEFT JOIN configurations c ON rc.configuration_id = c.id
   `;

    let queryParams = [];

    if (dotfilesParam.length > 0) {
      const placeholders = dotfilesParam.map((_: string, index: number) => `$${index + 1}`).join(', ');
      countQuery += `WHERE c.name IN (${placeholders})`;
      queryParams = dotfilesParam;
    }

    const countResult = await client.query(countQuery, queryParams);
    const totalRepositories = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalRepositories / ITEMS_PER_PAGE);
    const offset = (page - 1) * ITEMS_PER_PAGE;

    let fetchQuery = `
      SELECT r.id, r.owner, r.url, r.description, r.stars, r.last_updated 
      FROM repositories r
      LEFT JOIN repository_configurations rc ON r.id = rc.repository_id
      LEFT JOIN configurations c ON rc.configuration_id = c.id
    `;

    if (dotfilesParam.length > 0) {
      const placeholders = dotfilesParam.map((_: string, index: number) => `$${index + 1}`).join(', ');
      fetchQuery += `WHERE c.name IN (${placeholders})`;
    }

    fetchQuery += `GROUP BY r.id ORDER BY r.stars DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    queryParams.push(ITEMS_PER_PAGE, offset)
    console.log(`Fetch query is ${fetchQuery}`)
    const fetchResults = await client.query(fetchQuery, queryParams);
    const repositories = fetchResults.rows;
    const dotfilesResult = await client.query(`SELECT DISTINCT(name) FROM configurations`);
    const dotfiles = dotfilesResult.rows;

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
