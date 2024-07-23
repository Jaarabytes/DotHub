// Global config for db connections, also using supabase (it seems great)
//
import postgres from "postgres";

const connectionString = process.env.SUPABASE_URI as string;
const sql = postgres(connectionString);

export default sql;
