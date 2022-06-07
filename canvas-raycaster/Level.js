function Level() {
  this.CELLTYPE_OPEN = -1;
  this.CELL_SIZE = 64; // using multiple of 2 for optimization
  this.CELL_SIZE_SHIFT = 6; // x >> 6 = Math.floor(x/64)
  this.CELL_HALF = this.CELL_SIZE >> 1; // must be integer

  this.cellCount = { _x:0, _y:0 };
  this.dimension = { _x:0, _y:0 };
  this.spawnPoint = { _x:0, _y:0 };
  this.colors = { ground:'#000000', sky:'#FFFFFF', wallsNear:0, wallsFar:0 };

  this.map;
  this.viewExtent;
  this.walltypes;

   this.parseMap = function(mapString, cols, rows) {
      this.cellCount._x = cols;
      this.cellCount._y = rows;
      this.dimension._x = this.cellCount._x * this.CELL_SIZE;
      this.dimension._y = this.cellCount._y * this.CELL_SIZE;

      var parsedOk = false;

      if (mapString.length != this.cellCount._x * this.cellCount._y) {
        trace("map size not equal to level dimensions");
      }

      else {
        this.walltypes = "@#%&";
        this.colors.ground = '#444455';
        this.colors.sky = '#66AAFF';
        this.colors.wallsNear = new Array(0xDD1111, 0x11DD11, 0x1111DD, 0x6611CC);
        this.colors.wallsFar  = new Array(0x110000, 0x001100, 0x000011, 0x110022);
        this.viewExtent = this.CELL_SIZE * 3;
        var spawnChar = "P";

        this.map = new Array();
        for (var row = 0; row < this.cellCount._y; row++) {
           var r = new Array();
           for (var col = 0; col < this.cellCount._x; col++) {
              var type = this.CELLTYPE_OPEN;
              var c = mapString.charAt(row * this.cellCount._x + col);
              if (c == spawnChar) {
                type = this.CELLTYPE_OPEN;
                this.spawnPoint._x = col * this.CELL_SIZE + this.CELL_HALF;
                this.spawnPoint._y = row * this.CELL_SIZE + this.CELL_HALF;
              }
              else {
                var i = this.walltypes.indexOf(c);
                if (i > -1) { type = i; }
              }
              r.push(type);
           }
           this.map.push(r);
        }
        parsedOk = true;
      }

      return parsedOk;
   }

 }