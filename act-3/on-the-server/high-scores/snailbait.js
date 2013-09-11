// SnailBait constructor --------------------------------------------------

var SnailBait =  function () {

   this.canvas = document.getElementById('game-canvas');
   this.context = this.canvas.getContext('2d');

   // Ruler canvas and its context.........................................

   this.rulerCanvas = document.getElementById('ruler-canvas');
   this.rulerContext = this.rulerCanvas.getContext('2d');

   // Time.................................................................

   this.timeSystem = new TimeSystem(); // See js/timeSystem.js
   this.timeFactor = 1.0; // 1.0 is normal speed, 0.5 is 1/2 speed, etc.
   this.SHORT_DELAY = 50; // milliseconds

   // Pixels and meters....................................................

   this.CANVAS_WIDTH_IN_METERS = 10;  // Arbitrary
   this.PIXELS_PER_METER = this.canvas.width / this.CANVAS_WIDTH_IN_METERS;

   // Gravity..............................................................

   this.GRAVITY_FORCE = 9.81; // m/s/s

   // Toast................................................................
   
   this.toast = document.getElementById('toast');
   this.DEFAULT_TOAST_TIME = 3000; // 3 seconds
   this.MAX_TIME_FACTOR = 2.0;

   // Runner animated GIF..................................................

   this.loadingTitleElement = document.getElementById('loading-title');
   this.runnerAnimatedGIFElement = document.getElementById('runner-animated-gif');

   // Developer backdoor...................................................

   this.developerBackdoorElement = document.getElementById('developer-backdoor');
   this.collisionRectanglesCheckboxElement = document.getElementById('collision-rectangles-checkbox');
   this.detectRunningSlowlyCheckboxElement = document.getElementById('detect-running-slowly-checkbox');
   this.smokingHolesCheckboxElement = document.getElementById('smoking-holes-checkbox');

   this.backgroundOffsetReadout = document.getElementById('background-offset-readout');

   this.timeFactorReadoutElement = document.getElementById('time-rate-readout');
   this.runningSlowlyReadoutElement = document.getElementById('running-slowly-readout');

   this.developerBackdoorVisible = false;

   // Custom slider components for the developer backdoor. 
   // js/components/slider.js contains the implementation of the slider
   // component. Also, see an IBM developerworks article at
   // http://www.ibm.com/developerworks/web/library/wa-html5components1/index.html
   // for an in-depth discussion of the slider component.

   this.runningSlowlySlider = new COREHTML5.Slider('blue', 'cornflowerblue');
   this.timeFactorSlider = new COREHTML5.Slider('blue', 'red');

   // Credits..............................................................

   this.creditsElement = document.getElementById('credits');
   this.newGameLink = document.getElementById('new-game-link');

   // Lives................................................................

   this.livesElement   = document.getElementById('lives');
   this.lifeIconLeft   = document.getElementById('life-icon-left');
   this.lifeIconMiddle = document.getElementById('life-icon-middle');
   this.lifeIconRight  = document.getElementById('life-icon-right');

   this.MAX_NUMBER_OF_LIVES = 3;
   this.lives = this.MAX_NUMBER_OF_LIVES;

   // Running slowly.......................................................

   this.FPS_SLOW_CHECK_INTERVAL = 2000; // Only check every 2 seconds
   this.DEFAULT_RUNNING_SLOWLY_THRESHOLD = 40; // fps
   this.MAX_RUNNING_SLOWLY_THRESHOLD = 60; // fps

   this.runningSlowlyElement = document.getElementById('running-slowly');
   this.slowlyOkayElement = document.getElementById('slowly-okay');
   this.slowlyDontShowElement = document.getElementById('slowly-dont-show');
   this.slowlyWarningElement = document.getElementById('slowly-warning');

   this.runningSlowlyThreshold = this.DEFAULT_RUNNING_SLOWLY_THRESHOLD;

   // Slow fps detection and warning....................................

   this.slowFlags = 0;
   this.lastSlowWarningTime = 0;
   this.showSlowWarning = false;
   
   this.speedSamples = [60,60,60,60,60,60,60,60,60,60];
   this.speedSamplesIndex = 0;

   this.NUM_SPEED_SAMPLES = this.speedSamples.length;

   // Score................................................................

   this.scoreElement = document.getElementById('score');
   this.score = 0;

   // High scores..........................................................

   this.highScoreElement = document.getElementById('high-score-toast');
   this.highScoreListElement = document.getElementById('high-score-list');
   this.highScoreNameElement = document.getElementById('high-score-name');
   this.highScoreNewGameElement = document.getElementById('high-score-new-game');
   this.highScoreAddScoreElement = document.getElementById('high-score-add-score');

   this.highScorePending = false;
   this.highScoresVisible = false;

   this.HIGH_SCORE_TRANSITION_DURATION = 1000;

   // Socket connection to the server......................................
  
   this.serverAvailable = true;

   try {
      this.serverSocket = new io.connect('http://corehtml5canvas.com:98');
   }
   catch(err) {
      this.serverAvailable = false;
   }

   // Instructions.........................................................

   this.instructionsElement = document.getElementById('instructions');

   // Tweet score..........................................................

   this.tweetElement = document.getElementById('tweet');

   TWEET_PREAMBLE = 'https://twitter.com/intent/tweet?text=I scored ';
   TWEET_PROLOGUE = ' playing this HTML5 Canvas platformer: ' +
                    'http://bit.ly/NDV761 &hashtags=html5';

   // Copyright............................................................

   this.copyrightElement = document.getElementById('copyright');

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

   this.RUNNER_EXPLOSION_DURATION = 1000;
   this.BAD_GUYS_EXPLOSION_DURATION = 1500;

   // Sound and music...................................................

   // Volumes range between 0 to 1.0. The following values were
   // determined emperically.
   
   this.COIN_VOLUME = 0.3;
   this.SOUNDTRACK_VOLUME = 0.25;
   this.JUMP_WHISTLE_VOLUME = 0.1;
   this.PLOP_VOLUME = 0.40;
   this.THUD_VOLUME = 0.40;
   this.FALLING_WHISTLE_VOLUME = 0.10;
   this.EXPLOSION_VOLUME = 0.40;
   this.CHIMES_VOLUME = 0.3;

   // Sound HTML elements...............................................

   this.soundAndMusicElement = document.getElementById('sound-and-music');

   this.soundCheckboxElement = document.getElementById('sound-checkbox');
   this.musicCheckboxElement = document.getElementById('music-checkbox');
   this.soundtrackElement = document.getElementById('soundtrack');
   this.chimesSoundElement = document.getElementById('chimes-sound');
   this.plopSoundElement = document.getElementById('plop-sound');
   this.explosionSoundElement = document.getElementById('explosion-sound');
   this.fallingWhistleSoundElement = document.getElementById('whistle-down-sound');
   this.coinSoundElement = document.getElementById('coin-sound');
   this.jumpWhistleSoundElement = document.getElementById('jump-sound');
   this.thudSoundElement = document.getElementById('thud-sound');

   this.soundOn = this.soundCheckboxElement.checked;
   this.musicOn = this.musicCheckboxElement.checked;

   // Audio tracks

   // Snail Bait's playSound() uses the first audio track from the
   // following array that's not currently playing a sound. That means
   // Snail Bait can play up to eight simultaneous sounds.

   this.audioTracks = [ 
      new Audio(), new Audio(), new Audio(), new Audio(), 
      new Audio(), new Audio(), new Audio(), new Audio()
   ];

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

   // Stalled...........................................................

   this.stalled = false;
   this.bgVelocityBeforeStall = 0;

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
      { left: 110,  top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT },
      { left: 610,  top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
      { left: 1150, top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT },
      { left: 1720, top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },
      { left: 1960, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT }, 
      { left: 2200, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
      { left: 2380, top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT },
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
         width:     210,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200, 200, 60)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      240,
         width:     110,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(110,150,255)',
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

      {  left:      623,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(255,255,0)',
         opacity:   0.8,
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
         width:     150,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     105,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'cornflowerblue',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     200,
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
         pulsate:   false
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         pulsate:   true
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
      { platformIndex: 13 },
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
         if (snailBait.platformUnderneath(sprite)) {
            sprite.top = sprite.verticalLaunchPosition;
         }
         else {
            sprite.fall(snailBait.GRAVITY_FORCE *
               (sprite.descendAnimationTimer.getElapsedTime(now)/1000) *
               snailBait.PIXELS_PER_METER);
         }
         
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
         snailBait.playSound(snailBait.thudSoundElement);
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

         if (this.isOutOfPlay(sprite) || sprite.exploding) {
            if (sprite.falling) {
               sprite.stopFalling();
            }

            if (this.isOutOfPlay(sprite)) {
               snailBait.loseLife();
               snailBait.reset();
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

               if (sprite.track === 0) {
                  snailBait.playSound(snailBait.fallingWhistleSoundElement);
               }
            }
         }
      }
   };

   // Runner's collide behavior...............................................

   this.collideBehavior = {
      isCandidateForCollision: function (sprite, otherSprite) {
         var s,
             o;
         
         if (sprite.calculateCollisionRectangle === undefined ||
             otherSprite.calculateCollisionRectangle === undefined) {
            return;
         }

         s = sprite.calculateCollisionRectangle(),
         o = otherSprite.calculateCollisionRectangle();
         
         return sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding &&
                o.left < s.right;
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
            snailBait.playSound(snailBait.plopSoundElement);
            sprite.fall();
         }

         sprite.stopJumping();
      },

      processCollision: function (sprite, otherSprite) {
         if (otherSprite.value) {
            snailBait.score += otherSprite.value;
            snailBait.score = snailBait.score < 0 ? 0 : snailBait.score;
            snailBait.updateScoreElement();
         }
         
         if (sprite.jumping && 'platform' === otherSprite.type) {
            this.processPlatformCollisionDuringJump(sprite, otherSprite);
         }
         else if ('coin'  === otherSprite.type    ||
                  'sapphire' === otherSprite.type ||
                  'ruby' === otherSprite.type     || 
                  'snail bomb' === otherSprite.type) {
            otherSprite.visible = false;

            if ('coin' === otherSprite.type) {
               snailBait.playSound(snailBait.coinSoundElement);
            }
            if ('sapphire' === otherSprite.type || 'ruby' === otherSprite.type) {
               snailBait.playSound(snailBait.chimesSoundElement);
            }
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
            
            setTimeout( function () {
               snailBait.loseLife();
               snailBait.reset();
            }, snailBait.RUNNER_EXPLOSION_DURATION);
         }

         if ('snail' === otherSprite.type) {
            otherSprite.visible = false;
            snailBait.showWinAnimation();
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

   // Runner explosions...................................................

   this.runnerExplodeBehavior = new AnimatorBehavior(
      this.explosionCells,
      this.RUNNER_EXPLOSION_DURATION,

      function (sprite, now, fps) { // Trigger
         return sprite.exploding;
      },
                                                
      function (sprite, animator) { // Callback
         sprite.exploding = false;
      }
   );

   // Bad guy explosions................................................

   this.badGuyExplodeBehavior = new AnimatorBehavior(
      this.explosionCells,
      this.BAD_GUYS_EXPLOSION_DURATION,

      function (sprite, now, fps) { // Trigger
         return sprite.exploding;
      },
                                                
      function (sprite, animator) { // Callback
         sprite.exploding = false;
      }
   );

   // Detonate buttons..................................................

   this.buttonDetonateBehavior = {
      execute: function(sprite, now, fps, lastAnimationFrameTime) {
         var BUTTON_REBOUND_DELAY = 1000;

         if (!sprite.detonating) { // trigger
            return;
         }

         sprite.artist.cellIndex = 1; // flatten
         snailBait.blowupBats();
         snailBait.blowupBees();
         snailBait.playSound(snailBait.explosionSoundElement);

         setTimeout( function () {
            sprite.artist.cellIndex = 0; // rebound
            sprite.detonating = false; // reset trigger
         }, BUTTON_REBOUND_DELAY);
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

   this.showSmokingHoles = true;
}

// SnailBait.prototype ----------------------------------------------------

SnailBait.prototype = {
   // Drawing..............................................................

   draw: function (now) {
      if (!this.paused) {
         this.setPlatformVelocity();
         this.setOffsets();
         this.updateSprites(now);
      }
      this.drawBackground();
      this.drawSprites();

      if (this.developerBackdoorVisible) {
         this.drawRuler();

         this.backgroundOffsetReadout.innerHTML = 
            this.spriteOffset.toFixed(0);
      }
   },

   drawRuler: function () {
      var majorTickSpacing = 50,
          minorTickSpacing = 10,
          i;

      this.rulerContext.lineWidth = 0.5;
      this.rulerContext.fillStyle = 'blue';

      this.rulerContext.clearRect(0, 0, this.rulerCanvas.width, 
                                        this.rulerCanvas.height);

      for (i=0; i < this.BACKGROUND_WIDTH; i+=minorTickSpacing) {
         if (i === 0) {
            continue;
         }

         if (i % majorTickSpacing === 0) {
            this.rulerContext.beginPath();
            this.rulerContext.moveTo(i + 0.5, this.rulerCanvas.height/2 + 2);
            this.rulerContext.lineTo(i + 0.5, this.rulerCanvas.height);
            this.rulerContext.stroke();
            this.rulerContext.fillText(
               (this.spriteOffset + i).toFixed(0), i-10, 10);
         }

         this.rulerContext.beginPath();
         this.rulerContext.moveTo(i + 0.5, 3*this.rulerCanvas.height/4);
         this.rulerContext.lineTo(i + 0.5, this.rulerCanvas.height);
         this.rulerContext.stroke();
      }
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
      // Draw smoking holes first so the smoke is always underneath
      // all the other sprites

      if (this.showSmokingHoles) {
         this.drawSmokingHoles(); 
      } 

      for (var i=0; i < this.sprites.length; ++i) {
         if (this.sprites[i].type === 'smoking hole') {
            continue; 
         }

         this.drawSprite(this.sprites[i]);
      }
   },

   drawSmokingHoles: function() {
      for (var i=0; i < this.smokingHoles.length; ++i) {
         this.drawSprite(this.smokingHoles[i]);
      }
   },

   drawSprite: function (sprite) {
      if (sprite.visible && this.isSpriteInView(sprite)) {
         this.context.translate(-sprite.offset, 0);         
         sprite.draw(this.context);
         this.context.translate(sprite.offset, 0);         
      }
   },
   
   // Frame rate monitoring................................................

   checkFps: function (now) {
      var averageSpeed;

      if (this.windowHasFocus) {
         if (now - this.lastSlowWarningTime > this.FPS_SLOW_CHECK_INTERVAL) {
            this.updateSpeedSamples(snailBait.fps);

            averageSpeed = this.calculateAverageSpeed();

            if (averageSpeed < this.runningSlowlyThreshold) {
               this.showRunningSlowlyWarning(now, averageSpeed);
            }
         }
      }
   },

   updateSpeedSamples: function (fps) {
      this.speedSamples[this.speedSamplesIndex] = fps;

      if (this.speedSamplesIndex !== this.NUM_SPEED_SAMPLES-1) {
         this.speedSamplesIndex++;
      }
      else {
         this.speedSamplesIndex = 0;
      }
   },

   calculateAverageSpeed: function () {
      var i,
          total = 0;

         for (i=0; i < this.NUM_SPEED_SAMPLES; i++) {
            total += this.speedSamples[i];
         }

         return total/this.NUM_SPEED_SAMPLES;
   },
   
   showRunningSlowlyWarning: function (now, averageSpeed) {
      this.slowlyWarningElement.innerHTML =
         "Snail Bait is running at <font color='red'>"   +
         averageSpeed.toFixed(0) + "</font>"             +
         " frames/second (fps), but it needs more than " +
         this.runningSlowlyThreshold                     +
         " fps for the game to work correctly."

      this.runningSlowlyElement.style.display = 'block';

      setTimeout( function () {
         snailBait.runningSlowlyElement.style.opacity = 1.0;
      }, snailBait.SHORT_DELAY);

      this.lastSlowWarningTime = now;
   }, 

   calculateFps: function (now) {
      return 1000 / (now - this.lastAnimationFrameTime) * this.timeFactor; 
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
   
   // Runtime flags........................................................

   getParam: function (param) {
      return window.location.search.match(param) ? true : false;
   },

   checkRuntimeFlags: function () {
      snailBait.skipIntro = this.getParam('skipIntro');
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

         if (snailBait.showSlowWarning && !snailBait.paused) {
            snailBait.checkFps(now); 
         }

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
      
      this.createBatSprites();
      this.createBeeSprites();
      this.createButtonSprites();
      this.createCoinSprites();
      this.createRubySprites();
      this.createRunnerSprite();
      this.createSmokingHoles();
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
                          [ this.badGuyExplodeBehavior, 
                            new CycleBehavior(100) ]);

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
                          [ this.badGuyExplodeBehavior,
                             new CycleBehavior(100) ]);

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
                                                  this.blueButtonCells),
                            [ this.paceBehavior,
                              this.buttonDetonateBehavior ]);
         }
         else {
            button = new Sprite('button',
                            new SpriteSheetArtist(this.spritesheet,
                                                  this.goldButtonCells),
                            [ this.paceBehavior,
                              this.buttonDetonateBehavior ]);
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
                             this.collideBehavior,
                             this.runnerExplodeBehavior ]); // behaviors

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

   createSmokingHoles: function () {
      var data;
   
      for (var i = 0; i < this.smokingHoleData.length; ++i) {
         data = this.smokingHoleData[i];

         this.smokingHoles.push(
            new SmokingHole(30, // number of smoke bubbles
                            3, // number of fire particles
                            data.left, data.top, 15)); // left, top, width
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
                              this.badGuyExplodeBehavior,
                              new CycleBehavior(300, 1500)
                            ]);

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

   windowToCanvas: function(x, y) {
      var bbox = this.canvas.getBoundingClientRect();

      return { x: x - bbox.left * (this.canvas.width  / bbox.width),
               y: y - bbox.top  * (this.canvas.height / bbox.height)
      };
   },

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
      this.runnerAnimatedGIFElement.src = '../../../images/runner.gif';
      this.spritesheet.src = '../../../images/spritesheet.png';

      this.spritesheet.onload = function (e) {
         snailBait.startGame();
         snailBait.timeSystem.start();
      };
   },

   initializeSoundAndMusic: function () {
      snailBait.soundOn = snailBait.soundCheckboxElement.checked;
      snailBait.musicOn = snailBait.musicCheckboxElement.checked;
      
      this.soundtrackElement.volume          = this.SOUNDTRACK_VOLUME;
      this.plopSoundElement.volume           = this.PLOP_VOLUME;
      this.jumpWhistleSoundElement.volume    = this.JUMP_WHISTLE_VOLUME;
      this.thudSoundElement.volume           = this.THUD_VOLUME;
      this.fallingWhistleSoundElement.volume = this.FALLING_WHISTLE_VOLUME;
      this.chimesSoundElement.volume         = this.CHIMES_VOLUME;
      this.explosionSoundElement.volume      = this.EXPLOSION_VOLUME;
      this.coinSoundElement.volume           = this.COIN_VOLUME;
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

   setTimeRate: function (rate) {
      this.timeFactor = rate;

      this.timeFactorReadoutElement.innerHTML = (this.timeFactor * 100).toFixed(0);
      this.timeFactorSlider.knobPercent = this.timeFactor / this.MAX_TIME_FACTOR;

      this.timeSystem.setTransducer( function (percent) {
         return percent * snailBait.timeFactor;
      });      
   },
   
   // Special effects...................................................

   explode: function (sprite, silent) {
      if (sprite.exploding) {
         return;
      }

      if (sprite.jumping) {
         sprite.stopJumping();
      }
      
      if (sprite.runAnimationRate === 0) {
         sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
      }
               
      sprite.exploding = true;

      if (!silent) {
         this.playSound(this.explosionSoundElement);
      }
   },

   blowupBees: function () {
      var i,
          numBees = snailBait.bees.length;

      for (i=0; i < numBees; ++i) {
         bee = snailBait.bees[i];
         if (bee.visible) {
            snailBait.explode(bee, true);
         }
      }
   },

   blowupBats: function () {
      var i,
          numBats = snailBait.bats.length;

      for (i=0; i < numBats; ++i) {
         bat = snailBait.bats[i];
         if (bat.visible) {
            snailBait.explode(bat, true);
         }
      }
   },

   shake: function () {
      var originalBgVelocity = snailBait.bgVelocity,
          SHAKE_INTERVAL = 90; // milliseconds
   
      this.bgVelocity = -this.BACKGROUND_VELOCITY;

      setTimeout( function (e) {
         snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
         setTimeout( function (e) {
            snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
            setTimeout( function (e) {
               snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
               setTimeout( function (e) {
                  snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
                  setTimeout( function (e) {
                     snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
                     setTimeout( function (e) {
                        snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
                        setTimeout( function (e) {
                           snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
                           setTimeout( function (e) {
                              snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
                              setTimeout( function (e) {
                                 snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
                                 setTimeout( function (e) {
                                    snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
                                    setTimeout( function (e) {
                                       snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
                                       setTimeout( function (e) {
                                          snailBait.bgVelocity = originalBgVelocity;
                                       }, SHAKE_INTERVAL);
                                    }, SHAKE_INTERVAL);
                                 }, SHAKE_INTERVAL);
                              }, SHAKE_INTERVAL);
                           }, SHAKE_INTERVAL);
                        }, SHAKE_INTERVAL);
                     }, SHAKE_INTERVAL);
                  }, SHAKE_INTERVAL);
               }, SHAKE_INTERVAL);
            }, SHAKE_INTERVAL);
         }, SHAKE_INTERVAL);
      }, SHAKE_INTERVAL);
   },

   showWinAnimation: function () {
      this.bgVelocity = 0;
      this.runnerAnimatedGIFElement.style.display = 'block';
      this.scoreElement.innerHTML = 'Winner!';
      this.runner.opacity = 0;
      this.startTransition();
      this.canvas.style.opacity = 0.1;

      setTimeout( function () {
         snailBait.runnerAnimatedGIFElement.style.opacity = 1.0;
      }, 50);

      setTimeout( function () {
         snailBait.runnerAnimatedGIFElement.style.opacity = 0;

         setTimeout( function () {
            snailBait.canvas.style.opacity = 1.0;
            snailBait.runnerAnimatedGIFElement.style.display = 'none';
            snailBait.scoreElement.innerHTML = snailBait.score;
            snailBait.runner.opacity = 1.0;
            snailBait.endTransition();
            snailBait.putSpriteOnTrack(snailBait.runner, 3);
            snailBait.reset();
            snailBait.checkHighScores();
         }, 2000);
      }, 4000);
   },

   // Sounds............................................................

   soundIsPlaying: function (sound) {
      return !sound.ended && sound.currentTime > 0;
   },

   playSound: function (sound) {
      var track, index;

      if (this.soundOn) {
         if (!this.soundIsPlaying(sound)) {
            sound.play();
         }
         else {
            for (i=0; index < this.audioTracks.length; ++index) {
               track = this.audioTracks[index];
            
               if (!this.soundIsPlaying(track)) {
                  track.src = sound.currentSrc;
                  track.load();
                  track.volume = sound.volume;
                  track.play();

                  break;
               }
            }
         }              
      }
   },

   // Gameplay..........................................................  

   begin: function () {
      this.initializeImages();
      this.initializeSoundAndMusic();
      this.createSprites();
      this.setTimeRate(1.0);
      this.equipRunner();
   },
  
   startAnimation: function () {
      if (snailBait.soundOn && snailBait.musicOn) {
         snailBait.playSound(snailBait.soundtrackElement);
      }
      snailBait.animate();
      snailBait.showSlowWarning = true;
   },

   startGame: function () {
      var GOOD_LUCK_PAUSE = 1000,
          GOOD_LUCK_DURATION = 2000,
          REVEAL_PAUSE = 2000,
          LOADING_PAUSE = 2000;

      if (this.skipIntro === true) {
         this.revealGame();
         this.startAnimation();
         return; 
      }

      setTimeout(function() {
         snailBait.hideLoadingScreen();

         setTimeout(function() {
            setTimeout(function() {
               snailBait.revealToast('Good Luck!', GOOD_LUCK_DURATION);
            }, GOOD_LUCK_PAUSE);

            snailBait.revealGame();
            snailBait.startAnimation();
         }, REVEAL_PAUSE);
      }, LOADING_PAUSE);
   },
   
   loseLife: function () {
      this.lives--;
      this.updateLivesElement();

      if (this.lives === 1) {
         snailBait.revealToast('Last chance!');
      }

      if (snailBait.serverAvailable) {
         snailBait.serverSocket.emit('life lost', { left: snailBait.spriteOffset,
                                                    top: snailBait.runner.top });
      }

      if (this.lives === 0) {
         this.gameOver();
      }
   },

   gameOver: function (wonGame) {
      snailBait.revealToast('Game Over');

      if (snailBait.serverAvailable) {
         setTimeout( function () {
            snailBait.checkHighScores();
         }, snailBait.DEFAULT_TOAST_TIME);
      }
      else {
         if (!wonGame) {
            snailBait.revealCredits();
         }
      }
      
      snailBait.startTransition();
   },

   reset: function () {
      var CANVAS_TRANSITION_DURATION = 2000,
          REVEAL_RUNNER_DURATION = 1000,
          CONTINUE_RUNNING_DURATION = 500;

      snailBait.runner.exploding = false; 
      snailBait.runner.visible = false;
      snailBait.runner.artist.cells = snailBait.runnerCellsRight;

      if (snailBait.runner.jumping) { snailBait.runner.stopJumping(); }
      if (snailBait.runner.falling) { snailBait.runner.stopFalling(); }

      snailBait.startTransition();     // Turns off some processing
      snailBait.canvas.style.opacity = 0; // Triggers CSS transition

      setTimeout( function () {
         snailBait.backgroundOffset = snailBait.STARTING_BACKGROUND_OFFSET;
         snailBait.spriteOffset = snailBait.STARTING_BACKGROUND_OFFSET;
         snailBait.bgVelocity = snailBait.STARTING_BACKGROUND_VELOCITY;

         for (var i=0; i < snailBait.sprites.length; ++i) { 
            snailBait.sprites[i].visible = true;
         }

         snailBait.canvas.style.opacity = 1.0; // Trigger CSS transition

         setTimeout( function () {
            snailBait.runner.visible = true;

            setTimeout( function () {
               snailBait.runner.runAnimationRate = 0; // stop running
               snailBait.endTransition();
            }, CONTINUE_RUNNING_DURATION);
         }, REVEAL_RUNNER_DURATION);
      }, CANVAS_TRANSITION_DURATION);
   },

   startTransition: function () {
      var TRANSITION_TIME_RATE = 0.2;

      this.transitioning = true;
      this.setTimeRate(TRANSITION_TIME_RATE);
   },

   endTransition: function () {
      this.transitioning = false;
      this.setTimeRate(1.0);
   },

   restartGame: function () {
      this.lives = this.MAX_NUMBER_OF_LIVES;
      this.updateLivesElement();

      this.creditsElement.style.opacity = 0;

      setTimeout( function () {
         snailBait.creditsElement.style.display = 'none';
         snailBait.endTransition();
      }, snailBait.CANVAS_TRANSITION_DURATION);

      this.score = 0;
      this.updateScoreElement();
   },
    
   // User interface....................................................  

   revealGame: function () {
      this.canvas.style.display = 'block';

      this.scoreElement.style.display = 'block';
      this.instructionsElement.style.display = 'block';
      this.soundAndMusicElement.style.display = 'block';
      this.copyrightElement.style.display = 'block';
      this.livesElement.style.display = 'block';

      setTimeout(function() {
         snailBait.canvas.style.opacity = 1.0;
         snailBait.scoreElement.style.opacity = 1.0;
         snailBait.instructionsElement.style.opacity = 1.0;
         snailBait.soundAndMusicElement.style.opacity = 1.0;
         snailBait.copyrightElement.style.opacity = 1.0;
         snailBait.livesElement.style.opacity = 1.0;

         snailBait.revealLivesIcons();
      }, snailBait.SHORT_DELAY);
   },

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
   
   updateLivesElement: function () {
      if (this.lives === 3) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 1.0;
         this.lifeIconRight.style.opacity  = 1.0;
      }
      else if (this.lives === 2) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 1.0;
         this.lifeIconRight.style.opacity  = 0;
      }
      else if (this.lives === 1) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 0;
         this.lifeIconRight.style.opacity  = 0;
      }
      else if (this.lives === 0) {
         this.lifeIconLeft.style.opacity   = 0;
         this.lifeIconMiddle.style.opacity = 0;
         this.lifeIconRight.style.opacity  = 0;
      }
   },

   updateScoreElement: function () {
      this.scoreElement.innerHTML = this.score;
   },

   revealInstructions: function () {
      this.instructionsElement.style.display = 'block';
      this.copyrightElement.style.display = 'block';
      this.soundAndMusicElement.style.display = 'block';

      setTimeout( function (e) {
         snailBait.instructionsElement.style.opacity = 1.0;
         snailBait.copyrightElement.style.opacity = 1.0;
         snailBait.soundAndMusicElement.style.opacity = 1.0;
      }, snailBait.SHORT_DELAY);
   },

   revealLivesIcons: function () {
      var LIVES_ICON_REVEAL_DELAY = 2000;

      setTimeout( function (e) {
         snailBait.lifeIconLeft.style.opacity = 1.0;
         snailBait.lifeIconRight.style.opacity = 1.0;
         snailBait.lifeIconMiddle.style.instructions = 1.0;
      }, LIVES_ICON_REVEAL_DELAY);
   },
   
   revealCredits: function () {
      this.creditsElement.style.display = 'block';

      setTimeout( function (e) {
         snailBait.creditsElement.style.opacity = 1.0;
         snailBait.revealLivesIcons();
      }, this.SHORT_DELAY);
   
      this.tweetElement.href = TWEET_PREAMBLE + this.score + TWEET_PROLOGUE;
   },

   revealDeveloperBackdoor: function () {
      this.developerBackdoorElement.style.display = 'inline';

      snailBait.runningSlowlySlider.appendTo('running-slowly-slider');
      snailBait.timeFactorSlider.appendTo('time-rate-slider');

      snailBait.runningSlowlySlider.draw(
         snailBait.runningSlowlyThreshold / 
         snailBait.MAX_RUNNING_SLOWLY_THRESHOLD
      );

      snailBait.timeFactorSlider.draw(
         snailBait.timeFactor / snailBait.MAX_TIME_FACTOR
      );

      snailBait.developerBackdoorElement.style.opacity = 1.0;   

      snailBait.developerBackdoorVisible = true;
      snailBait.canvas.style.cursor = 'move';

      snailBait.timeFactorReadoutElement.innerText = 
         (snailBait.timeFactor * 100).toFixed(0);

      snailBait.runningSlowlyReadoutElement.innerText = 
         (snailBait.runningSlowlyThreshold / 
          snailBait.MAX_RUNNING_SLOWLY_THRESHOLD *
          snailBait.MAX_RUNNING_SLOWLY_THRESHOLD).toFixed(0);

      snailBait.developerBackdoorVisible = true;
   },

   dimControls: function () {
      var DIM = 0.5;
          INSTRUCTIONS_DIMMING_DELAY = 5000, 
          instructionsElement  = document.getElementById('instructions');
      
      setTimeout( function (e) {
         instructionsElement.style.opacity = DIM;
         snailBait.soundAndMusicElement.style.opacity = DIM;
      }, INSTRUCTIONS_DIMMING_DELAY);
   },

   hideLoadingScreen: function () {
      document.getElementById('loading').style.opacity = 0;
   },

   // On the server.....................................................  
   
   revealHighScores: function () {
      var HIGH_SCORES_REVEAL_DELAY = 2000;

      this.highScoreElement.style.display = 'block';
      this.highScoreNameElement.focus();
      this.highScoresVisible = true;

      setTimeout( function () {
         snailBait.highScoreElement.style.opacity = 1.0;
      }, HIGH_SCORES_REVEAL_DELAY);
   },

   hideHighScores: function () {
      snailBait.highScoreElement.style.opacity = 0;

      setTimeout( function () {
         snailBait.highScoreElement.style.display = 'none';
         snailBait.highScoresVisible = false;
      }, snailBait.HIGH_SCORE_TRANSITION_DURATION);
   },

   checkHighScores: function () {
      this.serverSocket.emit('get high score'); // See event handlers below
   }
};

