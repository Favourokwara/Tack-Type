import Timer from "./timer.js";

class Typing {
   constructor () {
      // state tracking
      this.typing = false;
      this.began = false;
      
      this.timer = (new Timer ())
      this.typed = "";

      this.audio = {
         channels: [
            new Audio(), new Audio(), new Audio(), new Audio()
         ],
         speaker: 0,
      };
   }

   text() {return document.querySelector(".text-cnt").textContent}

   keyPress = (event) => {
      try {
         if (!this.typing){
            this
               .updateTyped(event)
               .validate(event)
               .updateCursor();
               
            this
               .displace()
               .progress();
         }
      } catch (error) {
         console.error(error);
         this.began = false;
         this.timer.stop();
         this.updateMetrics()
      }
   }

   updateTyped (event) {
      const key = event.key;

      // single key press
      if (key.length == 1) this.typed += key;
      else if (key == "Backspace") {
         // check if you've started typing
         if (this.typed) {
            const words = this.getWords();

            // "ctrl" + "backspace" removes a single word.
            if (event.ctrlKey) this.typed = words.splice(0, words.length - 1).join("");

            // clear whitespace characters
            this.typed = this.typed.substring(0, this.typed.length - 1)
         }
      }
      return this
   }

   getText () {
      return {
         words: document.getElementsByClassName("word"), 
         letters: document.getElementsByClassName("letter"),
         cursor: document.querySelector(".cursor"),
         quote : document.querySelector(".text-cnt").textContent,
      }
   }

   getWords () {
      const typed = [...this.typed];
      const quote = this.getText().quote.split(/(?<=\s)/);
      const words = [];

      for (let i = 0; typed.length; i++) {
         words.push(typed.splice(0, quote[i].length).join(''))
      }
      return words
   }

   updateCursor () {
      const {cursor, letters} = this.getText()

      // remove old cursor
      if (cursor) cursor.classList.remove("cursor")

      // highlight new cursor
      letters[this.typed.length].classList.add("cursor")
      
      return this
   }

   validate (event) {
      const {cursor, letters, quote} = this.getText()

      const wasWrong = cursor.classList.contains("wrong") || cursor.classList.contains("altrd");
      const key = event.key

      if (key.length == 1) {
         // update state when typing starts
         if (!this.began) {
            this.began = true;
            this.timer.start()
         }
         
         // apppend validation class
         cursor.className = `letter ${quote[this.typed.length - 1] != key ? "wrong" : wasWrong ? "altrd" : "right"}`
      }else if (key == "Backspace") {
         const ltr = [...letters];

         // validate last character
         ltr.splice(0, this.typed.length)
         ltr.filter(char => char.className != "letter").forEach(char => char.classList.add("backed"))
      }
      
      if (this.typed) {
         const cap = document.querySelector('.cap')
         if (cap) cap.classList.remove('cap')

         letters[this.typed.length < 1? 0 : this.typed.length - 1].classList.add('cap')
      }

      this.playAudio(event)
      return this
   }

   displace () {
      const {cursor, letters} = this.getText();
      const playground = document.querySelector(".text-cnt");
      const difference = (letters[0].getBoundingClientRect().top - cursor.getBoundingClientRect().top);

      playground.style.transform = `translateY(${difference}px)`;
      return this
   }

   playAudio (event) {
      const { quote } = this.getText();
      const key = event.key;

      if (key == "Backspace" || key.length == 1) {
         if (this.audio.speaker > 3) this.audio.speaker = 0;

         const chnl = this.audio.channels[this.audio.speaker]
         chnl.load()
         chnl.src = `./resources/aud/${key != quote[this.typed.length - 1] ? "error" : "typewriter"}.mp3`;
         chnl.play()

         this.audio.speaker++;
      }
   }

   /**
    * Get the "Gross" or "Net" words per minute of a typed entry.
    * @param {object} param Object containing number of entries, seconds and errors.
    */
    wpm ({entries, seconds, errors}) {
      const equation = (((entries / 5) - (errors || 0)) / ((seconds || 1) / 60))

      return Math.round(Math.max(0, equation) * 100) / 100
   }

   /**
    * Get the typing accuracy percentage (%).
    * @param {object} param Object containing number of entries, seconds and errors.
    */
   accuracy ({entries, seconds, errors}) {
      entries = (entries <= 5) ? (5 + (entries / 6)) : entries;
      return Math.round((this.wpm({entries, seconds, errors}) / this.wpm({entries, seconds})) * 100)
   }

   /**
    * Returns the number of words that have been typed wrong.
    * @returns {init}
    */
    mistyped () {
      const typed = this.getWords();
      const words = this.getText().quote.split(/(?<=\s)/);

      let n = 0

      for (let i = 0; i < typed.length; i++) {
         try {
            if (!new RegExp(`^${typed[i]}`).test(words[i])) n++
         }catch (error) { n++ }
      }

      return n
   }

   progress () {
      const prg_bar = document.querySelector(".prg-lft")
      prg_bar.style.width = `${(this.typed.length / this.getText().quote.length) * 100}%`;
      return this
   }

   updateMetrics() {
      const wpm = document.querySelector(".wpm-dgt");
      const acc = document.querySelector(".accur-dgt");

      const n = {entries: this.typed.length, seconds: Math.floor(this.timer.getTime()),  errors: this.mistyped()}

      wpm.textContent = `${this.wpm(n)}°`;
      acc.textContent = `${this.accuracy(n)}%`;
   }

   metricsInterval() {
      setInterval(() => {
         if (this.began && !this.typing) this.updateMetrics()
      }, 1000)
   }

   toggleTyping () {
      if (this.began) {
         this.timer.toogle();
         this.typing = !this.typing;
         document.querySelector(".pause-icn").classList.toggle("--play")
      }
   }
   
   reset () {
      Object.assign(this, {typed: "", began: false, typing: false});
      this.timer.reset()

      this
         .updateCursor()
         .displace()
         .progress()
         .updateMetrics()
      
      document.querySelector(".pause-icn").classList.toggle("--play")
   }
}

export { Typing };