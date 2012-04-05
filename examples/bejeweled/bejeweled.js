var caseWidth = 50;
var cursor = { x: 0, y: 0 };
var selected = false;
var selectedEl = null;
var selectedCase = { x: -1, y: -1 };
var hintCase = { x: -1, y: -1 };
var show_hint = false;
var directions = {
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3
};
var points = 0;
var pointsBase = 10;
var lines = 0;
var cpt = 0;

var map = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];
var tmpMap = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];
var hori = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];
var vert = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

// Class gem.
function Gem(params) {
   Anim.call(this, params);
   this.to_destroy = false;
}

function genererMap() {
   var tmp;
   for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
         var succeed = false;
         while (!succeed) {
            tmp = Math.floor(Math.random()*7);
            succeed = true;
            if ((i > 1 && j > 1) && (
               (tmp == map[i][j-1] && tmp == map[i][j-2]) ||
               (tmp == map[i-1][j] && tmp == map[i-2][j]))) {
               succeed = false;
            } else if ((j > 1) && (tmp == map[i][j-1] && tmp == map[i][j-2])) {
               succeed = false;
            } else if ((i > 1) && (tmp == map[i-1][j] && tmp == map[i-2][j])) {
               succeed = false;
            }
         }
         map[i][j] = tmp;
         tmpMap[i][j] = new Gem({"img":medias[tmp], "x":rand(0, i*caseWidth), "y":rand(0, j*caseWidth), "opacity":0, "scale":230});
         tmpMap[i][j].animate({"start":randf(0, 2), "duration": randf(0.4, 0.7), "rotate":2*Math.PI, "to":new Point(i*caseWidth, j*caseWidth), "opacity":1, "scale":100});
      }
   }
}

//--- Drawing functions -------------------------------------------------------
function drawSelected() {
   if (selected) {
      c.save();
      c.fillStyle = 'rgba(255, 0, 0, 0.5)';
      c.fillRect(selectedCase.x*50, selectedCase.y*50, 50, 50);
      c.restore();
   }
}
function drawHint() {
   if (show_hint) {
      c.fillStyle = 'rgba(0, 0, 255, 0.3)';
      c.fillRect(hintCase.x * caseWidth+1, hintCase.y * caseWidth+1, caseWidth-1, caseWidth-1);
   }
}
function drawCursor() {
   c.save();
   c.strokeStyle = '#ff0000';
   c.lineWidth = 2;
   c.strokeRect(cursor.x*caseWidth+1.5, cursor.y*caseWidth+1.5, 48, 48);
   c.restore();
}
function drawBorder() {
   c.strokeRect(0.5, 0.5, canvas.width-0.5, canvas.height-0.5);
}

function drawBoard() {
   c.save();
   c.fillStyle = "#ddd";
   c.strokeStyle = "#aaa";
   for (var i=0; i<8; i++) {
      for (var j=0; j<8; j++) {
         c.fillRect(i*caseWidth, j*caseWidth, caseWidth, caseWidth);
         c.strokeRect(i*caseWidth+0.5, j*caseWidth+0.5, caseWidth, caseWidth);
      }
   }
   c.restore();

   c.save();
   var left_for_text = 420;
   // Draw title.
   c.fillStyle = '#000';
   c.font = '38px sans-serif';
   c.textAlign = 'left';
   c.textBaseline = 'top';
   c.fillText('Bejeweled', left_for_text, 10);

   // Draw points.
   c.font = '16px sans-serif';
   c.fillText('Points: '+points, left_for_text, 70);


   c.fillText('--------------------------', left_for_text, 120);

   c.fillText('i : Take a hint', left_for_text, 150);

   // Draw copyright.
   c.font = '16px sans-serif';
   c.textBaseline = 'bottom';
   c.fillText('--------------------------', left_for_text, canvas.height - 30);
   c.fillText('Made by Alain Gilbert', left_for_text, canvas.height - 10);
   c.restore();
}
//-----------------------------------------------------------------------------


