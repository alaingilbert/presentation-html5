/**
 * This is the game engine.
 */
var Game = {
   canvas:      null,
   ctx:         null,
   interval:    null,
   itemTimeout: null,
   player:      null,                          // Player object
   opponent:    null,                          // Opponent object
   ball:        null,                          // Ball object
   lastFrame:   null,                          // The timestamp of the last frame.
   fps:         60,                            // Frames per second
   items:       [],

   states:      { game: 0, win: 1, loose: 2 }, // All the states available.
   state:       null,                          // The current game state.


   /**
    * Generate a random item.
    */
   generateItem: function () {
      var self = this;

      if (this.itemTimeout) { clearTimeout(this.itemTimeout); }
      this.itemTimeout = null;

      var rnd = Math.floor(Math.random() * 2);
      switch (rnd) {
         case 0: var item = new EnlargeItem(); break;
         case 1: var item = new ReduceItem(); break;
      }
      this.items.push(item);

      var next = Math.random() * 10000 + 5000;
      this.itemTimeout = setTimeout(function () { self.generateItem(); }, next);
   },


   /**
    * This is triggered when the player loose.
    */
   loose: function () {
      clearInterval(this.interval);
      clearTimeout(this.itemTimeout);
      this.state = this.states.loose;
      this.opponent.points++;
      document.getElementById('computerPts').innerText = this.opponent.points;
   },


   /**
    * This is triggered when the player win.
    */
   win: function () {
      clearInterval(this.interval);
      clearTimeout(this.itemTimeout);
      this.state = this.states.win;
      this.player.points++;
      document.getElementById('playerPts').innerText = this.player.points;
   },


   /**
    * Update every objects.
    */
   update: function() {
      switch (this.state) {
         case this.states.game:
            // Update all the items.
            for (var i=0, len=this.items.length; i<len; i++) {
               var item = this.items[i];
               item.update();
               // Collision with the player
               if (item.y + item.height > this.player.y &&
                   item.y < this.player.y + this.player.height &&
                   item.x + item.width >= this.player.x) {

                  switch (item.type) {
                     case 'enlarge':
                        this.player.height += 20;
                        break;
                     case 'reduce':
                        this.player.height -= 20;
                        break;
                  }
                  this.items.splice(i, 1);
                  continue;
               }

               // Collision with the opponent
               if (item.y + item.height > this.opponent.y &&
                   item.y < this.opponent.y + this.opponent.height &&
                   item.x <= this.opponent.x + this.opponent.width) {

                  switch (item.type) {
                     case 'enlarge':
                        this.opponent.height += 20;
                        break;
                     case 'reduce':
                        this.opponent.height -= 20;
                        break;
                  }
                  this.items.splice(i, 1);
                  continue;
               }

               // If it get out of the board.
               if (item.x > this.canvas.width || item.x + item.width < 0) {
                  this.items.splice(i, 1);
                  continue;
               }
            }
            this.ball.update();
            this.player.update();
            this.opponent.update();

            // Collision with the player
            if (this.ball.y + this.ball.radius > this.player.y &&
                this.ball.y < this.player.y + this.player.height &&
                this.ball.x + this.ball.radius >= this.player.x) {

               this.ball.x = this.player.x - this.ball.radius;
               this.ball.angle      = -this.ball.angle;

               this.ball.velocity += 10;
               document.getElementById('ballVelocity').innerText = this.ball.velocity;
            }

            // Collision with the opponent
            if (this.ball.y + this.ball.radius > this.opponent.y &&
                this.ball.y < this.opponent.y + this.opponent.height &&
                this.ball.x <= this.opponent.x + this.opponent.width) {

               this.ball.x = this.opponent.x + this.opponent.width;
               this.ball.angle      = -this.ball.angle;

               this.ball.velocity += 10;
               document.getElementById('ballVelocity').innerText = this.ball.velocity;
            }

            // Collision with the environment
            if (this.ball.y + this.ball.radius >= this.canvas.height) {
               this.ball.y = this.canvas.height - this.ball.radius;
               this.ball.angle      = Math.PI - this.ball.angle;
            } else if (this.ball.y <= 0) {
               this.ball.y = 0;
               this.ball.angle      = Math.PI - this.ball.angle;
            }

            if (this.ball.x > this.canvas.width - 10) {
               // Make sure that the ball didn't jump over the player (between the two frames)
               //var dx = this.ball.x - (this.canvas.width - 10 - this.ball.radius);
               //var y  = -Math.tan(this.ball.angle) * dx;
               //var oldX = this.ball.x - dx;
               //var oldY = this.ball.y + y;

               //if (oldY + this.ball.radius > this.player.y &&
               //    oldY < this.player.y + this.player.height &&
               //    oldX + this.ball.radius >= this.player.x) {

               //   this.ball.x = oldX - this.ball.radius;
               //   this.ball.angle      = -this.ball.angle;
               //} else {

                  // The player has lost.
                  this.loose();
               //}
            } else if (this.ball.x < 10) {

               // The player has won.
               this.win();
            }
            this.lastFrame = new Date();
            break;


         case this.states.win:
            break;


         case this.states.loose:
            break;
      }
   },


   /**
    * Paint every objects.
    */
   paint: function () {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw the board
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width/2, 0);
      this.ctx.lineTo(this.canvas.width/2, this.canvas.height);
      this.ctx.closePath();
      this.ctx.strokeStyle = '#ccc';
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(this.canvas.width/2, this.canvas.height/2, 150, 0, 2*Math.PI);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.restore();

      switch (this.state) {
         case this.states.game:
            for (var i=0, len=this.items.length; i<len; i++) {
               var item = this.items[i];
               item.paint();
            }
            this.ball.paint();
            this.player.paint();
            this.opponent.paint();
            break;


         case this.states.win:
            this.ball.paint();
            this.player.paint();
            this.opponent.paint();

            this.ctx.save();
            this.ctx.font      = '50px Arial';
            this.ctx.baseLine  = 'bottom';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'green';
            this.ctx.fillText('You win !', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font      = '25px Arial';
            this.ctx.fillText('(Click to continue)', this.canvas.width/2, this.canvas.height/2 + 50);
            this.ctx.restore();
            break;


         case this.states.loose:
            this.ball.paint();
            this.player.paint();
            this.opponent.paint();

            this.ctx.save();
            this.ctx.font      = '50px Arial';
            this.ctx.baseLine  = 'bottom';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillText('You loose !', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font      = '25px Arial';
            this.ctx.fillText('(Click to continue)', this.canvas.width/2, this.canvas.height/2 + 50);
            this.ctx.restore();
            break;
      }

      // Draw a border
      this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
   },


   /**
    * This is the game loop.
    */
   cycle: function () {
      this.update();
      this.paint();
   },


   /**
    * Initialize all the objects.
    */
   init: function () {
      var self          = this;
      this.canvas       = document.getElementById('canvas');
      this.ctx          = canvas.getContext('2d');
      this.player       = new Player();
      this.opponent     = new Opponent();
      this.ball         = new Ball();
      this.lastFrame    = new Date();
      this.state        = this.states.game;
      this.interval     = setInterval(function () { self.cycle(); }, 1000 / this.fps);
      this.itemTimeout  = setTimeout(function () { self.generateItem(); }, Math.random() * 1000);
   }
};


/**
 * Handle the keyDown event.
 */
function onKeyDown(evt) {
   switch (evt.keyCode) {
      case 38:
         Game.player.direction = 'up';
         Game.player.move = true;
         break;
      case 40:
         Game.player.direction = 'down';
         Game.player.move = true;
         break;
   }
}


/**
 * Handle the keyUp event.
 */
function onKeyUp(evt) {
   if (Game.player.move) {
      switch (evt.keyCode) {
         case 38:
         case 40:
            if (Game.player.direction == 'up' && evt.keyCode == 38) {
               Game.player.move = false;
            } else if (Game.player.direction == 'down' && evt.keyCode == 40) {
               Game.player.move = false;
            }
            break;
      }
   }
}


/**
 * Handle the canvas click event.
 */
function onClick(ect) {
   if (Game.state != Game.states.game) {
      Game.player.y        = (Game.canvas.height - Game.player.height) / 2
      Game.player.height   = 100;
      Game.opponent.y      = (Game.canvas.height - Game.opponent.height) / 2
      Game.opponent.height = 100;
      Game.lastFrame       = new Date();
      clearTimeout(Game.itemTimeout);
      Game.items           = [];
      Game.interval        = setInterval(function () { Game.cycle(); }, 1000 / Game.fps);
      Game.itemTimeout     = setTimeout(function () { Game.generateItem(); }, Math.random() * 5000);
      Game.state           = Game.states.game;
      Game.ball            = new Ball();
      document.getElementById('ballVelocity').innerText = Game.ball.velocity;
   }
}


/**
 * When the DOM is ready, it start everything.
 */
document.addEventListener('DOMContentLoaded', function () {
   document.addEventListener('keydown', onKeyDown, false);
   document.addEventListener('keyup', onKeyUp, false);
   document.getElementById('canvas').addEventListener('click', onClick, false);
   Game.init();
}, false);
