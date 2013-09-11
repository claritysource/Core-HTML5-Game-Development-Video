var SmokingHole = function (numSmokeBubbles, numFireParticles, 
                            left, top, width) {
   var smokeBubble
     , fireParticle
     , i
     , self = this;

   this.smokeBubbles = [];
   this.fireParticles = [];

   this.PALE_ORANGE = 'rgba(255,104,31,0.3)';
   this.PALE_YELLOW = 'rgba(255,255,0,0.3)';

   this.YELLOW = 'rgb(255,255,0)';
   this.BLACK = 'rgb(0,0,0)';
   this.WHITE = 'rgb(255,255,255)';

   this.MAX_DELAY = 6000; // max time between erruptions (milliseconds)

   for (i = 0; i < numSmokeBubbles; ++i) {
      smokeBubble = new SmokeBubble(left, top,
                                    Math.random() * 2,  // radius
                                    Math.random() * 8,  // velocityX
                                    Math.random() * 5); // velocityY

      if (i === 0) {
         smokeBubble.sprite.fillStyle = this.BLACK;
      }
      else if (i === 2 || i == 4) {
         smokeBubble.sprite.fillStyle = this.PALE_YELLOW;
      }
      else if (i === 1) {
         smokeBubble.sprite.fillStyle = this.PALE_ORANGE;
      }
      else if (i === 3) {
         smokeBubble.sprite.fillStyle = 'rgba(0,0,0,' + Math.random()+')';
      }
      else if (i === 5) {
         smokeBubble.sprite.fillStyle = this.WHITE;
      }
      if (i < 5) {
         smokeBubble.sprite.expandsSlowly = false;
         smokeBubble.sprite.radius = 2;
      }

      this.smokeBubbles.push(smokeBubble);
   }

   for (i = 0; i < numFireParticles; ++i) {
      if (i % 2 === 0) {
         fireParticle = new FireParticle(
                                   left + Math.random() * 2, 
                                   top - Math.random() * 2,
                                   Math.random() * 2, this.PALE_YELLOW);
      }
      else {
        fireParticle = new FireParticle(
                                   left + Math.random() * 2, 
                                   top - Math.random() * 2,
                                   Math.random() * 2, this.PALE_ORANGE);
      }
      
      this.fireParticles.push(fireParticle);
   }

   // The following attributes make the smoking hole look like a sprite
   
   this.type = 'smoking hole';

   this.top = top;
   this.left = left;
   this.width = width;

   this.behaviors = [];
   this.visible = true;

   // The smokeBubbleCursor is an index into the smokeBubble array

   this.smokeBubbleCursor = 1;
   this.eruptionTimer = new AnimationTimer(Math.random() * this.MAX_DELAY);
   this.eruptionTimer.start();
};

SmokingHole.prototype = {
   pause: function (now) {
      for (var i=0; i < this.smokeBubbles.length; ++i) {
         this.smokeBubbles[i].sprite.timer.pause(now);
      }
   },

   unpause: function (now) {
      for (var i=0; i < this.smokeBubbles.length; ++i) {
         this.smokeBubbles[i].sprite.timer.unpause(now);
      }
   },
   
   draw: function (context) {
      this.drawFire(context);
      this.drawSmoke(context);
   },
   
   drawFire: function (context) {
      for (var i = 0; i < this.fireParticles.length; ++i) {
         if (this.fireParticles[i].visible) {
            this.fireParticles[i].sprite.draw(context);
         }
      }
   },

   drawSmoke: function (context) {
      for (var i = 0; i < this.smokeBubbles.length; ++i) {
         if (this.smokeBubbles[i].visible) {
            this.smokeBubbles[i].sprite.draw(context);
         } 
      } 
   },

   update: function (now, fps, context, lastAnimationFrameTime) {
      var self = this;

      this.updateFireParticles(now, fps, context, lastAnimationFrameTime);
      this.updateSmokeBubbles(now, fps, context, lastAnimationFrameTime);

      // All bubbles are revealed when smokeBubbleCursor is zero

      if (this.smokeBubbleCursor !== 0 && 
          this.eruptionTimer.isExpired()) {
         this.revealSmokeBubble();
      }
   },

   updateFireParticles: function (now, fps, 
                                  context, lastAnimationFrameTime) {
      for (var i = 0; i < this.fireParticles.length; ++i) {
         if (this.fireParticles[i].visible) {
            this.fireParticles[i].sprite.update(now, fps, 
                                       context, lastAnimationFrameTime);
         }
      }    
   },
   
   updateSmokeBubbles: function (now, fps, context, 
                                 lastAnimationFrameTime) {
      for (var i = 0; i < this.smokeBubbles.length; ++i) {
         if (this.smokeBubbles[i].visible) {
            this.smokeBubbles[i].sprite.update(now, fps, 
                                       context, lastAnimationFrameTime);
         }
      }    
   },
   
   revealSmokeBubble: function () {
      var bubble;
      bubble = this.smokeBubbles[this.smokeBubbleCursor];
      bubble.visible = true;
      bubble.sprite.opacity = 1.0;

      this.advanceCursor();
   },

   advanceCursor: function () {
      if (this.smokeBubbleCursor < this.smokeBubbles.length - 1) {
         ++this.smokeBubbleCursor;
      }
      else {
         this.smokeBubbleCursor = 0;
      }
   },
};