//--- States ------------------------------------------------------------------
function splash_init() {
   var b1 = new Label({"text":"Game made by Alain Gilbert", "opacity":1, "baseline":"bottom", "align":"center", "font":"25px sans-serif", "x":canvas.width/2, "y":canvas.height/2});
   b1.animate({"duration":0.5, "opacity":0, "start":1.5});
   animationsComplete = function() {};
}

function splash_update() {
   if (dt() >= 2600)
      switchState("game");
}

function splash_paint() {
   drawBorder();
}
//-----------------------------------------------------------------------------
function pre_game_init() {
   genererMap();
   animationsComplete = function() {
      switchState("game");
   };
}
function pre_game_update() {
}
function pre_game_paint() {
   drawBoard();
   drawBorder();
}
//-----------------------------------------------------------------------------
function anim_init() {
   animationsComplete = function() {
      switchState("game");
   };
}
function anim_paint() {
   drawBoard();
   drawBorder();
}
//-----------------------------------------------------------------------------
function delete_init() {
   for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
         if (tmpMap[i][j].to_destroy) {
            tmpMap[i][j].animate({"duration":0.5, "scale":0, "opacity":0});
         }
      }
   }
   animationsComplete = function() {
      // LibÃ¨re la mÃ©moire.
      for (var i = 0; i < 8; i++)
         for (var j = 0; j < 8; j++)
            if (tmpMap[i][j].to_destroy)
               for (var k in objs)
                  if (objs[k] == tmpMap[i][j])
                     objs.splice(k, 1);

      // GÃ©nÃ¨re des nouvelles gems.
      for (var i = 0; i < 8; i++) {
         for (var j = 0; j < 8; j++) {
            if (tmpMap[i][j].to_destroy) {
               for (var aboveCase = j; aboveCase > 0; aboveCase--) {
                  map[i][aboveCase] = map[i][aboveCase-1];
                  tmpMap[i][aboveCase] = tmpMap[i][aboveCase-1];
               }
               var tmp = rand(0, 7);
               map[i][0] = tmp;
               tmpMap[i][0] = new Gem({"x":i*caseWidth, "y":Math.min(-caseWidth, tmpMap[i][1].y - caseWidth), "img":medias[tmp]});
            }
         }
      }

      switchState("fall");
   };
}
function delete_paint() {
   drawBoard();
   drawBorder();
}

function fall_init() {
   for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
         tmpMap[i][j].animate({"duration":0.7, "effect":"bounce", "to":new Point(i*caseWidth, j*caseWidth)});
      }
   }
   animationsComplete = function() {
      if (check())
         switchState("delete");
      else {
         if (!checkHint())
            switchState("gameover");
         else
            switchState("game");
      }
   };
}
function fall_paint() {
   drawBoard();
   drawBorder();
}


function swap_init() {
   var src = tmpMap[selectedCase.x][selectedCase.y];
   var dst = tmpMap[cursor.x][cursor.y];
   src.animate({"duration":0.3, "effect":"<>", "to":new Point(dst.x, dst.y)});
   dst.animate({"duration":0.3, "effect":"<>", "to":new Point(src.x, src.y)});
   animationsComplete = function() {
      switchState("delete");
   };
}
function swap_paint() {
   drawBoard();
   drawBorder();
}

function gameover_init() {
   var go = new Anim({"x":-401, "y":0, "width":401, "height":401});
   go.onPaint = function() {
      c.save();
      c.fillStyle = "rgba(150, 150, 150, 0.5)";
      c.fillRect(this.x, this.y, this.width, this.height);
      c.textBaseline = "middle";
      c.textAlign = "center";
      c.font = '60px sans-serif';
      c.fillStyle = "rgba(0, 0, 0, 0.7)";
      c.fillText("Game Over", this.x + 200, this.y+200);
      c.restore();
   };
   go.animate({"duration":1, "effect":">", "to":new Point(0, 0)});

   animationsComplete = function() {};
}
function gameover_paint() {
   drawBoard();
   drawBorder();
}
//-----------------------------------------------------------------------------

