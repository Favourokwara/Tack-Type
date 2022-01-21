class Database {
   /**
    * Get Json file from the given path
    * @param {string} path The JSON file path.
    * @param {function} callbackfn Function handles the retrieved data. 
    */
   static async fetchJson(path, callbackfn) {
      try {
         const database = await fetch(path);
         const data = await database.json();
         callbackfn(data)
      } catch (error) {
         console.error(error);
      }
   }

   /**
    * Stores the json data inside localstorage
    * @param {string} key The key to retrieve the json data
    * @param {json} value The Json object you want to store
    */
   static store(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
   }
}

export default Database;