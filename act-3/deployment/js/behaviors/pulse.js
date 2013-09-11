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
   pause: function(sprite, now) {
      if (!this.dimTimer.isPaused()) {
         this.dimTimer.pause(now);
      }

      if (!this.brightTimer.isPaused()) {
         this.brightTimer.pause(now);
      }

      this.paused = true;
   },
   
   unpause: function(sprite, now) {
      if (this.dimTimer.isPaused()) {
         this.dimTimer.unpause(now);
      }

      if (this.brightTimer.isPaused()) {
         this.brightTimer.unpause(now);
      }

      this.paused = false;
   },

   isDimming: function () {
      return this.dimTimer.isRunning();
   },

   startDimming: function (sprite, now) {
      this.dimTimer.start(now);
   },
      
   dim: function (sprite, now) {
      elapsedTime = this.dimTimer.getElapsedTime(now);  
      sprite.opacity = 1 - ((1 - this.opacityThreshold) *
                            (parseFloat(elapsedTime) / this.time));
   },

   finishDimming: function (sprite, now) {
      var self = this;
      this.dimTimer.stop(now);

      setTimeout( function (e) {
         self.brightTimer.start(now);
      }, this.PAUSE_BETWEEN_DIM_AND_BRIGHT);
   },
      
   isBrightening: function () {
      return this.brightTimer.isRunning();
   },

   brighten: function (sprite, now) {
      elapsedTime = this.brightTimer.getElapsedTime(now);  
      sprite.opacity += (1 - this.opacityThreshold) *
                         parseFloat(elapsedTime) / this.time;
   },

   finishBrightening: function (sprite, now) {
      this.brightTimer.stop(now);
      this.dimTimer.start(now);
   },

   execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
      var elapsedTime;

      // If nothing's happening, start dimming and return

      if (!this.isDimming() && !this.isBrightening()) {
         this.startDimming(sprite, now);
         return;
      }

      if(this.isDimming()) {              // Dimming
         if(!this.dimTimer.isExpired(now)) { // Not done dimming
            this.dim(sprite, now);
         }
         else {                              
            this.finishDimming(sprite, now); // Done dimming
         }
      }
      else if(this.isBrightening()) {         // Brightening
         if(!this.brightTimer.isExpired(now)) {  // Not done brightening
            this.brighten(sprite, now);
         }
         else {                            
            this.finishBrightening(sprite, now); // Done brightening
         }
      }
   }
};
