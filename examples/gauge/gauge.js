/**
 * Copyright 2011,2012 Alain Gilbert <alain.gilbert.15@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE. 
 */

var Gauge = function() {
   this.elemId      = arguments[0];
   var params       = arguments[1]       || {};
   this.needleColor = params.needleColor || 'black';
   this.gaugeColor  = params.gaugeColor  || 'lightblue';

   this.min         = params.min || 0;
   this.max         = params.max || 100;
   this.value       = params.val || 0;
   this.interval    = null;

   this.fromValue   = null;
   this.newValue    = null;
   this.callback    = null;

   this.bindElems   = [];

   this.canvas      = document.getElementById(this.elemId);
   this.width       = this.canvas.width;
   this.height      = this.canvas.height;
   this.ctx         = this.canvas.getContext('2d');
   this.paint();
};

Gauge.prototype.bind = function(elemId) {
   this.bindElems.push(document.getElementById(elemId));
};

Gauge.prototype.setValue = function(value, callback) {
   if (this.value == value) { return; }
   clearInterval(this.interval);
   this.fromValue = this.value;
   this.newValue  = value;
   this.startTime = new Date().getTime();
   this.callback  = callback;
   var self = this;
   this.interval = setInterval(function() {
      self.update();
      self.paint();
   }, 1000/60);
};

Gauge.prototype.update = function() {
   var duration = 2000;
   var effect = this.formulas['<>']( (new Date().getTime() - this.startTime) / duration )
   if (new Date().getTime() - this.startTime < duration) {
      this.value = ((this.newValue - this.fromValue) / duration) * (effect * duration) + this.fromValue;
      for (var i=0; i<this.bindElems.length; i++) {
         this.bindElems[i].innerHTML = Math.floor(this.value);
      }
   } else {
      this.value = this.newValue;
      for (var i=0; i<this.bindElems.length; i++) {
         this.bindElems[i].innerHTML = this.value;
      }
      clearInterval(this.interval);

      if (this.callback) {
         this.callback();
      }
   }
};

Gauge.prototype.paint = function() {
   this.ctx.clearRect(0, 0, this.width, this.height);

   // Draw background
   this.ctx.save();
   this.ctx.beginPath();
   this.ctx.translate(this.width/2, this.height);
   var angle = Math.atan(this.height/this.width);
   this.ctx.arc(0, 0, this.width/2, Math.PI+angle, -angle);
   this.ctx.arc(0, 0, this.width/2-45, -angle, Math.PI+angle, true);
   this.ctx.closePath();
   this.ctx.fillStyle = this.gaugeColor;
   this.ctx.fill();

   // Draw needle
   var minAngle = -Math.PI/2+angle;
   var maxAngle = minAngle + (Math.PI-(2*angle));
   var diff     = maxAngle - minAngle;
   var pct      = (this.value / this.max);

   this.ctx.rotate(pct * diff + minAngle);

   this.ctx.beginPath();
   this.ctx.moveTo(0, 0);
   this.ctx.lineTo(-5, -5);
   this.ctx.lineTo(0, -this.height);
   this.ctx.lineTo(5, -5);
   this.ctx.closePath();

   this.ctx.fillStyle = this.needleColor;
   this.ctx.fill();
   this.ctx.restore();
};


Gauge.prototype.formulas = {
   'linear': function(n) { return n; },
   '<': function(n) { return Math.pow(n, 3); },
   '>': function(n) { return Math.pow(n - 1, 3) + 1; },
   '<>': function(n) {
      n = n * 2;
      if (n < 1) {
         return Math.pow(n, 3) / 2;
      }
      n -= 2;
      return (Math.pow(n, 3) + 2) / 2;
   },
   backIn: function (n) {
      var s = 1.70158;
      return n * n * ((s + 1) * n - s);
   },
   backOut: function (n) {
      n = n - 1;
      var s = 1.70158;
      return n * n * ((s + 1) * n + s) + 1;
   },
   elastic: function (n) {
      if (n == 0 || n == 1) {
         return n;
      }
      var p = .3,
          s = p / 4;
      return Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
   },
   bounce: function (n) {
      var s = 7.5625,
         p = 2.75,
         l;
      if (n < (1 / p)) {
         l = s * n * n;
      } else {
         if (n < (2 / p)) {
            n -= (1.5 / p);
            l = s * n * n + .75;
         } else {
            if (n < (2.5 / p)) {
               n -= (2.25 / p);
               l = s * n * n + .9375;
            } else {
               n -= (2.625 / p);
               l = s * n * n + .984375;
            }
         }
      }
      return l;
   }
};
