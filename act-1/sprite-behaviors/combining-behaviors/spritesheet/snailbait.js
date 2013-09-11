// SnailBait constructor --------------------------------------------

var SnailBait =  function () {

   this.canvas = document.getElementById('game-canvas');
   this.context = this.canvas.getContext('2d');

   // HTML elements........................................................
   
   this.fpsElement = document.getElementById('fps');
   this.toast = document.getElementById('toast');

   // Canvas and background dimensions.....................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;
   
   this.LEFT = 1;
   this.RIGHT = 2;

   this.BACKGROUND_VELOCITY = 42;

   this.PAUSED_CHECK_INTERVAL = 200;

   this.PLATFORM_HEIGHT = 8;  
   this.PLATFORM_STROKE_WIDTH = 2;
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)';

   this.STARTING_RUNNER_LEFT = 50;
   this.STARTING_RUNNER_TRACK = 1;

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323;
   this.TRACK_2_BASELINE = 223;
   this.TRACK_3_BASELINE = 123;
   
   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35;

   this.STARTING_BACKGROUND_VELOCITY = 0;

   this.STARTING_PLATFORM_OFFSET = 0;
   this.STARTING_BACKGROUND_OFFSET = 0;

   // Images............................................................
   
   this.spritesheet = new Image();

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0;
   this.lastFpsUpdateTime = 0;
   this.fps = 60;

   // Window has focus..................................................

   this.windowHasFocus = true;

   // Paused............................................................

   this.paused = false;

   // Fps indicator.....................................................
   
   this.fpsElement = document.getElementById('fps');

   // Runner track......................................................

   this.runnerTrack = this.STARTING_RUNNER_TRACK;
   
   // Translation offsets...............................................
   
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET;
   this.spriteOffset = this.STARTING_PLATFORM_OFFSET;

   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY;
   this.platformVelocity;

   // Platforms.........................................................

   this.platformData = [
      // Screen 1.......................................................
      {
         left:      10,
         width:     230,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      250,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      633,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 2.......................................................
               
      {  left:      810,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         snail:     true
      },
   ];

   // Sprite artists...................................................

   this.platformArtist = {
      draw: function (sprite, context) {
         var top;
         
         context.save();

         top = snailBait.calculatePlatformTop(sprite.track);

         context.lineWidth = snailBait.PLATFORM_STROKE_WIDTH;
         context.strokeStyle = snailBait.PLATFORM_STROKE_STYLE;
         context.fillStyle = sprite.fillStyle;

         context.strokeRect(sprite.left, top, sprite.width, sprite.height);
         context.fillRect  (sprite.left, top, sprite.width, sprite.height);

         context.restore();
      }
   };

   // Sprites...........................................................
  
   this.bats         = [];
   this.bees         = []; 
   this.buttons      = [];
   this.coins        = [];
   this.platforms    = [];
   this.rubies       = [];
   this.sapphires    = [];
   this.smokingHoles = [];
   this.snails       = [];

   this.sprites = []; // For convenience, contains all of the sprites  
                      // from the preceding arrays
}

// SnailBait.prototype ----------------------------------------------------

