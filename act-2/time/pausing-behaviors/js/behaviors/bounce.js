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
   pause: function(sprite) {
      if (!this.riseTimer.isPaused()) {
         this.riseTimer.pause();
      }

      if (!this.fallTimer.isPaused()) {
         this.fallTimer.pause();
      }

      this.paused = true;
   },

   unpause: function(sprite) {
      if (this.riseTimer.isPaused()) {
         this.riseTimer.unpause();
      }

      if (this.fallTimer.isPaused()) {
         this.fallTimer.unpause();
      }

      this.paused = false;
   },
   
   startRising: function (sprite) {
      this.baseline = sprite.top;
      this.bounceStart = sprite.top;

      this.riseTimer.start();
   },
      
   rise: function (sprite) {
      var elapsedTime = this.riseTimer.getElapsedTime();
      sprite.top = this.baseline - parseFloat(
                   (elapsedTime / this.riseTime) * this.distance);
   },

   finishRising: function (sprite) {
      this.riseTimer.stop();
      this.baseline = sprite.top;
      this.fallTimer.start();
   },
      
   isFalling: function () {
      return this.fallTimer.isRunning();
   },
      
   isRising: function () {
      return this.riseTimer.isRunning();
   },

   fall: function (sprite) {
      var elapsedTime = this.fallTimer.getElapsedTime();  
      sprite.top = this.baseline +
         parseFloat((elapsedTime / this.fallTime) * this.distance);
   },

   finishFalling: function (sprite) {
      this.fallTimer.stop();
      sprite.top = this.bounceStart;
      this.startRising(sprite);
   },
      
   execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
      // If nothing's happening, start rising and return

      if (this.paused || !this.isRising() && ! this.isFalling()) {
         this.startRising(sprite);
         return;
      }

      if(this.isRising()) {                 // Rising
         if(!this.riseTimer.isExpired()) {  // Not done rising
            this.rise(sprite);
         }
         else {                             // Done rising
            this.finishRising(sprite);
         }
      }
      else if(this.isFalling()) {           // Falling
         if(!this.fallTimer.isExpired()) {  // Not done falling
            this.fall(sprite);
         }
         else {                        
            this.finishFalling(sprite); // Done falling
         }
      }
   }
};
