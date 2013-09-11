var canvas = document.getElementById('game-canvas'),
   context = canvas.getContext('2d'),
   fpsElement = document.getElementById('fps'),

   // Time..............................................................
   
   lastAnimationFrameTime = 0,
   lastFpsUpdateTime = 0,
   fps = 60,

   // Constants............................................................

   PLATFORM_HEIGHT = 8,  
   PLATFORM_STROKE_WIDTH = 2,
   PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',  // black

   STARTING_RUNNER_LEFT = 50,
   STARTING_RUNNER_TRACK = 1,

   // Track baselines...................................................

   TRACK_1_BASELINE = 323,
   TRACK_2_BASELINE = 223,
   TRACK_3_BASELINE = 123,

   // Images............................................................
   
   background  = new Image(),
   runnerImage = new Image(),

   // Platforms.........................................................

   platformData = [  // One screen for now
      // Screen 1.......................................................
      {
         left:      10,
         width:     230,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,250,0)',
         opacity:   0.5,
         track:     1,
         pulsate:   false,
      },

      {  left:      250,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      633,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,250,0)',
         opacity:   1.0, 
         track:     1,
         pulsate:   false,
      },
   ];

// Launch game.........................................................

initializeImages();

function initializeImages() {
   background.src = '../../../images/background.png';
   runnerImage.src = '../../../images/runner.png';

   background.onload = function (e) {
      startGame();
   };
}

function startGame() {
   window.requestNextAnimationFrame(animate);
}
   
// Animation............................................................

function animate(now) { 
   fps = calculateFps(now); 
   draw();
   requestNextAnimationFrame(animate);
}

function calculateFps(now) {
   var fps = 1000 / (now - lastAnimationFrameTime);

   lastAnimationFrameTime = now;

   if (now - lastFpsUpdateTime > 1000) {
      lastFpsUpdateTime = now;
      fpsElement.innerHTML = fps.toFixed(0) + ' fps';
   }
   return fps; 
}

function draw() {
   drawBackground();
   drawPlatforms();
   drawRunner();
}

function drawBackground() {
   context.drawImage(background, 0, 0);
}

function drawPlatforms() {
   var data, 
       platformTop,
       index;

   context.save();
   
   for (index = 0; index < platformData.length; ++index) {
      data = platformData[index];
      platformTop = calculatePlatformTop(data.track);

      context.lineWidth = PLATFORM_STROKE_WIDTH;
      context.strokeStyle = PLATFORM_STROKE_STYLE;
      context.fillStyle = data.fillStyle;
      context.globalAlpha = data.opacity;

      context.strokeRect(data.left, platformTop, data.width, data.height);
      context.fillRect  (data.left, platformTop, data.width, data.height);
   }

   context.restore();
}

function calculatePlatformTop(track) {
   var top;

   if      (track === 1) { top = TRACK_1_BASELINE; } // 323
   else if (track === 2) { top = TRACK_2_BASELINE; } // 223
   else if (track === 3) { top = TRACK_3_BASELINE; } // 123

   return top;
}

function drawRunner() {
   context.drawImage(runnerImage,
      STARTING_RUNNER_LEFT,
      calculatePlatformTop(STARTING_RUNNER_TRACK) - runnerImage.height);
}
