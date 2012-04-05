function rand(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function randf(min, max) {
   return (Math.random() * (max - min)) + min;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getScroll() {
   var scrOfX = 0, scrOfY = 0;
   if( typeof( window.pageYOffset ) == 'number' ) {
      //Netscape compliant
      scrOfY = window.pageYOffset;
      scrOfX = window.pageXOffset;
   } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
      //DOM compliant
      scrOfY = document.body.scrollTop;
      scrOfX = document.body.scrollLeft;
   } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
      //IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop;
      scrOfX = document.documentElement.scrollLeft;
   }
   return new Point(scrOfX, scrOfY);
}
