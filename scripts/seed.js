import postgres from "postgres";
import * as argon2 from "argon2";


const sql = postgres(process.env.SUPABASE_URI);

// Honestly, who doesn't love procastinating stuff

async function seedUsers ( ) {
  try {
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'free' CHECK (status in ('free', 'family', 'premium'))
    )
    `
    if ( createTable.command === "CREATE TABLE" ) {
      console.log(`Successfully created the Users table`)
    }
    else {
      console.log(`Error creating the users table`)
    }
    const users = [
      {email: "johndoe@gmail.com", password: "123456"},
      {email: "user@nextmail.com", password: "8765321"},
      {email: "trafalgar@arch.linux", password: "iusearchbtw"},
    ]

    for ( const user of users ) {
      const hashedPassword = await argon2.hash(user.password)
      await sql`INSERT INTO users (email, password) VALUES (${user.email}, ${hashedPassword}) ON CONFLICT (email) DO NOTHING RETURNING id`
    }
    // yes, i will hash them later
    console.log(`Successfully seeded the Users table`)
    const rows  = await sql`SELECT * FROM users`
    if ( rows.length === 0 ) {
      console.log(`User doesn't exist bozo!`)
    }
    else {
      console.log(`ROLL CALL FOR ALL USERS:`)
        for ( const user of rows ) {
          console.log(`User's email ${user.email} of id ${user.id} has a password of ${user.password}`)
        }
      console.log(`Roll Call complete`)
    }
    
  }
  catch (err) {
    console.log(`Error occured in the seedUsers function: ${err}`)
  }
}

async function seedTasks ( ) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      deleted_at TIMESTAMP
    )
    `
    if ( createTable.command === "CREATE TABLE" ) {
      console.log(`Successfully created the tasks table`);
    }
    else {
      console.log(`Error when creating the Tasks table`);
    }

     await sql`
      INSERT INTO tasks (task, user_id) VALUES 
      ('Rice my linux desktop', 2), 
      ('Say hi to grandma', 1),
      ('Attend an X Space', 3), 
      ('Create an app using supabase', 1) 
    `
    console.log(`Successfully seeded tasks into the database`)
  }
  catch ( err ) {
    console.log(`Error when seeding tasks: ${err}`);
  }
}

async function main () {
  await seedUsers()
  await seedTasks()
}

main().catch((err) => {
  console.log(`Error occured at the main function: ${err}`)
})
