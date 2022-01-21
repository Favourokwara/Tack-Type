class Timer {
   constructor () {
      this.timeln = {init: 0, start: 0, end: 0};
      this.paused = 0;
      this.isRunning = true;
   }

   now () {return Date.now() / 1000}

   toogle () {return this.isRunning ? this.start() : this.stop()}

   getTime () {return (this.isRunning ? this.timeln.end : this.now()) - this.timeln.init - this.paused}

   start () {
      const n = this.now();

      if (!this.timeln.init) Object.assign(this.timeln, {init: n, end: n})

      this.timeln.start = n;
      this.paused += this.timeln.start - this.timeln.end;
      this.isRunning = false;
   }

   stop () {
      this.timeln.end = this.now();
      this.isRunning = true;
   }

   reset () {
      Object.assign(this.timeln, {init: 0, start: 0, end: 0});
      this.isRunning = true;
      this.paused = 0;
   }
}

export default Timer;