import Database from "./database.js";

class Text {
   constructor() {
      this.elmnt = null;
   }

   /** Initialize the text playground. */
   async init () {
      const path = "./src/json/quote.json";

      await Database.fetchJson(path, data => {
         // store current quote in local storage
         Database.store("quotes", data);
         this.load(data);
      })
   }

   /** Loads a random quote to the playground. */
   load () {
      function random (min, max) {return Math.floor(Math.random() * (max - min) + min)}
      
      const content = new DocumentFragment();
      const quotes = JSON.parse(localStorage.getItem("quotes"))[random(0, 20)].quote

      quotes.split(/(?<=\s)/).forEach(quote => {
         content.append(
            this.toNode(`<span class="word">${quote.replace(/(.)/g, '<span class="letter">$1</span>')}</span>`)
         )
      })

      this.elmnt = content;
      this.render(document.querySelector(".text-cnt"))
   }

   /**
    * Renders the main element inside the provided parent.
    * @param {node} where The main element's parent node.
    */
   render (where) {
      where.innerHTML = "";
      where.append(this.elmnt);
   }

   /**
    * Returns a node version of the provided DOM string.
    * @param {string} string Dom string to be converted to object.
    */
   toNode (string) {
      const parnt = document.createElement("div");

      parnt.innerHTML = string;
      return parnt.firstChild;
   }
}

export { Text };