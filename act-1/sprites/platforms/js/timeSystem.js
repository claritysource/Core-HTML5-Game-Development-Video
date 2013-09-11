// A simple time system that uses an animation timer to calculate
// the current game time.

var TimeSystem = function () {
   this.transducer = undefined;
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
   },
   
   setTransducer: function (fn, duration) {
      // duration is optional. If you specify it, the transducer is applied for
      // the specified duration; after the duration ends, the permanent transducer
      // is restored. If you do not specify it, the transducer permanently
      // replaces the current transducer.

      var lastTransducer = this.transducer,
          self = this;

      if (lastTransducer) {
         this.lastTimepost = this.calculateGameTime();
      }
      else {
         this.lastTimepost = 0;
      }

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
      
      return this.gameTime;
   }
};
