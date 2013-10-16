// BounceBehavior: Bounces a sprite up and down, easing out on the way up
//                 and easing in on the way down.

BounceBehavior = function (riseTime, fallTime, distance) {
   this.riseTime = riseTime || 1000;
   this.fallTime = fallTime || 1000;
   this.distance = distance || 100;

   this.riseTimer = 
      new AnimationTimer(this.riseTime,
                         AnimationTimer.makeEaseOutTransducer(1.2));

   this.fallTimer =
      new AnimationTimer(this.fallTime,
                         AnimationTimer.makeEaseInTransducer(1.2));

   this.paused = false;
}

BounceBehavior.prototype = {
   pause: function(sprite, now) {
      if (!this.riseTimer.isPaused()) {
         this.riseTimer.pause(now);
      }

      if (!this.fallTimer.isPaused()) {
         this.fallTimer.pause(now);
      }

      this.paused = true;
   },

   unpause: function(sprite, now) {
      if (this.riseTimer.isPaused()) {
         this.riseTimer.unpause(now);
      }

      if (this.fallTimer.isPaused()) {
         this.fallTimer.unpause(now);
      }

      this.paused = false;
   },
   
   startRising: function (sprite, now) {
      this.baseline = sprite.top;
      this.bounceStart = sprite.top;

      this.riseTimer.start(now);
   },
      
   rise: function (sprite, now) {
      var elapsedTime = this.riseTimer.getElapsedTime(now);
      sprite.top = this.baseline - parseFloat(
                   (elapsedTime / this.riseTime) * this.distance);
   },

   finishRising: function (sprite, now) {
      this.riseTimer.stop(now);
      this.baseline = sprite.top;
      this.fallTimer.start(now);
   },
      
   isFalling: function () {
      return this.fallTimer.isRunning();
   },
      
   isRising: function () {
      return this.riseTimer.isRunning();
   },

   fall: function (sprite, now) {
      var elapsedTime = this.fallTimer.getElapsedTime(now);  
      sprite.top = this.baseline +
         parseFloat((elapsedTime / this.fallTime) * this.distance);
   },

   finishFalling: function (sprite, now) {
      this.fallTimer.stop(now);
      sprite.top = this.bounceStart;
      this.startRising(sprite, now);
   },
      
   execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
      // If nothing's happening, start rising and return

      if (this.paused || !this.isRising() && ! this.isFalling()) {
         this.startRising(sprite, now);
         return;
      }

      if(this.isRising()) {                 // Rising
         if(!this.riseTimer.isExpired(now)) {  // Not done rising
            this.rise(sprite, now);
         }
         else {                             // Done rising
            this.finishRising(sprite, now);
         }
      }
      else if(this.isFalling()) {           // Falling
         if(!this.fallTimer.isExpired(now)) {  // Not done falling
            this.fall(sprite, now);
         }
         else {                        
            this.finishFalling(sprite, now); // Done falling
         }
      }
   }
};
