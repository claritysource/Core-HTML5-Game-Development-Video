var SmokeBubble = function (left, top, radius, 
                            velocityX, velocityY, lifetime) {
   var DEFAULT_BUBBLE_LIFETIME = 8000,
       BUBBLE_EXPANSION_RATE = 10,
       BUBBLE_SLOW_EXPANSION_RATE = 6,
       BUBBLE_X_SPEED_FACTOR = 12,
       BUBBLE_Y_SPEED_FACTOR = 8,

       FULLY_OPAQUE = 1.0,
       TWO_PI = Math.PI * 2,
       
       r = 200 + Math.random()*55,
       g = r,
       b = r;

       self = this;

   this.lifetime = lifetime ? lifetime : DEFAULT_BUBBLE_LIFETIME;
   
   this.sprite = new Sprite(
      // Type.......................................................

      'smoke bubble',

      // Artist.....................................................

      {
         draw: function (sprite, context) {
            if (sprite.radius > 0) {
               context.save();
               context.beginPath();

               context.fillStyle = sprite.fillStyle;
               context.arc(sprite.left, sprite.top,
                           sprite.radius, 0, TWO_PI, false);

               context.fill();
               context.restore();
            }
         }
      },

      // Behaviors..................................................

      [{
         execute: function (sprite, now, fps, context, 
                            lastAnimationFrameTime) {
            if (sprite.visible) {
               if ( ! sprite.timer.isRunning()) {
                  this.startTimer(sprite, now);
               }
               else if ( ! sprite.timer.isExpired(now)) {
                  this.blowBubble(sprite, now, 
                                  fps, lastAnimationFrameTime); 
               }
               else { // timer is expired
                  this.resetBubble(sprite, now);
               }
            }
         },

         startTimer: function (sprite, now) {
            sprite.timer.start(now);
            sprite.opacity = FULLY_OPAQUE;
         },
         
         // blowBubble: Moves and expands the smoke bubble over time
            
         blowBubble: function (sprite, now, fps, 
                               lastAnimationFrameTime) {
            var et = sprite.timer.getElapsedTime(now),
                velocityFactor = (now - lastAnimationFrameTime) / 1000;

            sprite.left += sprite.velocityX * velocityFactor;
            sprite.top -= sprite.velocityY * velocityFactor;

            sprite.opacity = FULLY_OPAQUE - et / sprite.timer.duration;

            if (sprite.expandsSlowly) {
               sprite.radius += 
                  BUBBLE_SLOW_EXPANSION_RATE * velocityFactor;
            }
            else {
               sprite.radius += BUBBLE_EXPANSION_RATE * velocityFactor;
            }
         },

         resetBubble: function (sprite, now) {
            sprite.timer.stop(now);
            sprite.timer.reset();
   
            sprite.left = sprite.originalLeft;
            sprite.top = sprite.originalTop;
            sprite.radius = sprite.originalRadius;
   
            sprite.velocityX = Math.random() * BUBBLE_X_SPEED_FACTOR;
            sprite.velocityY = Math.random() * BUBBLE_Y_SPEED_FACTOR;
   
            sprite.opacity = 0;
         },
      }]
   );

   this.sprite.opacity = FULLY_OPAQUE;

   this.sprite.fillStyle = 'rgb(' + r.toFixed(0) + ',' +
                                    g.toFixed(0) + ',' + 
                                    b.toFixed(0) + ')';
   this.sprite.left = left;
   this.sprite.top = top;
   this.sprite.radius = radius;

   this.sprite.originalLeft = left;
   this.sprite.originalTop = top;
   this.sprite.originalRadius = radius;

   this.sprite.velocityX = velocityX;
   this.sprite.velocityY = velocityY;

   this.sprite.timer = 
      new AnimationTimer(this.lifetime,
                         AnimationTimer.makeEaseOutTransducer(1));
};

SmokeBubble.prototype = {
   update: function (now, fps, context, lastAnimationFrameTime) {
      this.sprite.update(now, fps, context, lastAnimationFrameTime);
   },

   draw: function (context) {
      this.sprite.draw(context);
   }
};