SnailBait.prototype = {
   // Drawing..............................................................

   draw: function (now) {
      this.setPlatformVelocity();
      this.setOffsets();

      this.drawBackground();

      this.updateSprites(now);
      this.drawSprites();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * 
                              this.PLATFORM_VELOCITY_MULTIPLIER; 
   },

   setOffsets: function () {
      this.setBackgroundOffset();
      this.setSpriteOffsets();
   },

   setBackgroundOffset: function () {
      var offset = this.backgroundOffset + this.bgVelocity/this.fps;

      if (offset > 0 && offset < this.BACKGROUND_WIDTH) {
         this.backgroundOffset = offset;
      }
      else {
         this.backgroundOffset = 0;
      }
   },

   setSpriteOffsets: function () {
      var i, sprite;
   
      this.spriteOffset += this.platformVelocity / this.fps; // In step with platforms

      for (i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if ('runner' !== sprite.type && 'smoking hole' !== sprite.type) {
            sprite.offset = this.spriteOffset; 
         }
         else if ('smoking hole' === sprite.type) {
            sprite.offset = this.backgroundOffset; // In step with background
         }          
      }
   },

   drawBackground: function () {
      var BACKGROUND_TOP_IN_SPRITESHEET = 590;

      this.context.translate(-this.backgroundOffset, 0);

      // Initially onscreen:
      this.context.drawImage(this.spritesheet, 0, BACKGROUND_TOP_IN_SPRITESHEET, 
                        this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT,
                        0, 0,
                        this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

      // Initially offscreen:
      this.context.drawImage(this.spritesheet, 0, BACKGROUND_TOP_IN_SPRITESHEET, 
                        this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT,
                        this.BACKGROUND_WIDTH, 0,
                        this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

      this.context.translate(this.backgroundOffset, 0);
   },

   updateSprites: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.isSpriteInView(sprite)) {
            sprite.update(now, this.fps, this.context, 
                          this.lastAnimationFrameTime);
         }
      }
   },

   drawSprites: function() {
      for (var i=0; i < this.sprites.length; ++i) {
         this.drawSprite(this.sprites[i]);
      }
   },

   drawSprite: function (sprite) {
      if (sprite.visible && this.isSpriteInView(sprite)) {
         this.context.translate(-sprite.offset, 0);         
         sprite.draw(this.context);
         this.context.translate(sprite.offset, 0);         
      }
   }, 

   calculateFps: function (now) {
      var fps = 1000 / (now - this.lastAnimationFrameTime);
      this.lastAnimationFrameTime = now;

      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
         this.fpsElement.innerHTML = fps.toFixed(0) + ' fps';
      }
      return fps; 
   },

   calculatePlatformTop: function (track) {
      var top;

      if      (track === 1) { top = this.TRACK_1_BASELINE; }
      else if (track === 2) { top = this.TRACK_2_BASELINE; }
      else if (track === 3) { top = this.TRACK_3_BASELINE; }

      return top;
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
   },
   
   // Animation............................................................

   animate: function (now) { 
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         snailBait.draw();
         requestNextAnimationFrame(snailBait.animate);         
      }
   },

   // Toast................................................................

   revealToast: function (text, howLong) {
      howLong = howLong || this.DEFAULT_TOAST_TIME;

      toast.style.display = 'block';
      toast.innerHTML = text;

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 1.0; // After toast is displayed
         }
      }, 50);

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 0; // Starts CSS3 transition
         }

         setTimeout( function (e) { 
            if (snailBait.windowHasFocus) {
               toast.style.display = 'none'; 
            }
         }, 2000);
      }, howLong);
   },

   // Pause................................................................

   togglePaused: function () {
      var now = +new Date();

      this.paused = !this.paused;
   
      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }
   },

   // ------------------------- SPRITE CREATION ---------------------------

   createSprites: function() {  
      this.createPlatformSprites();
      this.addSpritesToSpriteArray();

   },

   createPlatformSprites: function () {
      var sprite, pd;  // Sprite, Platform data
   
      for (var i=0; i < this.platformData.length; ++i) {
         pd = this.platformData[i];

         sprite  = new Sprite('platform', this.platformArtist);

         sprite.left      = pd.left;
         sprite.width     = pd.width;
         sprite.height    = pd.height;
         sprite.fillStyle = pd.fillStyle;
         sprite.opacity   = pd.opacity;
         sprite.track     = pd.track;
         sprite.button    = pd.button;
         sprite.pulsate   = pd.pulsate;

         sprite.top = this.calculatePlatformTop(pd.track);
   
         this.platforms.push(sprite);
      }
   },

   addSpritesToSpriteArray: function () {
      for (var i=0; i < this.platforms.length; ++i) {
         this.sprites.push(this.platforms[i]);
      }

      for (var i=0; i < this.bats.length; ++i) {
         this.sprites.push(this.bats[i]);
      }

      for (var i=0; i < this.bees.length; ++i) {
         this.sprites.push(this.bees[i]);
      }

      for (var i=0; i < this.buttons.length; ++i) {
         this.sprites.push(this.buttons[i]);
      }

      for (var i=0; i < this.coins.length; ++i) {
         this.sprites.push(this.coins[i]);
      }

      for (var i=0; i < this.rubies.length; ++i) {
         this.sprites.push(this.rubies[i]);
      }

      for (var i=0; i < this.sapphires.length; ++i) {
         this.sprites.push(this.sapphires[i]);
      }

      for (var i=0; i < this.smokingHoles.length; ++i) {
         this.sprites.push(this.smokingHoles[i]);
      }

     for (var i=0; i < this.snails.length; ++i) {
         this.sprites.push(this.snails[i]);
      }
   },

   // --------------------------- UTILITIES --------------------------------


   isSpriteInGameCanvas: function(sprite) {
      return sprite.left + sprite.width > sprite.offset &&
             sprite.left < sprite.offset + this.canvas.width;   
   },

   isSpriteInView: function(sprite) {
      return this.isSpriteInGameCanvas(sprite);
   },

   // ------------------------- INITIALIZATION ----------------------------

   initializeImages: function () {
      this.spritesheet.src = '../../../../images/spritesheet.png';

      this.spritesheet.onload = function (e) {
         snailBait.startGame();
      };
   },

   startGame: function () {
      window.requestNextAnimationFrame(snailBait.animate);
   }
};

// Event handlers.......................................................

window.onkeydown = function (e) {
   var key = e.keyCode;

   if (key === 80 || (snailBait.paused && key !== 80)) {  // 'p'
      snailBait.togglePaused();
      if (snailBait.paused) {
         snailBait.revealToast('paused', 500);
      }
   }   
   else if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k'or right arrow
      snailBait.turnRight();
   }
   else if (key === 74) { // 'j'
      if (snailBait.runnerTrack === 3) {
         return;
      }
      snailBait.runnerTrack++;
   }
   else if (key === 70) { // 'f'
      if (snailBait.runnerTrack === 1) {
         return;
      }
      snailBait.runnerTrack--;
   }
};

window.onblur = function (e) {  // pause if unpaused
   snailBait.windowHasFocus = false;
   
   if (!snailBait.paused) {
      snailBait.togglePaused();
   }
};

window.onfocus = function (e) {  // unpause if paused
   var originalFont = snailBait.toast.style.fontSize;

   snailBait.windowHasFocus = true;

   if (snailBait.paused) {
      snailBait.toast.style.font = '128px fantasy';

      snailBait.revealToast('3', 500); // Display 3 for one half second

      setTimeout(function (e) {
         snailBait.revealToast('2', 500); // Display 2 for one half second

         setTimeout(function (e) {
            snailBait.revealToast('1', 500); // Display 1 for one half second

            setTimeout(function (e) {
               if ( snailBait.windowHasFocus) {
                  snailBait.togglePaused();
               }

               setTimeout(function (e) { // Wait for '1' to disappear
                  snailBait.toast.style.fontSize = originalFont;
               }, 1000);
            }, 1000);
         }, 1000);
      }, 1000);
   }
};

// Launch game.........................................................

var snailBait = new SnailBait();

snailBait.initializeImages();
snailBait.createSprites();

setTimeout( function (e) {
   snailBait.turnRight();
}, 1000);