// SnailBait instance..................................................

var snailBait = new SnailBait();

// Event handlers.......................................................

window.onkeydown = function (e) {
   var key = e.keyCode;

   if (snailBait.transitioning     || 
       snailBait.runner.exploding  || 
       snailBait.highScoresVisible ||
       key === 17) {
      // 17 is CTRL
      return;
   }

   if (key === 87) { // w for win
      snailBait.showWinAnimation();
   }

   if (key === 68 && e.ctrlKey) { // CTRL-d
      if (!snailBait.developerBackdoorVisible) {
         snailBait.revealDeveloperBackdoor();

         snailBait.rulerCanvas.style.display = 'inline';
         setTimeout( function () {
            snailBait.rulerCanvas.style.opacity = 1.0;
         }, 500);
      }
      else {
         snailBait.developerBackdoorElement.style.opacity = 0;   
         snailBait.developerBackdoorVisible = false;

         snailBait.rulerCanvas.style.display = 'none';
         setTimeout( function () {
            snailBait.rulerCanvas.style.opacity = 0;
         }, 500);
      }
      return;
   }

   if (key === 80 || (snailBait.paused && key !== 80 &&
                      !snailBait.developerBackdoorVisible)) {  // 'p'
      snailBait.togglePaused();

      if (snailBait.paused) {
         snailBait.revealToast('paused', 500);
      }
   }   

   if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k'or right arrow
      snailBait.turnRight();
   }
   else if (key === 74) { // 'j'
      if (!snailBait.runner.jumping && !snailBait.runner.falling) {
         snailBait.runner.jump();
      }
   }
   else if (key === 70) { // 'f'
      if (!snailBait.runner.jumping && !snailBait.runner.falling) {
         snailBait.runner.jump();
      }
   }
   else if (key === 83) { // 's'
      if (!snailBait.stalled) {
         snailBait.bgVelocityBeforeStall = snailBait.bgVelocity;
         snailBait.bgVelocity = 0;
         snailBait.revealToast('stalled', 500);
      }
      else {
         snailBait.bgVelocity = snailBait.bgVelocityBeforeStall;
      }
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

// On the server.......................................................

// Try to set up the server socket. If the server is not running, or
// is otherwise unavailable, the browser throws an error.

try {
   // Receive the current high score from the server. Corresponding 
   // socket emit: 'get high score' in snailBait.checkHighScores().

   snailBait.serverSocket.on('high score', function (data) { 
      // data is the current high score

      if (snailBait.score > data.score) {
         snailBait.serverSocket.emit('get high scores');
         snailBait.highScorePending = true;
      }
      else {
         snailBait.revealCredits();
      }
   });

   // Receive high scores from the server. Corresponding socket emit:
   // 'get high scores' from either the preceding method or the 
   // next method.

   snailBait.serverSocket.on('high scores', function (data) { 
      // data contains all high scores
      
      snailBait.highScoreListElement.innerHTML = data.scores;
      snailBait.revealHighScores();
   });

   // Notification that the high score has been set on the server. 
   // Corresponding socket emit: None. The server emits this
   // after it sets the high score.

   snailBait.serverSocket.on('high score set', function (data) {
      // data is the high score that was just set on the server

      snailBait.serverSocket.emit('get high scores'); // redisplay scores
   });
}
catch(err) {
   // server is unavailable
}

// Sound and music controls............................................

snailBait.soundCheckboxElement.onchange = function (e) {
   snailBait.soundOn = snailBait.soundCheckboxElement.checked;
};

snailBait.musicCheckboxElement.onchange = function (e) {
   snailBait.musicOn = snailBait.musicCheckboxElement.checked;

   if (snailBait.musicOn) {
      snailBait.soundtrackElement.play();
   }
   else {
      snailBait.soundtrackElement.pause();
   }
};

// SnailBait event handlers............................................

snailBait.newGameLink.onclick = function (e) {
   snailBait.restartGame();
};

snailBait.runnerAnimatedGIFElement.onload = function () {
   if (snailBait.skipIntro) {
      return;
   }

   snailBait.runnerAnimatedGIFElement.style.display = 'block';
   snailBait.loadingTitleElement.style.display = 'block';

   setTimeout( function () {
      snailBait.loadingTitleElement.style.opacity = 1.0;
      snailBait.runnerAnimatedGIFElement.style.opacity = 1.0;
   }, snailBait.SHORT_DELAY)
};

snailBait.slowlyDontShowElement.onclick = function (e) {
   snailBait.runningSlowlyElement.style.opacity = 0;
   snailBait.showSlowWarning = false;
};

snailBait.slowlyOkayElement.onclick = function (e) {
   snailBait.runningSlowlyElement.style.opacity = 0;
   snailBait.speedSamples = [60,60,60,60,60,60,60,60,60,60]; // reset
};

// Developer backdoor event handlers...................................

snailBait.smokingHolesCheckboxElement.onchange = function (e) {
   snailBait.showSmokingHoles = 
      snailBait.smokingHolesCheckboxElement.checked;
};

snailBait.detectRunningSlowlyCheckboxElement.onchange = function (e) {
   snailBait.showSlowWarning = 
      snailBait.detectRunningSlowlyCheckboxElement.checked;
};

snailBait.collisionRectanglesCheckboxElement.onchange = function (e) {
   var show = snailBait.collisionRectanglesCheckboxElement.checked;

   for (var i=0; i < snailBait.sprites.length; ++i) {
      snailBait.sprites[i].drawCollisionRectangle = show;
   }
   if (snailBait.paused) {
      snailBait.draw(snailBait.pauseStartTime);
   }
   else {
      snailBait.draw(snailBait.timeSystem.calculateGameTime());
   }
};

snailBait.timeFactorSlider.addChangeListener(function (e) {
   if (snailBait.timeFactorSlider.knobPercent < 0.01) {
      snailBait.timeFactorSlider.knobPercent = 0.01;
   }

   snailBait.setTimeRate(snailBait.timeFactorSlider.knobPercent * 
                        (snailBait.MAX_TIME_FACTOR));
});

snailBait.runningSlowlySlider.addChangeListener(function (e) {
   snailBait.runningSlowlyThreshold =
      (snailBait.runningSlowlySlider.knobPercent *
         snailBait.MAX_RUNNING_SLOWLY_THRESHOLD).toFixed(0);

   snailBait.runningSlowlyReadoutElement.innerHTML =
       (snailBait.runningSlowlySlider.knobPercent * 
        snailBait.MAX_RUNNING_SLOWLY_THRESHOLD).toFixed(0);
});

// High scores.........................................................

snailBait.highScoreNameElement.onkeypress = function () {
   if (snailBait.highScorePending) {
      snailBait.highScoreAddScoreElement.disabled = false;
      snailBait.highScorePending = false;
   }
};

snailBait.highScoreAddScoreElement.onclick = function () {
   snailBait.highScoreAddScoreElement.disabled = true;

   snailBait.serverSocket.emit('set high score', {
      name: snailBait.highScoreNameElement.value,
      score: snailBait.score
   });
};

snailBait.highScoreNewGameElement.onkeypress = function () {
   snailBait.restartGame();   
};

snailBait.highScoreNewGameElement.onclick = function () {
   snailBait.restartGame();
   snailBait.hideHighScores();
}

// -----------------------------------------------------------------------------
// ------------------ DRAG AND DROP FOR DEVELOPER BACKDOOR --------------------- 
// -----------------------------------------------------------------------------

snailBait.canvas.onmousedown = function (e) {
   if (snailBait.developerBackdoorVisible) {
      snailBait.dragging = true;

      snailBait.mousedown = snailBait.windowToCanvas(e.clientX, e.clientY);

      snailBait.backgroundOffsetWhenDraggingStarted = snailBait.backgroundOffset;
      snailBait.spriteOffsetWhenDraggingStarted = snailBait.spriteOffset;
      snailBait.runner.visible = false;

      if (snailBait.mousedown.x > snailBait.runner.left &&
          snailBait.mousedown.x <
          snailBait.runner.left + snailBait.runner.width) {
         if (snailBait.mousedown.y > snailBait.runner.top &&
             snailBait.mousedown.y <
             snailBait.runner.top + snailBait.runner.height) {
            snailBait.draggingRunner = true;
            snailBait.runner.visible = true;
         }
      }

      setTimeout( function () {
         snailBait.rulerCanvas.style.opacity = 1.0;

      }, snailBait.SHORT_DELAY);

      e.preventDefault();
   }
};

snailBait.canvas.onmousemove = function (e) {
   var mousemove = snailBait.windowToCanvas(e.clientX, e.clientY),
       deltaX;

   if (snailBait.developerBackdoorVisible && snailBait.dragging) {
      deltaX = mousemove.x - snailBait.mousedown.x;

      if (snailBait.draggingRunner) {
         snailBait.runner.left = mousemove.x;
         snailBait.runner.top = mousemove.y;
      }
      else {
         snailBait.backgroundOffset =
            snailBait.backgroundOffsetWhenDraggingStarted - deltaX;

         snailBait.spriteOffset =
            snailBait.spriteOffsetWhenDraggingStarted - deltaX;

         if (snailBait.backgroundOffset < 0 ||  
             snailBait.backgroundOffset > snailBait.BACKGROUND_WIDTH) {
            snailBait.backgroundOffset = 0;
         }

         snailBait.backgroundOffsetReadout.innerHTML = 
            snailBait.spriteOffset.toFixed(0);

         e.preventDefault();
      }
   }
};

window.onmouseup = function (e) {
   if (snailBait.developerBackdoorVisible) {
      snailBait.dragging = false;
      snailBait.runner.visible = true;
      snailBait.draggingRunner = false;
      snailBait.backgroundOffsetReadout.innerHTML = '';

      e.preventDefault();
   }
};

snailBait.checkRuntimeFlags();
snailBait.dimControls();
snailBait.begin();
