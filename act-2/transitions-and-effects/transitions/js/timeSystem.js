var TimeSystem = function () {
   this.transducer = function (elapsedTime) { return elapsedTime; };
   this.timer = new AnimationTimer();
   this.lastTimepost = 0;
   this.gameTime = 0;
}

TimeSystem.prototype = {
   start: function () {
      this.timer.start();
   },

   reset: function () {
      this.timer.stop();
      this.timer.reset();
      this.timer.start();
      this.lastTimepost = this.gameTime;
   },
   
   setTransducer: function (fn, duration) {
      // duration is optional. If you specify it, the transducer is applied for
      // the specified duration; after the duration ends, the permanent transducer
      // is restored. If you do not specify it, the transducer permanently
      // replaces the current transducer.

      var lastTransducer = this.transducer,
          self = this;

      this.reset();
      this.transducer = fn;

      if (duration) {
         setTimeout( function (e) {
            self.setTransducer(lastTransducer);
         }, duration);
      }
   },
   
   calculateGameTime: function () {
      var elapsed = this.timer.getElapsedTime();

      if (this.transducer) {
         elapsed = this.transducer(elapsed);
      }

      this.gameTime = this.lastTimepost + elapsed;
      this.reset();
      
      return this.gameTime;
   }
};
