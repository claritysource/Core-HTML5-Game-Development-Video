// AnimationTimer..................................................................
//
// An animation runs for a duration, in milliseconds. It's up to you,
// however, to start and stop the animation -- animation timers do not stop
// automatically. You can check to see if an animation timer is over with the
// isExpired() method, and you can see if an animation is running with
// isRunning(). Note that animations can be over, but still running.
//
// You can also supply an optional timeWarp function that warps the percent
// completed for the animation. That warping lets you do easily incorporate
// non-linear motion, such as: ease-in, ease-out, elastic, etc.

AnimationTimer = function (duration, timeWarp)  {
   if (duration !== undefined) this.duration = duration;
   else                        this.duration = 1000;

   if (timeWarp !== undefined) 
      this.timeWarp = timeWarp;
   else                        
      this.timeWarp = AnimationTimer.makeLinearTransducer();
   
   this.stopwatch = new Stopwatch();
};

AnimationTimer.prototype = {
   start: function (now) {
      this.stopwatch.start(now);
   },

   stop: function (now) {
      this.stopwatch.stop(now);
   },

   pause: function (now) {
      this.stopwatch.pause(now);
   },

   unpause: function (now) {
      this.stopwatch.unpause(now);
   },

   isPaused: function () {
      return this.stopwatch.isPaused();
   },

   getRealElapsedTime: function (now) {
      return this.stopwatch.getElapsedTime(now);
   },
   
   getElapsedTime: function (now) {
      var elapsedTime = this.stopwatch.getElapsedTime(now),
          percentComplete = elapsedTime / this.duration;

      if (this.timeWarp == undefined || percentComplete === 0 ||
          percentComplete > 1) {
         return elapsedTime;
      }

      return elapsedTime * 
             (this.timeWarp(percentComplete) / percentComplete);
   },

   isRunning: function(now) {
      return this.stopwatch.running;
   },
   
   isExpired: function (now) {
      return this.stopwatch.getElapsedTime(now) > this.duration;
   },

   reset: function(now) {
      this.stopwatch.reset(now);
   }
};

AnimationTimer.makeEaseOutTransducer = function (strength) {
   return function (percentComplete) {
      return 1 - Math.pow(1 - percentComplete, strength*2);
   };
};

AnimationTimer.makeEaseInTransducer = function (strength) {
   return function (percentComplete) {
      return Math.pow(percentComplete, strength*2);
   };
};

AnimationTimer.makeEaseInOutTransducer = function () {
   return function (percentComplete) {
      return percentComplete - 
             Math.sin(percentComplete*2*Math.PI) / (2*Math.PI);
   };
};

AnimationTimer.makeElasticTransducer = function (passes) {
   passes = passes || 3;
   return function (percentComplete) {
       return ((1-Math.cos(percentComplete * Math.PI * passes)) *
               (1 - percentComplete)) + percentComplete;
   };
};

AnimationTimer.makeBounceTransducer = function (bounces) {
   var fn = AnimationTimer.makeElastic(bounces);
   return function (percentComplete) {
      percentComplete = fn(percentComplete);
      return percentComplete <= 1 ? 
                 percentComplete : 2-percentComplete;
   }; 
};

AnimationTimer.makeLinearTransducer = function () {
   return function (percentComplete) {
      return percentComplete;
   };
};
