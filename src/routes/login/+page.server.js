import { fail, redirect } from "@sveltejs/kit";
import * as argon2 from "argon2";
import sql from "$lib/utils/db";
import { request } from "http";


/** @type {import('./$types').Actions} */
export const actions = {
  login : async ({ request, cookies }) => {
    console.log(`Hey this func just started`)
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if ( !email || !password ) {
      return fail(400, {error: "Email and password are required"});
    }

    try {
      const user = await sql`SELECT * FROM users WHERE email=${email}`

      if ( user && await argon2.verify(password, user.password) ) {
        cookies.set('session', 'user_id', {path: "/", httpOnly: true});
        throw redirect(303, "/dashboard");
      }
      else {
        return fail(400, {error: "Incorrect email or password"})
      }
    }
    catch ( err ) {
      console.log(`Error occured when logging in: ${err}`);
      return fail(500, {error: "Internal server error"})
    }
  }
}
