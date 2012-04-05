var Ball = function () {
   this.x        = 400;
   this.y        = 300;
   this.radius   = 20;
   this.velocity = 450;
   this.angle    = Math.random() * 2*Math.PI;
};


Ball.prototype.update = function () {
   var deltaTime = (new Date().getTime() - Game.lastFrame.getTime()) / 1000;
   this.x += Math.sin(this.angle) * this.velocity * deltaTime;
   this.y += Math.cos(this.angle) * this.velocity * deltaTime;
};


Ball.prototype.paint = function () {
   Game.ctx.save();

   //Game.ctx.beginPath();
   //Game.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
   //Game.ctx.closePath();
   //Game.ctx.fill();
   Game.ctx.fillStyle = '#000080';
   Game.ctx.fillRect(this.x, this.y, this.radius, this.radius);

   Game.ctx.restore();
};
