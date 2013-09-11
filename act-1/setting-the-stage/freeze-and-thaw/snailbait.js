// SnailBait constructor --------------------------------------------

var SnailBait =  function () {

    this.canvas = document.getElementById('game-canvas'),
    this.context = this.canvas.getContext('2d'),

   // HTML elements........................................................
   
   this.fpsElement = document.getElementById('fps'),
   this.toast = document.getElementById('toast'),

   // Constants.........................................................

   this.LEFT = 1,
   this.RIGHT = 2,

   this.BACKGROUND_VELOCITY = 42,

   this.PAUSED_CHECK_INTERVAL = 200,

   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   this.STARTING_RUNNER_LEFT = 50,
   this.STARTING_RUNNER_TRACK = 1,

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,
   
   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,

   this.STARTING_BACKGROUND_VELOCITY = 0,

   this.STARTING_PLATFORM_OFFSET = 0,
   this.STARTING_BACKGROUND_OFFSET = 0,

   // Images............................................................
   
   this.background  = new Image(),
   this.runnerImage = new Image(),

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,

   // Window has focus..................................................

   this.windowHasFocus = true,

   // Paused............................................................

   this.paused = false,

   // Fps indicator.....................................................
   
   this.fpsElement = document.getElementById('fps'),

   // Runner track......................................................

   this.runnerTrack = this.STARTING_RUNNER_TRACK,
   
   // Translation offsets...............................................
   
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
   this.platformOffset = this.STARTING_PLATFORM_OFFSET,

   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY,
   this.platformVelocity,

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
}

// SnailBait.prototype ----------------------------------------------------

SnailBait.prototype = {
   // Drawing..............................................................

   draw: function () {
      this.setPlatformVelocity();
      this.setOffsets();

      this.drawBackground();

      this.drawRunner();
      this.drawPlatforms();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER; 
   },

   setOffsets: function () {
      this.setBackgroundOffset();
      this.setPlatformOffset();
   },

   setBackgroundOffset: function () {
      var offset = this.backgroundOffset + this.bgVelocity/this.fps;

      if (offset > 0 && offset < this.background.width) {
         this.backgroundOffset = offset;
      }
      else {
         this.backgroundOffset = 0;
      }
   },

   setPlatformOffset: function () {
      this.platformOffset += this.platformVelocity/this.fps;

      if (this.platformOffset > 2*this.background.width) {
         this.turnLeft();
      }
      else if (this.platformOffset < 0) {
         this.turnRight();
      }
   },

   drawBackground: function () {
      this.context.translate(-this.backgroundOffset, 0);

      // Initially onscreen:
      this.context.drawImage(this.background, 0, 0);

      // Initially offscreen:
      this.context.drawImage(this.background, this.background.width, 0);

      this.context.translate(this.backgroundOffset, 0);
   },

   drawRunner: function () {
      this.context.drawImage(this.runnerImage,
                        this.STARTING_RUNNER_LEFT,
                        this.calculatePlatformTop(this.runnerTrack) - this.runnerImage.height);
   },

   drawPlatforms: function () {
      var pd, top;

      this.context.save();
      this.context.translate(-this.platformOffset, 0);
      
      for (var i=0; i < this.platformData.length; ++i) {
         pd = this.platformData[i];
         top = this.calculatePlatformTop(pd.track);

         this.context.lineWidth = this.PLATFORM_STROKE_WIDTH;
         this.context.strokeStyle = this.PLATFORM_STROKE_STYLE;
         this.context.fillStyle = pd.fillStyle;
         this.context.globalAlpha = pd.opacity;

         this.context.strokeRect(pd.left, top, pd.width, pd.height);
         this.context.fillRect  (pd.left, top, pd.width, pd.height);
      }
      this.context.restore();
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

   // ------------------------- INITIALIZATION ----------------------------

   initializeImages: function () {
      this.background.src = '../../../images/background.png';
      this.runnerImage.src = '../../../images/runner.png';

      this.background.onload = function (e) {
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

setTimeout( function (e) {
   snailBait.turnRight();
}, 1000);


