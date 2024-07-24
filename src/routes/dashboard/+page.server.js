import axios from "axios";
import sql from "$lib/utils/db";

export const actions =  {
  default: async ({ request }) => {

  try {
    const randomJoke = (await axios.get('https://official-joke-api.appspot.com/random_joke')).data;
    return {
      joke: randomJoke.setup,
      punchline: randomJoke.punchline
  }
  }
    catch ( err ) {
    const ronSwansonQuote = (await axios.get('http://ron-swanson-quotes.herokuapp.com/v2/quotes')).data;
    console.log(`Error fetching random joke: ${err}`)
      return {
        joke: ronSwansonQuote
      }
    }
  },

  delete: async ({ request }) => {
    try {
      await sql``
      console.log(`Task succesfully deleted`)
    }
    catch ( err ) {
      console.log(`Error when deleting task: ${err}`);
    }
  },

  insert: async ({ request }) => {
    try {
      await sql``
      console.log(`Succesfully added a new task`);
    }
    catch ( err ) {
      console.log(`Error when adding new task: ${err}`)
    }
  }
}
