var Item = function () {
   this.width     = 30;
   this.height    = 30;
   this.y         = Math.random() * (Game.canvas.height - this.height);
   this.x         = (Game.canvas.width - this.width ) / 2;
   this.velocity  = 200;
   this.color     = 'green';
   this.direction = Math.floor(Math.random() * 2) == 0 ? 'left' : 'right' ;
};


Item.prototype.paint = function () {
   Game.ctx.save();
   Game.ctx.fillStyle = this.color;
   Game.ctx.fillRect(this.x, this.y, this.width, this.height);
   Game.ctx.restore();
};

Item.prototype.update = function () {
   // Move the opponent.
   var deltaTime = (new Date().getTime() - Game.lastFrame.getTime()) / 1000;
   this.x += this.direction == 'left' ? -this.velocity * deltaTime : this.velocity * deltaTime;
};



var EnlargeItem = function () {
   Item.call(this);
   this.type  = 'enlarge';
};
EnlargeItem.prototype.__proto__ = Item.prototype;


var ReduceItem = function () {
   Item.call(this);
   this.color = 'red';
   this.type  = 'reduce';
};
ReduceItem.prototype.__proto__ = Item.prototype;
