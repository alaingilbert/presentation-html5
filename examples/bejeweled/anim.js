/*
Copyright (c) 2010, ALAIN GILBERT.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by ALAIN GILBERT.
4. Neither the name of the ALAIN GILBERT nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY ALAIN GILBERT ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL ALAIN GILBERT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


function Obj() {
    objs.push(this);
}

var formulas = {
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

var animations = 0;
var finished = 0;
function animationsComplete() {
}

function Label(params) {
    Obj.call(this);
    this.x = params.x != undefined ? params.x : null;
    this.y = params.y != undefined ? params.y : null;
    this.text = params.text != undefined ? params.text : null;
    this.color = params.color != undefined ? params.color : '#000';
    this.init_textSize = params.textSize != undefined ? params.textSize : 10;
    this.textSize = params.textSize != undefined ? params.textSize : 10;
    this.font = params.font != undefined ? params.font : this.textSize+'px sans-serif';
    this.align = params.align != undefined ? params.align : 'start';
    this.baseline = params.baseline != undefined ? params.baseline : 'alphabetic';
    this.maxWidth = params.maxWidth != undefined ? params.maxWidth : null;
    this.alpha = (params.opacity != undefined) ? params.opacity : 1;
    this.angle = params.angle ? params.angle : 0;
    this.color = params.color ? params.color : "rgba(0, 0, 0, 1)";
    this.scale = 100;
    
    this.onUpdate = function() { };
    this.onPaint = function() {
        c.save();
        c.fillStyle = this.color;
        c.font = this.font;
        c.textAlign = this.align;
        c.textBaseline = this.baseline;
        c.fillStyle = "rgba(0, 0, 0, "+this.alpha+")";
        c.fillText(this.text, this.x, this.y, this.maxWidth);    
        c.restore();
    };

    this.paint = function() { this.onPaint(); };
    this.update = function() { this.onUpdate(); };
    this.isInside = function(point) { return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height; };
    
    this.animate = function(conf, callback) {
        animations++;

        conf.start = (conf.start != undefined) ? conf.start : 0;

        // Save the initial time.
        var time = dt()/1000 + conf.start;

        var from = new Point(this.x, this.y);
        from.alpha = this.alpha;
        from.width = this.width;
        from.height = this.height;
        from.scale = this.scale;
        from.angle = this.angle;

        var to = conf.to;

        // Indique that the animation is finished.
        var end = false;

        this.update = function() {
            if (dt()/1000 >= conf.start && !end) {
                if (conf.debug) {
                    console.log(from, to, conf);
                }
                if (dt()/1000 <= time+conf.duration) {
                    if (conf.to) {
                        var effect = formulas[conf.effect] ? formulas[conf.effect]((dt()/1000-time)/conf.duration) : formulas['linear']((dt()/1000-time)/conf.duration);
                        if (to.x - from.x != 0) {
                            this.x = ((to.x - from.x) / (conf.duration)) * (effect * conf.duration) + from.x;
                            this.y = ((to.y - from.y) / (to.x - from.x)) * this.x + (to.y - (((to.y - from.y) / (to.x - from.x)) * to.x));
                        } else {
                            this.y = ((to.y - from.y) / (conf.duration)) * (effect * conf.duration) + from.y;
                        }
                    }
                    if (conf.width) { this.width = ((conf.width - from.width) / conf.duration) * (dt()/1000-time) + from.width; }
                    if (conf.height) { this.height = ((conf.height - from.height) / conf.duration) * (dt()/1000-time) + from.height; }
                    if (conf.opacity != undefined) { this.alpha = ((conf.opacity - from.alpha) / conf.duration) * (dt()/1000-time) + from.alpha; }
                    if (conf.rotate) { this.angle = ((conf.rotate - from.angle) / conf.duration) * (dt()/1000-time) + from.angle; }
                    if (conf.scale != undefined) {
                        this.textSize = ((((conf.scale - from.scale) / conf.duration) * (dt()/1000-time) + from.scale) / 100) * this.init_textSize;
                        this.font = this.textSize+'px sans-serif';
                        this.height = ((((conf.scale - from.scale) / conf.duration) * (dt()/1000-time) + from.scale) / 100) * this.initHeight;
                        if (!conf.to) {
                            this.x = (from.x + this.initWidth / 2) - (this.width / 2);
                            this.y = (from.y + this.initHeight / 2) - (this.height / 2);
                        }
                    }
                } else {
                    end = true;

                    if (conf.to) {
                        this.x = to.x;
                        this.y = to.y;
                    }
                    if (conf.width) { this.width = conf.width; }
                    if (conf.height) { this.height = conf.height; }
                    if (conf.opacity != undefined) { this.alpha = conf.opacity; }
                    if (conf.rotate) { this.angle = conf.rotate; }
                    if (conf.scale != undefined) {
                        this.textSize = (conf.scale / 100) * this.init_textSize;
                        this.font = this.textSize+'px sans-serif';
                        this.width = (conf.scale / 100) * this.initWidth;
                        this.height = (conf.scale / 100) * this.initHeight;
                        if (!conf.to) {
                            this.x = (from.x + this.initWidth / 2) - (this.width / 2);
                            this.y = (from.y + this.initHeight / 2) - (this.height / 2);
                        }
                        this.scale = conf.scale;
                    }

                    finished++;
                    if (finished == animations) {
                        animationsComplete();
                    }

                    if (callback) { callback(); }
                }
            }
        };
    };
}

function Anim(params) {
    Obj.call(this);
    this.img = params.img ? params.img : null;
    this.x = params.x != undefined ? params.x : null;
    this.y = params.y != undefined ? params.y : null;
    this.initWidth = params.width ? params.width : this.img.width;
    this.initHeight = params.height ? params.height : this.img.height;
    this.width = params.width ? params.width : this.img.width;
    this.height = params.height ? params.height : this.img.height;
    this.alpha = (params.opacity != undefined) ? params.opacity : 1;
    this.start;
    this.stop;
    this.focus;
    this.mouseOver;
    this.angle = params.angle ? params.angle : 0;
    this.appearIn = params.appearIn ? params.appearIn : null;

    this.caliss;

    if (params.scale != undefined) {
        this.scale = params.scale;
        this.width = (params.scale / 100) * this.initWidth;
        this.height = (params.scale / 100) * this.initHeight;
    } else {
        this.scale = 100;
    }

    this.onMouseOver = function(e) { };
    this.onMouseOut = function(e) { };
    this.onMouseMove = function(e) { };
    this.onMouseDown = function(e) { };
    this.onMouseUp = function(e) { };
    this.onKeyDown = function(e) { };
    this.onKeyUp = function(e) { };
    this.onPaint = function() {
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
    this.onUpdate = function() { };
    this.onFocus = function() { };
    this.onClick = function(e) { };
    this.onDblClick = function(e) { };
    this.onDragStart = function() { };
    this.onDragDrop = function() { };
    this.created = dt()/1000;
    
    this.paint = function() {
        if (this.appearIn == null || dt()/1000 >= this.created+this.appearIn) {
           c.save();
           c.globalAlpha = this.alpha;
           c.translate(this.x + this.width/2, this.y + this.height/2);
           c.rotate(this.angle);
           c.translate(-(this.x + this.width/2), -(this.y + this.height/2));
           this.onPaint();
           c.restore();
        }
    };
    this.update = function() { this.onUpdate(); };
    this.isInside = function(point) { return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height; };

    this.animate = function(conf, callback) {
        animations++;

        conf.start = (conf.start != undefined) ? conf.start : 0;

        // Save the initial time.
        var time = dt()/1000 + conf.start;

        var from = new Point(this.x, this.y);
        from.alpha = this.alpha;
        from.width = this.width;
        from.height = this.height;
        from.scale = this.scale;
        from.angle = this.angle;

        var to = conf.to;

        // Indique that the animation is finished.
        var end = false;

        this.update = function() {
            if (dt()/1000 >= conf.start && !end) {
                if (conf.debug) {
                    console.log(from, to, conf);
                }
                if (dt()/1000 <= time+conf.duration) {
                    if (conf.to) {
                        var effect = formulas[conf.effect] ? formulas[conf.effect]((dt()/1000-time)/conf.duration) : formulas['linear']((dt()/1000-time)/conf.duration);
                        if (to.x - from.x != 0) {
                            this.x = ((to.x - from.x) / (conf.duration)) * (effect * conf.duration) + from.x;
                            this.y = ((to.y - from.y) / (to.x - from.x)) * this.x + (to.y - (((to.y - from.y) / (to.x - from.x)) * to.x));
                        } else {
                            this.y = ((to.y - from.y) / (conf.duration)) * (effect * conf.duration) + from.y;
                        }
                    }
                    if (conf.width) { this.width = ((conf.width - from.width) / conf.duration) * (dt()/1000-time) + from.width; }
                    if (conf.height) { this.height = ((conf.height - from.height) / conf.duration) * (dt()/1000-time) + from.height; }
                    if (conf.opacity != undefined) { this.alpha = ((conf.opacity - from.alpha) / conf.duration) * (dt()/1000-time) + from.alpha; }
                    if (conf.rotate) { this.angle = ((conf.rotate - from.angle) / conf.duration) * (dt()/1000-time) + from.angle; }
                    if (conf.scale != undefined) {
                        this.width = ((((conf.scale - from.scale) / conf.duration) * (dt()/1000-time) + from.scale) / 100) * this.initWidth;
                        this.height = ((((conf.scale - from.scale) / conf.duration) * (dt()/1000-time) + from.scale) / 100) * this.initHeight;
                        if (!conf.to) {
                            this.x = (from.x + from.width / 2) - (this.width / 2);
                            this.y = (from.y + from.height / 2) - (this.height / 2);
                        }
                        this.scale = ((conf.scale - from.scale) / conf.duration) * (dt()/1000-time) + from.scale;
                    }
                } else {
                    end = true;
                           
                    if (conf.to) {
                        this.x = to.x;
                        this.y = to.y;
                    }
                    if (conf.width) { this.width = conf.width; }
                    if (conf.height) { this.height = conf.height; }
                    if (conf.opacity != undefined) { this.alpha = conf.opacity; }
                    if (conf.rotate) { this.angle = conf.rotate; }
                    if (conf.scale != undefined) {
                        this.width = (conf.scale / 100) * this.initWidth;
                        this.height = (conf.scale / 100) * this.initHeight;
                        if (!conf.to) {
                            this.x = (from.x + from.width / 2) - (this.width / 2);
                            this.y = (from.y + from.height / 2) - (this.height / 2);
                        }
                        this.scale = conf.scale;
                    }

                    finished++;
                    if (finished == animations) {
                        animationsComplete();
                    }

                    if (callback) { callback(); }
                }
            }
        };


    };
}
