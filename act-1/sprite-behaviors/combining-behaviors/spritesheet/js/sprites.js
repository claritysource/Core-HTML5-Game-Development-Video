// Sprite Artists............................................................

// Artists draw sprites with a draw(sprite, context) method.

SpriteSheetArtist = function (spritesheet, cells) {
   this.cells = cells;
   this.spritesheet = spritesheet;
   this.cellIndex = 0;
};

SpriteSheetArtist.prototype = {
   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
   
   draw: function (sprite, context) {
      var cell = this.cells[this.cellIndex];

      context.drawImage(this.spritesheet, cell.left, cell.top,
                                          cell.width, cell.height,
                                          sprite.left, sprite.top,
                                          cell.width, cell.height);
   }
};

// Sprites....................................................................

// Sprites have a type, an artist, and an array of behaviors. Sprites can
// be updated and drawn.
//
// A sprite's artist draws the sprite: draw(sprite, context)
// A sprite's behavior executes: execute(sprite, time, fps)

var Sprite = function (type, artist, behaviors) {
   this.artist = artist;
   this.type = type || '';
   this.behaviors = behaviors || [];

   this.offset = 0;
   this.left = 0;
   this.top = 0;
   this.width = 10;
   this.height = 10;
   this.velocityX = 0;
   this.velocityY = 0;
   this.opacity = 1.0;
   this.visible = true;
   this.drawCollisionRectangle = false;

   this.collisionMargin = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
   };

   return this;
};

Sprite.prototype = {
   draw: function (context) {
      var r;
      
      context.save();

      context.globalAlpha = this.opacity;
      
      if (this.artist && this.visible) {
         this.artist.draw(this, context);
      }
 
      if (this.drawCollisionRectangle) {
         r = this.calculateCollisionRectangle();

         context.save();
         context.beginPath();
         context.strokeStyle = 'white';
         context.lineWidth = 2.0;
         context.rect(r.left + this.offset, r.top, 
                            r.right - r.left, r.bottom - r.top);
         context.stroke();
         context.restore();
       }

      context.restore();
    },

   update: function (time, fps, context, lastAnimationFrameTime) {
      for (var i = 0; i < this.behaviors.length; ++i) {
         if (this.behaviors[i] === undefined) { // Modified while looping?
            return;
         }

         this.behaviors[i].execute(this, 
                                   time, 
                                   fps, 
                                   context, 
                                   lastAnimationFrameTime);
      }
   },

   calculateCollisionRectangle: function () {
      return {
          left:    this.left - this.offset + this.collisionMargin.left,
          right:   this.left - this.offset + this.width - this.collisionMargin.right,
          top:     this.top + this.collisionMargin.top,
          bottom:  this.top + this.collisionMargin.top + 
                   this.height - this.collisionMargin.bottom,

          centerX: this.left + this.width/2,
          centerY: this.top + this.height/2
      }
   }
};
