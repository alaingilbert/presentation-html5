var Opponent = function () {
   this.x        = 0;
   this.y        = 250;
   this.width    = 10;
   this.height   = 100;
   this.velocity = 350;
   this.move     = false;
   this.diretion = null;
   this.points   = 0;
};


Opponent.prototype.update = function () {

   // Decide where the opponent will move.
   if (Game.ball.y > this.y + this.height/2) {
      this.direction = 'down';
   } else {
      this.direction = 'up';
   }

   // Move the opponent.
   var deltaTime = (new Date().getTime() - Game.lastFrame.getTime()) / 1000;
   this.y += this.direction == 'up' ? -this.velocity * deltaTime : this.velocity * deltaTime;

   // Make sure the opponent can't leave the board !
   if (this.y + this.height > Game.canvas.height) {
      this.y = Game.canvas.height - this.height;
   } else if (this.y < 0) {
      this.y = 0;
   }
};


Opponent.prototype.paint = function () {
   Game.ctx.save();
   Game.ctx.fillRect(this.x, this.y, this.width, this.height);
   Game.ctx.restore();
};

