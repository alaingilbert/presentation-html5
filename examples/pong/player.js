var Player = function () {
   this.position = { x: 790, y: 250 };
   this.x        = 790;
   this.y        = 250;
   this.width    = 10;
   this.height   = 100;
   this.velocity = 350;
   this.move     = false;
   this.diretion = null;
   this.points   = 0;
};


Player.prototype.update = function () {
   if (this.move) {
      // Move the player.
      var deltaTime = (new Date().getTime() - Game.lastFrame.getTime()) / 1000;
      this.y += this.direction == 'up' ? -this.velocity * deltaTime : this.velocity * deltaTime;

      // Make sure the player can't leave the board !
      if (this.y + this.height > Game.canvas.height) {
         this.y = Game.canvas.height - this.height;
      } else if (this.y < 0) {
         this.y = 0;
      }
   }
};


Player.prototype.paint = function () {
   Game.ctx.save();
   Game.ctx.fillRect(this.x, this.y, this.width, this.height);
   Game.ctx.restore();
};
