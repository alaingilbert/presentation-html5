HTMLElement.prototype.onMouseOver = function(e) { };
HTMLElement.prototype.onMouseOut = function(e) { };
HTMLElement.prototype.onMouseMove = function(e) { };
HTMLElement.prototype.onClick = function(e) { };
HTMLElement.prototype.onMouseDown = function(e) { };
HTMLElement.prototype.onMouseUp = function(e) { };
HTMLElement.prototype.onKeyDown = function(e) { };
HTMLElement.prototype.onKeyUp = function(e) { };
HTMLElement.prototype.onDblClick = function(e) { };
HTMLElement.prototype.init = function() { };

function bindKeys() {
   var overEl = false;
   canvas.onmousemove = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            if (!overEl && !objs[i].mouseOver) {
               objs[i].onMouseOver(pos);
               objs[i].mouseOver = true;

               overEl = true;

            }
            objs[i].onMouseMove(pos);
         } else {
            if (objs[i].mouseOver) {
               objs[i].onMouseOut(pos);
               objs[i].mouseOver = false;
               overEl = false;
            }
         }
      }

      this.onMouseMove(pos);
   };

   canvas.onmouseout = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i in objs) {
         if (objs[i].mouseOver) {
            objs[i].onMouseOut(pos);
            objs[i].mouseOver = false;
         }
      }

      this.onMouseOut(pos);
   };

   canvas.onclick = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onClick(pos);
            break;
         }
      }

      this.onClick(pos);
   };

   canvas.ondblclick = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onDblClick(pos);
            break;
         }
      }

      this.onDblClick(pos);
   };

   canvas.onmousedown = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      pos.button = e.button;

      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onMouseDown(pos);
            break;
         }
      }

      this.onMouseDown(pos);
   };

   canvas.onmouseup = function(e) {
      var pos = new Point(e.clientX - canvas.offsetLeft + getScroll().x, e.clientY - canvas.offsetTop + getScroll().y);
      for (i = objs.length-1; i >= 0; i--) {
         if (objs[i].isInside(pos)) {
            objs[i].onMouseUp(pos);
            break;
         }
      }

      this.onMouseUp(pos);
   };
}
