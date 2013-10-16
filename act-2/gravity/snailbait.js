// SnailBait constructor --------------------------------------------------

var SnailBait =  function () {

   this.canvas = document.getElementById('game-canvas');
   this.context = this.canvas.getContext('2d');

   // Time................................................................

   this.timeSystem = new TimeSystem(); // See js/timeSystem.js
   this.timeFactor = 1.0; // 1.0 is normal speed, 0.5 is 1/2 speed, etc.

   // Pixels and meters...................................................

   this.CANVAS_WIDTH_IN_METERS = 10;  // Arbitrary
   this.PIXELS_PER_METER = this.canvas.width / this.CANVAS_WIDTH_IN_METERS;

   // Gravity.............................................................

   this.GRAVITY_FORCE = 9.81; // m/s/s

   // HTML elements.......................................................
   
   this.fpsElement = document.getElementById('fps');
   this.toast = document.getElementById('toast');
   
   this.LEFT = 1;
   this.RIGHT = 2;

   this.BACKGROUND_VELOCITY = 42;
   this.SNAIL_BOMB_VELOCITY = 550;

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

   // Animations........................................................

   this.INITIAL_RUN_ANIMATION_RATE = 0;
   this.RUN_ANIMATION_RATE = 30; // fps

   this.RUBY_SPARKLE_DURATION = 200; // milliseconds
   this.RUBY_SPARKLE_INTERVAL = 500; // milliseconds

   this.SAPPHIRE_SPARKLE_DURATION = 100; // milliseconds
   this.SAPPHIRE_SPARKLE_INTERVAL = 300; // milliseconds

   this.SAPPHIRE_BOUNCE_DURATION = 2000; // pixels
   this.RUBY_BOUNCE_DURATION = 1000; // pixels

   // Runner values.....................................................

   this.INITIAL_RUNNER_LEFT = 50;
   this.INITIAL_RUNNER_TRACK = 1;

   this.RUNNER_JUMP_DURATION = 1000; // milliseconds
   this.RUNNER_JUMP_HEIGHT = 120;

   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35;

   this.STARTING_BACKGROUND_VELOCITY = 0;

   this.STARTING_PLATFORM_OFFSET = 0;
   this.STARTING_BACKGROUND_OFFSET = 0;

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

   // Translation offsets...............................................
   
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET;
   this.spriteOffset = this.STARTING_PLATFORM_OFFSET;

   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY;
   this.platformVelocity   

   this.BUTTON_PACE_VELOCITY = 80;
   this.SNAIL_PACE_VELOCITY = 50;

   // Images............................................................
   
   this.spritesheet = new Image();

   // Time................................................................

   // Sprite sheet cells................................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;

   this.RUNNER_CELLS_WIDTH = 50; // pixels
   this.RUNNER_CELLS_HEIGHT = 54;

   this.BAT_CELLS_HEIGHT = 34; // No constant for bat cell width, which varies

   this.BEE_CELLS_HEIGHT = 50;
   this.BEE_CELLS_WIDTH  = 50;

   this.BUTTON_CELLS_HEIGHT  = 20;
   this.BUTTON_CELLS_WIDTH   = 31;

   this.COIN_CELLS_HEIGHT = 30;
   this.COIN_CELLS_WIDTH  = 30;
   
   this.EXPLOSION_CELLS_HEIGHT = 62;

   this.RUBY_CELLS_HEIGHT = 30;
   this.RUBY_CELLS_WIDTH = 35;

   this.SAPPHIRE_CELLS_HEIGHT = 30;
   this.SAPPHIRE_CELLS_WIDTH  = 35;

   this.SNAIL_BOMB_CELLS_HEIGHT = 20;
   this.SNAIL_BOMB_CELLS_WIDTH  = 20;

   this.SNAIL_CELLS_HEIGHT = 34;
   this.SNAIL_CELLS_WIDTH  = 64;

   this.batCells = [
      { left: 3,   top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 41,  top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 93,  top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 132, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ];

   this.batRedEyeCells = [
      { left: 185, top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 222, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 273, top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 313, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeCells = [
      { left: 5,   top: 234, width: this.BEE_CELLS_WIDTH,
                            height: this.BEE_CELLS_HEIGHT },

      { left: 75,  top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT },

      { left: 145, top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT }
   ];
   
   this.blueCoinCells = [
      { left: 5, top: 540, width: this.COIN_CELLS_WIDTH, 
                           height: this.COIN_CELLS_HEIGHT },
      { left: 5 + this.COIN_CELLS_WIDTH, top: 540,
        width: this.COIN_CELLS_WIDTH, height: this.COIN_CELLS_HEIGHT }
   ];

   this.explosionCells = [
      { left: 3,   top: 48, width: 52, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 63,  top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 146, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 233, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 308, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 392, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 473, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT }
   ];

   this.blueButtonCells = [
      { left: 10,   top: 192, width: this.BUTTON_CELLS_WIDTH,
                            height: this.BUTTON_CELLS_HEIGHT },

      { left: 53,  top: 192, width: this.BUTTON_CELLS_WIDTH, 
                            height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.goldCoinCells = [
      { left: 65, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 96, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 128, top: 540, width: this.COIN_CELLS_WIDTH, 
                             height: this.COIN_CELLS_HEIGHT },
   ];

   this.goldButtonCells = [
      { left: 90,   top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT },

      { left: 132,  top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.rubyCells = [
      { left: 185,   top: 138, width: this.SAPPHIRE_CELLS_WIDTH,
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 220,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 258,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 294, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 331, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT }
   ];

   this.runnerCellsRight = [
      { left: 414, top: 385, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 362, top: 385, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 314, top: 385, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 205, top: 385, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 150, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 96,  top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 45,  top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 0,   top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.runnerCellsLeft = [
      { left: 0,   top: 305, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 55,  top: 305, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 107, top: 305, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 152, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 208, top: 305, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 320, top: 305, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 380, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 425, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],

   this.sapphireCells = [
      { left: 3,   top: 138, width: this.RUBY_CELLS_WIDTH,
                               height: this.RUBY_CELLS_HEIGHT },
      { left: 39,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                               height: this.RUBY_CELLS_HEIGHT },
      { left: 76,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                               height: this.RUBY_CELLS_HEIGHT },
      { left: 112, top: 138, width: this.RUBY_CELLS_WIDTH, 
                               height: this.RUBY_CELLS_HEIGHT },

      { left: 148, top: 138, width: this.RUBY_CELLS_WIDTH, 
                               height: this.RUBY_CELLS_HEIGHT }
   ];

   this.snailBombCells = [
      { left: 2, top: 512, width: 30, height: 20 }
   ];

   this.snailCells = [
      { left: 142, top: 466, width: this.SNAIL_CELLS_WIDTH,
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 75,  top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 2,   top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },
   ]; 

   // Sprite data.......................................................

   this.batData = [
      { left: 70,  top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT },
      { left: 610,  top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
      { left: 1150, top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT },
      { left: 1720, top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },
      { left: 1960, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT }, 
      { left: 2200, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
      { left: 2350, top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeData = [
      { left: 350,  top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 550,  top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 750,  top: this.TRACK_1_BASELINE - 1.5*this.BEE_CELLS_HEIGHT },
      { left: 944,  top: this.TRACK_2_BASELINE - 1.25*this.BEE_CELLS_HEIGHT },
      { left: 1500, top: 225 },
      { left: 1600, top: 115 },
      { left: 2225, top: 125 },
      { left: 2295, top: 275 },
      { left: 2450, top: 275 },
   ];
   
   this.buttonData = [
      { platformIndex: 7 },
      { platformIndex: 12 },
   ];

   this.coinData = [
      { left: 280,  top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 469,  top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 620,  top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 833,  top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 1050, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 1450, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 1670, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 1870, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 1930, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 2200, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 2320, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 2360, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
   ];   

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
         pulsate:   true,
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
         pulsate:   true,
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

   this.rubyData = [
      { left: 150,  top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 880,  top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 1100, top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT }, 
      { left: 1475, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 2400, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
   ];

   this.sapphireData = [
      { left: 680,  top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      { left: 1700, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      { left: 2056, top: this.TRACK_2_BASELINE - 
                         3*this.SAPPHIRE_CELLS_HEIGHT/2 },
   ];

   this.smokingHoleData = [
      { left: 248,  top: this.TRACK_2_BASELINE - 22 },
      { left: 688,  top: this.TRACK_3_BASELINE + 5 },
      { left: 1352,  top: this.TRACK_2_BASELINE - 18 },
   ];
   
   this.snailData = [
      { platformIndex: 3 },
   ];

   // Sprite artists...................................................

   this.runnerArtist = new SpriteSheetArtist(this.spritesheet,
                                             this.runnerCellsRight);

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

   // Sprite behaviors..................................................

   this.runBehavior = {
      lastAdvanceTime: 0,
      
      execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {  // skip first time
            this.lastAdvanceTime = now;
         }
         else if (now - this.lastAdvanceTime > 
                  1000 / sprite.runAnimationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = now;
         }
      }      
   };

   // Runner's jump behavior..................................................

   this.jumpBehavior = {
      pause: function (sprite, now) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.pause(now);
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.pause(now);
         }
      },

      unpause: function (sprite, now) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.unpause(now);
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.unpause(now);
         }
      },

      jumpIsOver: function (sprite) {
         return ! sprite.ascendAnimationTimer.isRunning() &&
                ! sprite.descendAnimationTimer.isRunning();
      },

      // Ascent...............................................................

      isAscending: function (sprite) {
         return sprite.ascendAnimationTimer.isRunning();
      },
      
      ascend: function (sprite, now) {
         var elapsed = sprite.ascendAnimationTimer.getElapsedTime(now),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) 
                       * sprite.JUMP_HEIGHT;

         sprite.top = sprite.verticalLaunchPosition - deltaH;
      },

      isDoneAscending: function (sprite, now) {
         return sprite.ascendAnimationTimer.getElapsedTime(now) >
                sprite.JUMP_DURATION/2;
      },
      
      finishAscent: function (sprite, now) {
         sprite.jumpApex = sprite.top;
         sprite.ascendAnimationTimer.stop(now);
         sprite.descendAnimationTimer.start(now);
      },
      
      // Descent..............................................................

      isDescending: function (sprite) {
         return sprite.descendAnimationTimer.isRunning();
      },

      descend: function (sprite, now) {
         var elapsed = sprite.descendAnimationTimer.getElapsedTime(now),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) 
                       * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaH;
      },
      
      isDoneDescending: function (sprite, now) {
         return sprite.descendAnimationTimer.getElapsedTime(now) > 
                sprite.JUMP_DURATION/2;
      },

      finishDescent: function (sprite, now) {
         sprite.top = sprite.verticalLaunchPosition;
         sprite.stopJumping();
      },
      
      // Execute..............................................................

      execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
         if ( ! sprite.jumping) {
            return;
         }

         if (this.isAscending(sprite)) {
            if ( ! this.isDoneAscending(sprite, now)) { 
               this.ascend(sprite, now); 
            }
            else { 
               this.finishAscent(sprite, now); 
            }
         }
         else if (this.isDescending(sprite)) {
            if ( ! this.isDoneDescending(sprite, now)) { 
               this.descend(sprite, now); 
            }
            else { 
               this.finishDescent(sprite, now); 
            }
         }
      } 
   };

   // Runner's fall behavior..................................................

   this.fallBehavior = {
      pause: function (sprite, now) {
         sprite.fallAnimationTimer.pause(now);
      },

      unpause: function (sprite, now) {
         sprite.fallAnimationTimer.unpause(now);
      },
      
      isOutOfPlay: function (sprite) {
         return sprite.top > snailBait.canvas.height;
      },

      setSpriteVelocity: function (sprite, now) {
         sprite.velocityY = sprite.initialVelocityY + snailBait.GRAVITY_FORCE *
                            (sprite.fallAnimationTimer.getElapsedTime(now)/1000) *
                            snailBait.PIXELS_PER_METER;
      },

      calculateVerticalDrop: function (sprite, now, lastAnimationFrameTime) {
         return sprite.velocityY * (now - lastAnimationFrameTime) / 1000;
      },

      willFallBelowCurrentTrack: function (sprite, dropDistance) {
         return sprite.top + sprite.height + dropDistance >
                snailBait.calculatePlatformTop(sprite.track);
      },

      fallOnPlatform: function (sprite) {
         sprite.top = snailBait.calculatePlatformTop(sprite.track) -
                      sprite.height;

         sprite.stopFalling();
      },

      execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
         var dropDistance;
        
         if (sprite.jumping) {
            return;
         } 
         
         if (!sprite.falling) {
            if (!snailBait.platformUnderneath(sprite)) {
               sprite.fall();
            }
            return;
         }

         if (this.isOutOfPlay(sprite)) {
            if (sprite.falling) {
               sprite.stopFalling();
               snailBait.putSpriteOnTrack(sprite, 1);
            }
            return;
         }

         this.setSpriteVelocity(sprite, now);

         dropDistance = this.calculateVerticalDrop(sprite, now, 
                                                   lastAnimationFrameTime);

         if (!this.willFallBelowCurrentTrack(sprite, dropDistance)) {
            sprite.top += dropDistance; // Y coordinates increase top to bottom
         }
         else { // will fall below current track
            if (snailBait.platformUnderneath(sprite)) {
               this.fallOnPlatform(sprite);
               sprite.stopFalling();
            }
            else {
               sprite.track--;
               sprite.top += dropDistance;
            }
         }
      }
   };

   // Runner's collide behavior...............................................

   this.collideBehavior = {
      isCandidateForCollision: function (sprite, otherSprite) {
         var r = sprite.calculateCollisionRectangle(),
             o = otherSprite.calculateCollisionRectangle();
         
         return sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding &&
                o.left < r.right;
      },

      didRunnerCollideWithOtherSprite: function (otherSprite, context) {
         var o = otherSprite.calculateCollisionRectangle(),
             r = snailBait.runner.calculateCollisionRectangle();

         // Determine if either of the runner's four corners or its
         // center lie within the other sprite's bounding box.

         context.beginPath();
         context.rect(o.left, o.top, o.right - o.left, o.bottom - o.top);

         return context.isPointInPath(r.left,  r.top)       ||
                context.isPointInPath(r.right, r.top)       ||

                context.isPointInPath(r.centerX, r.centerY) ||

                context.isPointInPath(r.left,  r.bottom)    ||
                context.isPointInPath(r.right, r.bottom);
      },
     
      didCollide: function (sprite, otherSprite, context) {
         return this.didRunnerCollideWithOtherSprite(otherSprite, context);
      },

      processPlatformCollisionDuringJump: function (sprite, platform) {
         var isDescending = sprite.descendAnimationTimer.isRunning();

         if (isDescending) {
            sprite.track = platform.track;
            sprite.top = snailBait.calculatePlatformTop(sprite.track) -
                         sprite.height;
         }
         else { // Collided with platform while ascending
            // sprite.fall();
         }

         sprite.stopJumping();
      },

      processCollision: function (sprite, otherSprite) {
         if (sprite.jumping && 'platform' === otherSprite.type) {
            this.processPlatformCollisionDuringJump(sprite, otherSprite);
         }
         else if ('coin'  === otherSprite.type    ||
                  'sapphire' === otherSprite.type ||
                  'ruby' === otherSprite.type     || 
                  'snail bomb' === otherSprite.type) {
            otherSprite.visible = false;
         }
         else if ('button' === otherSprite.type &&
             (sprite.falling || sprite.jumping)) {
            if ( ! (sprite.jumping && sprite.ascendAnimationTimer.isRunning())) {
               // Descending while jumping or falling
               otherSprite.detonating = true; // trigger
            }
         }

         if ('bat' === otherSprite.type ||
             'bee' === otherSprite.type || 
             'snail bomb' === otherSprite.type) {
            snailBait.explode(sprite);
            snailBait.shake();
            snailBait.loseLife();
         }

         if ('snail' === otherSprite.type) {
            otherSprite.visible = false;
            //snailBait.showWinAnimation();
         }
      },

      execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
         var otherSprite; // other than the runner

         for (var i=0; i < snailBait.sprites.length; ++i) {
            otherSprite = snailBait.sprites[i];

            if (this.isCandidateForCollision(sprite, otherSprite)) {
               if (this.didCollide(sprite, otherSprite, context)) { 
                  this.processCollision(sprite, otherSprite);
               }
            }
         }
      }      
   };

   this.paceBehavior = {
      execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
         var sRight = sprite.left + sprite.width,
             pRight = sprite.platform.left + sprite.platform.width,
             pixelsToMove = sprite.velocityX * 
                            (now - lastAnimationFrameTime) / 1000;

         if (sprite.direction === undefined) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.velocityX === 0) {
            if (sprite.type === 'snail') {
               sprite.velocityX = snailBait.SNAIL_PACE_VELOCITY;
            }
            else {
               sprite.velocityX = snailBait.BUTTON_PACE_VELOCITY;
            }
         }

         if (sRight > pRight && sprite.direction === snailBait.RIGHT) {
            sprite.direction = snailBait.LEFT;
         }
         else if (sprite.left < sprite.platform.left &&
                  sprite.direction === snailBait.LEFT) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.direction === snailBait.RIGHT) {
            sprite.left += pixelsToMove;
         }
         else {
            sprite.left -= pixelsToMove;
         }
      }
   };

   // Snail shoot behavior....................................................

   this.snailShootBehavior = { // sprite is the snail
      execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
         var bomb = sprite.bomb;

         if (!snailBait.isSpriteInView(sprite)) {
            return;
         }

         if (! bomb.visible && sprite.artist.cellIndex === 2) {
            bomb.left = sprite.left;
            bomb.visible = true;
         }
      }
   };

   // Move the snail bomb.................................................

   this.snailBombMoveBehavior = {
      execute: function (sprite, now, fps, context, lastAnimationFrameTime) {
         if (sprite.visible && snailBait.isSpriteInView(sprite)) {
            sprite.left -= snailBait.SNAIL_BOMB_VELOCITY / fps;
         }

         if (!snailBait.isSpriteInView(sprite)) {
            sprite.visible = false;
         }
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
                              this.PLATFORM_VELOCITY_MULTIPLIER *
                              this.timeFactor; 
   },

   setOffsets: function () {
      this.setBackgroundOffset();
      this.setSpriteOffsets();
   },

   setBackgroundOffset: function () {
      var offset = this.backgroundOffset + 
                   this.bgVelocity/this.fps * 
                   this.timeFactor;

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
      var fps = 1000 / (now - this.lastAnimationFrameTime) * this.timeFactor;

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
      this.runnerArtist.cells = this.runnerCellsLeft;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runnerArtist.cells = this.runnerCellsRight;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
   },
   
   // Animation............................................................

   animate: function (now) {
      // Replace the time passed to this method by the browser
      // with the time from Snail Bait's time system
      
      now = snailBait.timeSystem.calculateGameTime();
 
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         snailBait.draw(now);
         snailBait.lastAnimationFrameTime = now;
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

   togglePausedStateOfAllBehaviors: function (now) {
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) {
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite, now);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite, now);
               }
            }
         }
      }
   },

   togglePaused: function () {
      var now = snailBait.timeSystem.calculateGameTime();

      this.paused = !this.paused;
      this.togglePausedStateOfAllBehaviors(now);
   
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
      this.createRunnerSprite();
      
      this.createBatSprites();
      this.createBeeSprites();
      this.createButtonSprites();
      this.createCoinSprites();
      this.createRubySprites();
      this.createRunnerSprite();
      this.createSapphireSprites();
      this.createSnailSprites();

      this.addSpritesToSpriteArray();

      this.initializeSprites();
   },

   createBatSprites: function () {
      var bat,
          BAT_VALUE = -50;

      for (var i = 0; i < this.batData.length; ++i) {
         bat = new Sprite('bat',
                          new SpriteSheetArtist(this.spritesheet, 
                                                this.batCells),
                          [ new CycleBehavior(100) ]);

         // bat cell width varies; batCells[1] is widest

         bat.width = this.batCells[1].width; 
         bat.height = this.BAT_CELLS_HEIGHT;
         bat.value = BAT_VALUE;

         bat.collisionMargin = {
            left: 6,
            top: 11,
            right: 4,
            bottom: 8,
         };

         this.bats.push(bat);
      }
   },

   createBeeSprites: function () {
      var bee,
          beeArtist,
          BEE_VALUE = -50;

      for (var i = 0; i < this.beeData.length; ++i) {
         bee = new Sprite('bee',
                          new SpriteSheetArtist(this.spritesheet, 
                                                this.beeCells),
                          [ new CycleBehavior(100) ]);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;
         bee.value = BEE_VALUE;

         bee.collisionMargin = {
            left: 10,
            top: 10,
            right: 5,
            bottom: 10,
         };

         this.bees.push(bee);
      }
   },

   createButtonSprites: function () {
      var button;

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i !== this.buttonData.length - 1) { // not the last button
            button = new Sprite('button',
                            new SpriteSheetArtist(this.spritesheet,
                                                  this.goldButtonCells),
                            [ this.paceBehavior ]);
         }
         else {
            button = new Sprite('button',
                            new SpriteSheetArtist(this.spritesheet,
                                                  this.blueButtonCells),
                            [ this.paceBehavior ]);
         }
        
         button.width = this.BUTTON_CELLS_WIDTH;
         button.height = this.BUTTON_CELLS_HEIGHT;

         this.buttons.push(button);
      }
   },
   
   createCoinSprites: function () {
      var coin,
          artist,
          blueCoinArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.blueCoinCells),
          goldCoinArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.goldCoinCells);
   
      for (var i = 0; i < this.coinData.length; ++i) {
         if (i % 2 === 0) {
            coin = new Sprite('coin', goldCoinArtist,
                              [ new CycleBehavior(500) ]);
         }
         else {
            coin = new Sprite('coin', blueCoinArtist,
                              [ new CycleBehavior(500) ]);
         }
         
         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;
         coin.value = 50;

         coin.behaviors.push(new BounceBehavior(80 * i * 10,
                                                50 * i * 10,
                                                60 + Math.random() * 40));
         coin.collisionMargin = {
            left:   coin.width/8,
            top:    coin.height/8,
            right:  coin.width/8,
            bottom: coin.height/4
         };

         this.coins.push(coin);
      }
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
   
         if (sprite.pulsate) {
            sprite.behaviors = [ new PulseBehavior(1000, 0.5) ];
         }

         sprite.top = this.calculatePlatformTop(pd.track);
   
         this.platforms.push(sprite);
      }
   },
   
   createRubySprites: function () {
      var ruby,
          rubyArtist = new SpriteSheetArtist(this.spritesheet,
                                             this.rubyCells);
   
      for (var i = 0; i < this.rubyData.length; ++i) {
         ruby = new Sprite('ruby',
                            rubyArtist,
                            [ new CycleBehavior(this.RUBY_SPARKLE_DURATION,
                                                this.RUBY_SPARKLE_INTERVAL),

                              new BounceBehavior(
                                 this.RUBY_BOUNCE_DURATION,
                                 this.RUBY_BOUNCE_DURATION,
                                 150)
                            ]);

         ruby.width = this.RUBY_CELLS_WIDTH;
         ruby.height = this.RUBY_CELLS_HEIGHT;
         ruby.value = 200;

         ruby.collisionMargin = {
            left: ruby.width/5,
            top: ruby.height/8,
            right: 0,
            bottom: ruby.height/4
         };
         
         this.rubies.push(ruby);
      }
   },
  
   createRunnerSprite: function () {
      this.runner = new Sprite('runner',       // type
                           this.runnerArtist,  // artist
                           [ this.runBehavior,
                             this.jumpBehavior,
                             this.fallBehavior,
                             this.collideBehavior ]); // behaviors

      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;

      this.runner.width = this.RUNNER_CELLS_WIDTH;
      this.runner.height = this.RUNNER_CELLS_HEIGHT;
      this.runner.left = this.INITIAL_RUNNER_LEFT;
      this.runner.track = this.INITIAL_RUNNER_TRACK;
      this.runner.top = this.calculatePlatformTop(this.runner.track) -
                        this.RUNNER_CELLS_HEIGHT;

      this.runner.collisionMargin = {
         left: 15,
         top: 15, 
         right: 15,
         bottom: 20,
      };
   }, 

   createSapphireSprites: function () {
      var sapphire,
          sapphireArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.sapphireCells);
   
      for (var i = 0; i < this.sapphireData.length; ++i) {
         sapphire = new Sprite('sapphire',
                                sapphireArtist,
                            [ new CycleBehavior(this.SAPPHIRE_SPARKLE_DURATION,
                                                this.SAPPHIRE_SPARKLE_INTERVAL),

                                  new BounceBehavior(this.SAPPHIRE_BOUNCE_DURATION,
                                                     this.SAPPHIRE_BOUNCE_DURATION,
                                                     100)
                                ]);

         sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
         sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;
         sapphire.value = 100;

         sapphire.collisionMargin = {
            left:   sapphire.width/8,
            top:    sapphire.height/8,
            right:  sapphire.width/8,
            bottom: sapphire.height/4
         }; 

         this.sapphires.push(sapphire);
      }
   },

   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, 
                                              this.snailCells);
   
      for (var i = 0; i < this.snailData.length; ++i) {
         snail = new Sprite('snail',
                            snailArtist,
                            [ this.paceBehavior,
                              this.snailShootBehavior,
                              new CycleBehavior(300, 1500) ]);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;

         this.snails.push(snail);
      }
   },

   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite,
               this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },
   
   initializeSprites: function() {  
      for (var i=0; i < snailBait.sprites.length; ++i) { 
         snailBait.sprites[i].offset = 0;
         snailBait.sprites[i].visible = true;
      }

      this.positionSprites(this.bats,       this.batData);
      this.positionSprites(this.bees,      this.beeData);
      this.positionSprites(this.buttons,   this.buttonData);
      this.positionSprites(this.coins,     this.coinData);
      this.positionSprites(this.rubies,    this.rubyData);
      this.positionSprites(this.sapphires, this.sapphireData);
      this.positionSprites(this.snails,    this.snailData);

      this.armSnails();
   },
   
   armSnails: function () {
      var snail,
          snailBombArtist = new SpriteSheetArtist(this.spritesheet,
                                                  this.snailBombCells);

      for (var i=0; i < this.snails.length; ++i) {
         snail = this.snails[i];
         snail.bomb = new Sprite('snail bomb',
                                  snailBombArtist,
                                  [ this.snailBombMoveBehavior ]);

         snail.bomb.width  = snailBait.SNAIL_BOMB_CELLS_WIDTH;
         snail.bomb.height = snailBait.SNAIL_BOMB_CELLS_HEIGHT;

         snail.bomb.top = snail.top + snail.bomb.height/2;
         snail.bomb.left = snail.left + snail.bomb.width/2;
         snail.bomb.visible = false;
  
         // Snail bombs maintain a reference to their snail
         snail.bomb.snail = snail;

         this.sprites.push(snail.bomb);
      }      
   },

   addSpritesToSpriteArray: function () {
      this.sprites.push(this.runner);
      
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

   putSpriteOnTrack: function(sprite, track) {
      sprite.track = track;
      sprite.top = this.calculatePlatformTop(sprite.track) - sprite.height;
   },

   putSpriteOnPlatform: function(sprite, platformSprite) {
      sprite.top  = platformSprite.top - sprite.height;
      sprite.left = platformSprite.left;
      sprite.platform = platformSprite;
   },

   platformUnderneath: function (sprite, track) {
      var platform,
          platformUnderneath,
          sr = sprite.calculateCollisionRectangle(), // sprite rectangle
          pr, // platform rectangle
          VERTICAL_THRESHOLD = 15;

      if (track === undefined) {
         track = sprite.track; // Look on sprite track only
      }

      for (var i=0; i < snailBait.platforms.length; ++i) {
         platform = snailBait.platforms[i];
         pr = platform.calculateCollisionRectangle();

         if (track === platform.track) {
            if (sr.right > pr.left  && sr.left < pr.right &&
                pr.top >= sr.bottom &&
                pr.top - sr.bottom < VERTICAL_THRESHOLD) {
               platformUnderneath = platform;
               break;
            }
         }
      }
      return platformUnderneath;
   },

   // ------------------------- INITIALIZATION ----------------------------

   initializeImages: function () {
      this.spritesheet.src = '../../images/spritesheet.png';

      this.spritesheet.onload = function (e) {
         snailBait.startGame();
      };
   },

   equipRunnerForJumping: function () {
      this.runner.JUMP_DURATION = this.RUNNER_JUMP_DURATION; // milliseconds
      this.runner.JUMP_HEIGHT = this.RUNNER_JUMP_HEIGHT;

      this.runner.jumping = false;

      this.runner.ascendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseOutTransducer(1.1));
         
      this.runner.descendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseInTransducer(1.1));

      this.runner.jump = function () {
         if (this.jumping) // 'this' is the runner
            return;

         this.jumping = true;
         this.runAnimationRate = 0;
         this.verticalLaunchPosition = this.top;

         this.ascendAnimationTimer.start(snailBait.timeSystem.calculateGameTime());
      };

      this.runner.stopJumping = function () {
         this.jumping = false;
         this.ascendAnimationTimer.stop(snailBait.timeSystem.calculateGameTime());
         this.descendAnimationTimer.stop(snailBait.timeSystem.calculateGameTime());
         this.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
      };
   },

   equipRunnerForFalling: function () {
      this.runner.falling = false;
      
      this.runner.fallAnimationTimer = 
         new AnimationTimer(this.runner.JUMP_DURATION,
                            AnimationTimer.makeLinearTransducer(1));

      this.runner.fall = function (initialVelocity) {
         this.falling = true;
         this.velocityY = initialVelocity || 0;
         this.initialVelocityY = initialVelocity || 0;
         this.fallAnimationTimer.start(snailBait.timeSystem.calculateGameTime());
      };

      this.runner.stopFalling = function () {
         this.falling = false;
         this.velocityY = 0;
         this.fallAnimationTimer.stop(snailBait.timeSystem.calculateGameTime());
      };
   },

   equipRunner: function () {
      this.runner.runAnimationRate = this.INITIAL_RUN_ANIMATION_RATE
      this.equipRunnerForJumping();
      this.equipRunnerForFalling();
   },

   startGame: function () {
      this.equipRunner();      
      window.requestNextAnimationFrame(snailBait.animate);
   },

   setTimeRate: function (rate) {
      this.timeFactor = rate;

      this.timeSystem.setTransducer( function (percent) {
         return percent * snailBait.timeFactor;
      });      
   },
   
   // Special effects...................................................

   explode: function (sprite, silent) {
      console.log('boom');
   },

   shake: function () {
      console.log('shake');
   },

   // Gameplay..........................................................  

   loseLife: function () {
      console.log('life lost');
   },
    
   // User interface....................................................  

   revealCollisionRectangles: function() {
      for (var i=0; i < this.sprites.length; ++i) {
         this.sprites[i].drawCollisionRectangle = true;
      }
   },

   hideCollisionRectangles: function() {
      for (var i=0; i < this.sprites.length; ++i) {
         this.sprites[i].drawCollisionRectangle = false;
      }
   },
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
      snailBait.runner.jump();
   }
   else if (key === 70) { // 'f'
      if (snailBait.runner.track === 1) {
         return;
      }
      snailBait.runner.track--;
      snailBait.putSpriteOnTrack(snailBait.runner, snailBait.runner.track);
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
snailBait.setTimeRate(1.0);
//snailBait.revealCollisionRectangles();