// TODO : Modify the code to merge testAlignment ans check.
function testAlignment(arr) {
    var succeed = false;
    var i, j;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            vert[i][j] = 0;
            hori[i][j] = 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (i < 7 && arr[i][j] == arr[i+1][j]) {
                hori[i][j]++;
                hori[i+1][j]++;
            }
            if (j < 7 && arr[i][j] == arr[i][j+1]) {
                vert[i][j]++; 
                vert[i][j+1]++; 
            }

            if (hori[i][j] >= 2 || vert[i][j] >= 2) {
                succeed = true;
            }
        }
    }

    return succeed;
}
function checkHint() {
   var x, y, tmp;
   var tmap = new Array();

   for (x = 0; x < 8; x++) {
      tmap[x] = new Array();
      for (y = 0; y < 8; y++) {
         tmap[x][y] = map[x][y];
      }
   }

    // Test each case of the map.
    for (y = 0; y < 8; y++) {
        for (x = 0; x < 8; x++) {

            if (x > 0) {
                tmp = tmap[x-1][y];
                tmap[x-1][y] = tmap[x][y];
                tmap[x][y] = tmp;
                if (testAlignment(tmap)) {
                    hintCase.x = x;
                    hintCase.y = y;
                    return true;
                } else {
                    tmp = tmap[x-1][y];
                    tmap[x-1][y] = tmap[x][y];
                    tmap[x][y] = tmp;
                }
            }

            
            if (x < 7) {
                tmp = tmap[x+1][y];
                tmap[x+1][y] = tmap[x][y];
                tmap[x][y] = tmp;
                if (testAlignment(tmap)) {
                    hintCase.x = x;
                    hintCase.y = y;
                    return true;
                } else {
                    tmp = tmap[x+1][y];
                    tmap[x+1][y] = tmap[x][y];
                    tmap[x][y] = tmp;
                }
            }


            if (y > 0) {
                tmp = tmap[x][y-1];
                tmap[x][y-1] = tmap[x][y];
                tmap[x][y] = tmp;
                if (testAlignment(tmap)) {
                    hintCase.x = x;
                    hintCase.y = y;
                    return true;
                } else {
                    tmp = tmap[x][y-1];
                    tmap[x][y-1] = tmap[x][y];
                    tmap[x][y] = tmp;
                }
            }


            if (y < 7) {
                tmp = tmap[x][y+1];
                tmap[x][y+1] = tmap[x][y];
                tmap[x][y] = tmp;
                if (testAlignment(tmap)) {
                    hintCase.x = x;
                    hintCase.y = y;
                    return true;
                } else {
                    tmp = tmap[x][y+1];
                    tmap[x][y+1] = tmap[x][y];
                    tmap[x][y] = tmp;
                }
            }

        }
    }

    hintCase.x = -1;
    hintCase.y = -1;
    return false;
}
function check() {
    var succeed = false;
    var i, j;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            vert[i][j] = 0;
            hori[i][j] = 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (i < 7 && map[i][j] == map[i+1][j]) {
                hori[i][j]++;
                hori[i+1][j]++;
            }
            if (j < 7 && map[i][j] == map[i][j+1]) {
                vert[i][j]++; 
                vert[i][j+1]++; 
            }

            if (hori[i][j] >= 2) {
                tmpMap[i-1][j].to_destroy = true;
                tmpMap[i][j].to_destroy = true;
                tmpMap[i+1][j].to_destroy = true;
                succeed = true;

                cpt++;
            } else if (vert[i][j] >= 2) {
                tmpMap[i][j-1].to_destroy = true;
                tmpMap[i][j].to_destroy = true;
                tmpMap[i][j+1].to_destroy = true;
                succeed = true;

                cpt++;
            }
        }
    }

   if (succeed) points += cpt * pointsBase;

    return succeed;
}
function move(src, dst) {
   var tmp = map[src.x][src.y];
   map[src.x][src.y] = map[dst.x][dst.y];
   map[dst.x][dst.y] = tmp;

   tmp = tmpMap[src.x][src.y];
   tmpMap[src.x][src.y] = tmpMap[dst.x][dst.y];
   tmpMap[dst.x][dst.y] = tmp;

   cpt = 0;
   if (!check()) {
      var tmp = map[src.x][src.y];
      map[src.x][src.y] = map[dst.x][dst.y];
      map[dst.x][dst.y] = tmp;

      tmp = tmpMap[src.x][src.y];
      tmpMap[src.x][src.y] = tmpMap[dst.x][dst.y];
      tmpMap[dst.x][dst.y] = tmp;
      return false;
   } else {
      show_hint = false;
   }
   switchState("swap");
   return true;
}
function game_init() {
   checkHint();

   canvas.onMouseDown = function(e) {
      if (state == "game") {
         if (e.button === 0) {
            var caseX = Math.floor(e.x / caseWidth); 
            var caseY = Math.floor(e.y / caseWidth); 
            if (caseX < 0 || caseX > 7 || caseY < 0 || caseY > 7) return false;
            cursor.x = caseX;
            cursor.y = caseY;
            // Select or move two cases.
            if (selected) {
               if ((cursor.x == selectedCase.x + 1 && selectedCase.y == cursor.y) ||      // Right case.
                  (cursor.x == selectedCase.x - 1 && selectedCase.y == cursor.y) ||       // Left case.
                  (cursor.x == selectedCase.x && cursor.y == selectedCase.y - 1) ||       // Top case.
                  (cursor.x == selectedCase.x && cursor.y == selectedCase.y + 1)) {       // Bottom case.
                  if (move(cursor, selectedCase)) {
                     selected = false;
                  } else {
                     selectedCase.x = cursor.x; 
                     selectedCase.y = cursor.y; 
                     selected = true;
                  }
               } else if (cursor.x == selectedCase.x && cursor.y == selectedCase.y) {      // If we select the same case.
                  selected = false;
               } else {                                                                    // If we select another case.
                  selectedCase.x = cursor.x; 
                  selectedCase.y = cursor.y; 
                  selected = true;
               }
            } else {
               selectedCase.x = cursor.x;
               selectedCase.y = cursor.y;
               selected = true;
            }
         }
      }
   };
   document.onkeydown = function(e) {
      if (state == "game") {
         switch (e.keyCode) {
            case 73: // I
               show_hint = true;
               break;
            case 32: // Space
               // Select or move two cases.
               if (selected) {
                  if  ((cursor.x == selectedCase.x + 1 && selectedCase.y == cursor.y) ||      // Right case.
                     (cursor.x == selectedCase.x - 1 && selectedCase.y == cursor.y) ||       // Left case.
                     (cursor.x == selectedCase.x && cursor.y == selectedCase.y - 1) ||       // Top case.
                     (cursor.x == selectedCase.x && cursor.y == selectedCase.y + 1)) {       // Bottom case.
                     if (move(cursor, selectedCase)) {
                        selected = false;
                     } else {
                        selectedCase.x = cursor.x; 
                        selectedCase.y = cursor.y; 
                        selected = true;
                     }
                  } else if (cursor.x == selectedCase.x && cursor.y == selectedCase.y) {      // If we select the same case.
                     selected = false;
                  } else {                                                                    // If we select another case.
                     selectedCase.x = cursor.x; 
                     selectedCase.y = cursor.y; 
                     selected = true;
                  }
               } else {
                  selectedCase.x = cursor.x;
                  selectedCase.y = cursor.y;
                  selected = true;
               }
               break;
            case 37: // Left
               if (cursor.x > 0) cursor.x--;
               break;
            case 38: // Top
               if (cursor.y > 0) cursor.y--;
               break;
            case 39: // Right
               if (cursor.x < 7) cursor.x++;
               break;
            case 40: // Bottom
               if (cursor.y < 7) cursor.y++;
               break;
            case 71:
               //switchState("gameover");
               break;
         }
      }
   };
}
function game_update() {
   if (dt() >= 10000) show_hint = true;
}
function game_paint() {
   drawBoard();
   drawHint();
   drawCursor();
   drawSelected();
   drawBorder();
}
//-----------------------------------------------------------------------------


function init() {
   var loader = new Loader();
   loader.load(["img/green.png", "img/white.png", "img/blue.png",
                "img/yellow.png", "img/orange.png", "img/purple.png",
                "img/red.png"]);

   loader.complete = function() {
      switchState("pre_game");
      bindKeys();
   };
}
