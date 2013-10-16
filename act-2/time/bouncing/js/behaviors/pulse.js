// PULSE: This behavior modifies the brightness of a sprite so that it
//        appears to pulsate. The time parameter that you pass to 
//        the constructor represents the amount of time it takes
//        for a sprite to brighten or dim. A complete pulse, therefore
//        has a duration of 2*time. The opacityThreshold represents
//        the lowest value for the opacity as it dims.

PulseBehavior = function (time, opacityThreshold) {
   this.time = time || 1000;
   this.opacityThreshold = opacityThreshold || 0;
   this.PAUSE_BETWEEN_DIM_AND_BRIGHT = 100; // milliseconds

   this.brightTimer = 
      new AnimationTimer(this.time, 
                         AnimationTimer.makeEaseInTransducer(1));

   this.dimTimer = 
      new AnimationTimer(this.time, 
                         AnimationTimer.makeEaseOutTransducer(1));
},

PulseBehavior.prototype = {
   isDimming: function () {
      return this.dimTimer.isRunning();
   },

   startDimming: function (sprite) {
      this.dimTimer.start();
   },
      
   dim: function (sprite) {
      elapsedTime = this.dimTimer.getElapsedTime();  
      sprite.opacity = 1 - ((1 - this.opacityThreshold) *
                            (parseFloat(elapsedTime) / this.time));
   },

   finishDimming: function (sprite) {
      var self = this;
      this.dimTimer.stop();

      setTimeout( function (e) {
         self.brightTimer.start();
      }, this.PAUSE_BETWEEN_DIM_AND_BRIGHT);
   },
      
   isBrightening: function () {
      return this.brightTimer.isRunning();
   },

   brighten: function (sprite) {
      elapsedTime = this.brightTimer.getElapsedTime();  
      sprite.opacity += (1 - this.opacityThreshold) *
                         parseFloat(elapsedTime) / this.time;
   },

   finishBrightening: function (sprite) {
      this.brightTimer.stop();
      this.dimTimer.start();
   },

   execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
      var elapsedTime;

      // If nothing's happening, start dimming and return

      if (!this.isDimming() && !this.isBrightening()) {
         this.startDimming(sprite);
         return;
      }

      if(this.isDimming()) {              // Dimming
         if(!this.dimTimer.isExpired()) { // Not done dimming
            this.dim(sprite);
         }
         else {                              
            this.finishDimming(sprite); // Done dimming
         }
      }
      else if(this.isBrightening()) {         // Brightening
         if(!this.brightTimer.isExpired()) {  // Not done brightening
            this.brighten(sprite);
         }
         else {                            
            this.finishBrightening(sprite); // Done brightening
         }
      }
   }
};
