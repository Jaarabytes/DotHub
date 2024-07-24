import sql from "$lib/utils/db";
import { fail, redirect } from "@sveltejs/kit";
import * as argon2 from "argon2";

export const actions = {
  default : async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

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
