var canvas;
var c;
var objs = new Array();

var state;
var stateTime;
var nbStates = 0;
var States = {};

var medias = {};

var interval;

//--- States Manager ----------------------------------------------------------
function addState(str) {
   States[str] = nbStates += 1;
}

function switchState(str, callback) {
   // TODO: Check if this loop is at good place.
   for (var i in objs) {
      objs[i].onClick = function() {};
      objs[i].onMouseOver = function() {};
      objs[i].onMouseOut = function() {};
   }
   state = str;
   stateTime = new Date();
   eval("if (typeof "+state+"_init == 'function') "+state+"_init()");
}

function getState() {
}

function dt() {
   return new Date() - stateTime;
}
//-----------------------------------------------------------------------------

function fw_paint() {
   c.clearRect(0, 0, canvas.width, canvas.height);
   eval("if (typeof "+state+"_paint == 'function') "+state+"_paint()");
   // TODO: Look if I really need it.
   //eval(state+"_paint();");

   for (var i in objs)
      objs[i].paint();
}

function fw_update() {
   eval("if (typeof "+state+"_update == 'function') "+state+"_update()");
   //eval(state+"_update();");

   for (var i in objs)
      objs[i].update();
}

function fw_cycle() {
   fw_update();
   fw_paint();
}

//--- Medias Manager ----------------------------------------------------------
function Loader() {
   this.pre_complete = function() {
      interval = setInterval(fw_cycle, 1000/30);
      this.complete();
   };

   this.loaded = this.total = 0;

   this.load = function(paths) {
      var loader = this;
      for (var i in paths) {
         if (typeof(paths[i]) != "string") continue;
         var name = paths[i].substring(0, paths[i].indexOf("."))
         this.total++;
         var fn = paths[i];
         medias[i] = new Image();
         medias[i].src = fn;
         medias[i].onload = function() {
            loader.loaded++;
            if (loader.loaded == loader.total)
               loader.pre_complete();
         };
      }
   };
}
//-----------------------------------------------------------------------------

function fw_init() {
   canvas = document.getElementById("canvas");
   c = canvas.getContext("2d");

   init();
}

window.addEventListener("load", fw_init, false);
