// Global config for db connections, also using supabase (it seems great)
//
import postgres from "postgres";
import { SUPABASE_URI } from "$env/static/private";

if ( !SUPABASE_URI ) {
  console.log(`Error, missing connection string!`);
  throw new Error(`Missing connection string!!`);
}

const connectionString = SUPABASE_URI;

const sql = postgres(connectionString);

export default sql;
