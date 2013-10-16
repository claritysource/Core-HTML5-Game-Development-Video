var AnimatorBehavior = function (cells, duration, trigger, callback) {
   this.cells = cells;
   this.duration = duration || 1000;
   this.callback = callback;
   this.trigger = trigger;
};

AnimatorBehavior.prototype = {
   start: function (sprite, now) {
      sprite.originalCells = sprite.artist.cells;
      sprite.originalIndex = sprite.artist.cellIndex;

      sprite.animationStartTime = now;

      sprite.artist.cells = this.cells;
      sprite.artist.cellIndex = 0;
   },

   end: function (sprite, now) {
      sprite.artist.cells = sprite.originalCells;
      sprite.artist.cellIndex = sprite.originalIndex;
  
      if (this.callback) {
         this.callback(sprite, this);
      }
   },

   execute: function(sprite, now, fps, lastAnimationFrameTime) {
      if (this.trigger && 
          !this.trigger(sprite, now, fps, lastAnimationFrameTime)) {
         return;
      }
      
      if (sprite.artist.cells !== this.cells) {
         this.start(sprite, now);
      }
      else if (now - sprite.animationStartTime > this.duration) {
         this.end(sprite, now);
      }
   }
};