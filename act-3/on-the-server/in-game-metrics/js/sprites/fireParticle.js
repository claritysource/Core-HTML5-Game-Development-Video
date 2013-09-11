var FireParticle = function (left, top, radius) {
   var FLICKER_INTERVAL = 200,
       YELLOW_PREAMBLE = 'rgba(255,255,0,';

    this.sprite = new Sprite('fire particle', // type
       { // Artist
          draw: function (sprite, context) {
             context.save();

             context.fillStyle = sprite.fillStyle;
             context.globalAlpha = Math.random();
             
             context.beginPath();
             context.arc(sprite.left, sprite.top,
                         sprite.radius*1.5, 0, Math.PI*2, false);
             context.fill();

             context.restore();
          }
       }
   );

   this.sprite.left = left;
   this.sprite.top = top;
   this.sprite.radius = radius;

   this.sprite.velocityX = 0;
   this.sprite.velocityY = 0;

   this.sprite.fillStyle = YELLOW_PREAMBLE + Math.random() + ');';
   this.visible = true;
};

