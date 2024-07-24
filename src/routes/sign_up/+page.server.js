import { fail, redirect } from "@sveltejs/kit";
import * as argon2 from 'argon2'
import sql from "$lib/utils/db";

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');


    if ( !email || !password ) {
      return fail(401, {error: "Missing email or password"})
    }
    try {
      const user = await sql`SELECT * FROM users WHERE email=${email}`;

      if ( user ) {
        return fail(401, {error: "User already exists!"})
      }

      const hashedPassword = await argon2.hash(password );
      await sql`INSERT INTO users (email, hashedPassword)
      VALUES (${email }, ${hashedPassword})
      `

      cookies.set('session', 'user_id', {path: "/", httpOnly: true});
      throw redirect(303, "/dashboard");
    }
    catch ( err ) {
      console.log(`Error when signing up: ${err}`)
      return fail(500, {error: "Internal server error"})
    }
  } 
}
