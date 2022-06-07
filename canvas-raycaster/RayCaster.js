
function RayCaster(canvas, w, h, z, level, player, inputBuffer) {

    this.QUAD_I = Math.PI * .5;
    this.QUAD_II = Math.PI;
    this.QUAD_III = Math.PI * 1.5;
    this.TO_RADS = Math.PI / 180;
    this.TO_DEGS = 180 / Math.PI;
    this.INFINITY = 10000;
    this.RES = { w:w, h:h, hh:h * .5 };
    this.FOV = 60 * this.TO_RADS;
    this.SLIVER_ARC = this.FOV / this.RES.w;
    this.TABLE_ENTRIES = Math.ceil(Math.PI * 2 / this.SLIVER_ARC);

    this.TABLE_INV_SIN;
    this.TABLE_INV_COS;
    this.TABLE_TAN;
    this.TABLE_INV_TAN;
    this.QUAD_BOUNDARIES;
    this.TABLE_VIEW_CORRECTION;
    this.TABLE_REFLECTANCE_LATITUDE;
    this.TABLE_REFLECTANCE_LONGITUDE;
    this.TABLE_HEX = [
    '00','01','02','03','04','05','06','07','08','09','0a','0b','0c','0d','0e','0f',
    '10','11','12','13','14','15','16','17','18','19','1a','1b','1c','1d','1e','1f',
    '20','21','22','23','24','25','26','27','28','29','2a','2b','2c','2d','2e','2f',
    '30','31','32','33','34','35','36','37','38','39','3a','3b','3c','3d','3e','3f',
    '40','41','42','43','44','45','46','47','48','49','4a','4b','4c','4d','4e','4f',
    '50','51','52','53','54','55','56','57','58','59','5a','5b','5c','5d','5e','5f',
    '60','61','62','63','64','65','66','67','68','69','6a','6b','6c','6d','6e','6f',
    '70','71','72','73','74','75','76','77','78','79','7a','7b','7c','7d','7e','7f',
    '80','81','82','83','84','85','86','87','88','89','8a','8b','8c','8d','8e','8f',
    '90','91','92','93','94','95','96','97','98','99','9a','9b','9c','9d','9e','9f',
    'a0','a1','a2','a3','a4','a5','a6','a7','a8','a9','aa','ab','ac','ad','ae','af',
    'b0','b1','b2','b3','b4','b5','b6','b7','b8','b9','ba','bb','bc','bd','be','bf',
    'c0','c1','c2','c3','c4','c5','c6','c7','c8','c9','ca','cb','cc','cd','ce','cf',
    'd0','d1','d2','d3','d4','d5','d6','d7','d8','d9','da','db','dc','dd','de','df',
    'e0','e1','e2','e3','e4','e5','e6','e7','e8','e9','ea','eb','ec','ed','ee','ef',
    'f0','f1','f2','f3','f4','f5','f6','f7','f8','f9','fa','fb','fc','fd','fe','ff'];
    this.PALETTE;
    this.CENTERLINE_SHIFT = 0;

    this.camera = { position: { _x:-1, _y:-1}, direction: 0 }
   this.idle = false;
   this.sliverWidth = z * 2;
    this.canvas = canvas;
   this.canvas.lineWidth = this.sliverWidth;
    this.level = level; //new Level();
    this.player = player; //new Player(8);
    this.keysPressed = inputBuffer;//new Array(false, false, false, false);
    
    this.update = function() {
    if (!this.idle) {
      this.blank(this.RES.w, this.RES.h, this.RES.hh, this.level.colors.sky, this.level.colors.ground);
      this.cast();
    }
    this.processInput();
    }
    
    this.loadMap = function(m, x, y) {
        var parseOk = this.level.parseMap(m, x, y);
        if (parseOk) {
            this.buildPalette();
            this.camera.position._x = this.level.spawnPoint._x;
            this.camera.position._y = this.level.spawnPoint._y;
            this.camera.direction = 0;
            trace("player spawned at [" +this.camera.position._x +" " +this.camera.position._y +"]");
        }
        return parseOk;
    }
    
    this.cast = function() {
        var hit_latitude = { _x:0, _y:0, type:this.level.CELLTYPE_OPEN };
        var hit_longitude = { _x:0, _y:0, type:this.level.CELLTYPE_OPEN };
        var distance = { _x:0, _y:0 };
        var step = { _x:0, _y:0 };
        var mapScale = this.RES.h / this.level.dimension._y;
        var wallHeight = this.RES.h;
        
        var wallHalfHeight;
        var wallScale;
        var wallTop;
        var wallCenter;
        var wallBottom;
        
        var brightness;
        var rlu;
        var C;
        var sliverColor;

        // cast a ray for every sliver of our Field Of View (from -this.FOV/2 to this.FOV/2),
        // looking for both latitudinal (E-W) and longitudinal (N-S) intersections.
        // the closest intersection will determine how to render the sliver.
        var rayDirection = this.camera.direction - Math.round(this.RES.w * .5) + 1;
        if (rayDirection < 0) { rayDirection += this.TABLE_ENTRIES; }
        for (var currentSliver = 0; currentSliver < this.RES.w; currentSliver += this.sliverWidth) {
            rayDirection += this.sliverWidth;
            if (rayDirection >= this.TABLE_ENTRIES) { rayDirection = 0; }
            
            // look for intersections with latitudinal boundaries (running east-west)
            if (rayDirection >= this.QUAD_BOUNDARIES[0] && rayDirection < this.QUAD_BOUNDARIES[2]) {
                this.cast_north(hit_latitude, distance, step, rayDirection);
            }
            else {
                this.cast_south(hit_latitude, distance, step, rayDirection);
            }
            
            // look for intersections with longitudinal boundaries (running north-south)
            if (rayDirection >= this.QUAD_BOUNDARIES[1] && rayDirection < this.QUAD_BOUNDARIES[3]) {
                this.cast_west(hit_longitude, distance, step, rayDirection);
            }
            else {
                this.cast_east(hit_longitude, distance, step, rayDirection);
            }
        
            // compare distances and draw nearest intersection
            if (distance._x < distance._y) {
                // draw a latitudinal wall sliver (east-west wall)
                distance._x *= this.TABLE_VIEW_CORRECTION[currentSliver];
                wallScale = this.level.CELL_SIZE / distance._x;
                rlu = rayDirection - this.camera.direction;
                if (rlu < 0) { rlu += this.TABLE_ENTRIES; }
                else if (rlu >= this.TABLE_ENTRIES) { rlu -= this.TABLE_ENTRIES; }
                brightness = 1 - Math.min(1, distance._x / this.level.viewExtent);
                brightness *= this.TABLE_REFLECTANCE_LATITUDE[rlu];
                C = this.PALETTE[hit_latitude.type];
                sliverColor = '#' +
                         this.TABLE_HEX[ Math.round(C.r.delta * brightness + C.r.far) ] +
                              this.TABLE_HEX[ Math.round(C.g.delta * brightness + C.g.far) ] +
                              this.TABLE_HEX[ Math.round(C.b.delta * brightness + C.b.far) ];
            }
            else {
                // draw a longitudinal wall sliver (north-south wall)
                distance._y *= this.TABLE_VIEW_CORRECTION[currentSliver];
                wallScale = this.level.CELL_SIZE / distance._y;
                rlu = rayDirection - this.camera.direction;
                if (rlu < 0) { rlu += this.TABLE_ENTRIES; }
                else if (rlu >= this.TABLE_ENTRIES) { rlu -= this.TABLE_ENTRIES; }
                brightness = 1 - Math.min(1, distance._y / this.level.viewExtent);
                brightness *= this.TABLE_REFLECTANCE_LONGITUDE[rlu];
                C = this.PALETTE[hit_longitude.type];
                sliverColor = '#' +
                         this.TABLE_HEX[ Math.round(C.r.delta * brightness + C.r.far) ] +
                              this.TABLE_HEX[ Math.round(C.g.delta * brightness + C.g.far) ] +
                              this.TABLE_HEX[ Math.round(C.b.delta * brightness + C.b.far) ];
            }
            wallCenter = Math.round(this.RES.hh + this.CENTERLINE_SHIFT*wallScale);
            wallHalfHeight = (wallHeight * wallScale) >> 1;
            wallTop = Math.max(0, wallCenter - wallHalfHeight);
            wallBottom = Math.min(this.RES.h, wallCenter + wallHalfHeight);
            this.drawSliver(currentSliver, wallTop, wallBottom, sliverColor);
        }
        
    }
    
    this.cast_north = function(hit, distance, step, ray) {
        // casting northward (0 - 180 degrees), Y is increasing
        var cellBoundY = this.camera.position._y >> this.level.CELL_SIZE_SHIFT;
        hit._y = (cellBoundY+1) << this.level.CELL_SIZE_SHIFT;
        hit._x = this.camera.position._x + ((hit._y - this.camera.position._y) * this.TABLE_INV_TAN[ray]);
        step._x = this.level.CELL_SIZE * this.TABLE_INV_TAN[ray];
        step._y = this.level.CELL_SIZE;
        
        var casting = true;
        while (casting) {
            // is current hit point out of bounds?
            if ( (hit._x < 0) || (hit._x >= this.level.dimension._x) ) {
                distance._x = this.INFINITY;
                casting = false;
            }
            else {
                // is there a wall at the cell boundary north of the hitpoint?
                // walltype = this.level.map[row][col];
                hit.type = this.level.map[((hit._y + this.level.CELL_HALF) >> this.level.CELL_SIZE_SHIFT)][(hit._x >> this.level.CELL_SIZE_SHIFT)];
                if (hit.type != this.level.CELLTYPE_OPEN) {
                    distance._x = (hit._y - this.camera.position._y) * this.TABLE_INV_SIN[ray];
                    casting = false;
                }
                // if still in bounds but south of an empty cell, then cast further north
                else {
                    hit._x += step._x;
                    hit._y += step._y;
                }
            }
        }
    }
    
    this.cast_south = function(hit, distance, step, ray) {
        // casting southward (180 - 360 degrees), Y is decreasing
        var cellBoundY = this.camera.position._y >> this.level.CELL_SIZE_SHIFT;
        hit._y = cellBoundY << this.level.CELL_SIZE_SHIFT;
        hit._x = this.camera.position._x + ((hit._y - this.camera.position._y) * this.TABLE_INV_TAN[ray]);
        step._x = -this.level.CELL_SIZE * this.TABLE_INV_TAN[ray];
        step._y = -this.level.CELL_SIZE;
        
        var casting = true;
        while (casting) {
            // is current hit point out of bounds?
            if ( (hit._x < 0) || (hit._x >= this.level.dimension._x) ) {
                distance._x = this.INFINITY;
                casting = false;
            }
            else {
                // is there a wall at the cell boundary south of the hitpoint?
                // walltype = this.level.map[row][col];
                hit.type = this.level.map[((hit._y - this.level.CELL_HALF) >> this.level.CELL_SIZE_SHIFT)][(hit._x >> this.level.CELL_SIZE_SHIFT)];
                if (hit.type != this.level.CELLTYPE_OPEN) {
                    distance._x = (hit._y - this.camera.position._y) * this.TABLE_INV_SIN[ray];
                    casting = false;
                }
                // if still in bounds but north of an empty cell, then cast further south
                else {
                    hit._x += step._x;
                    hit._y += step._y;
                }
            }
        }
    }
    
    this.cast_west = function(hit, distance, step, ray) {
        // casting westward (90 - 270 degrees), X is decreasing
        var cellBoundX = this.camera.position._x >> this.level.CELL_SIZE_SHIFT;
        hit._x = cellBoundX << this.level.CELL_SIZE_SHIFT;
        hit._y = this.camera.position._y + ((hit._x - this.camera.position._x) * this.TABLE_TAN[ray]);
        step._x = -this.level.CELL_SIZE;
        step._y = -this.level.CELL_SIZE * this.TABLE_TAN[ray];
        
        var casting = true;
        while (casting) {
            // is current hit point out of bounds?
            if ( (hit._y < 0) || (hit._y >= this.level.dimension._y) ) {
                distance._y = this.INFINITY;
                casting = false;
            }
            else {
                // is there a wall at the cell boundary west of the hitpoint?
                // walltype = this.level.map[row][col];
                hit.type = this.level.map[(hit._y >> this.level.CELL_SIZE_SHIFT)][((hit._x - this.level.CELL_HALF) >> this.level.CELL_SIZE_SHIFT)];
                if (hit.type != this.level.CELLTYPE_OPEN) {
                    distance._y = (hit._x - this.camera.position._x) * this.TABLE_INV_COS[ray];
                    casting = false;
                }
                // if still in bounds but east of an empty cell, then cast further west
                else {
                    hit._x += step._x;
                    hit._y += step._y;
                }
            }
        }
    }
    
    this.cast_east = function(hit, distance, step, ray) {
        // casting eastward (0-90, 270-360 degrees), X is increasing
        var cellBoundX = this.camera.position._x >> this.level.CELL_SIZE_SHIFT;
        hit._x = (cellBoundX+1) << this.level.CELL_SIZE_SHIFT;
        hit._y = this.camera.position._y + ((hit._x - this.camera.position._x) * this.TABLE_TAN[ray]);
        step._x = this.level.CELL_SIZE;
        step._y = this.level.CELL_SIZE * this.TABLE_TAN[ray];
        
        var casting = true;
        while (casting) {
            // is current hit point out of bounds?
            if ( (hit._y < 0) || (hit._y >= this.level.dimension._y) ) {
                distance._y = this.INFINITY;
                casting = false;
            }
            else {
                // is there a wall at the cell boundary east of the hitpoint?
                // walltype = this.level.map[row][col];
                hit.type = this.level.map[hit._y >> this.level.CELL_SIZE_SHIFT][(hit._x + this.level.CELL_HALF) >> this.level.CELL_SIZE_SHIFT];
                if (hit.type != this.level.CELLTYPE_OPEN) {
                    distance._y = (hit._x - this.camera.position._x) * this.TABLE_INV_COS[ray];
                    casting = false;
                }
                // if still in bounds but west of an empty cell, then cast further east
                else {
                    hit._x += step._x;
                    hit._y += step._y;
                }
            }
        }
    }
    
    this.blank = function(w, h, hh, sky, ground) {
        // clear drawings from previous update (pen resets to [0, 0]),
      this.canvas.clearRect(0, 0, w, h);
        // draw fresh background of sky and ground
      this.canvas.fillStyle = sky;
      this.canvas.fillRect(0, 0, w, hh);
      this.canvas.fillStyle = ground;
      this.canvas.fillRect(0, hh, w, h);
    }
    
    this.drawSliver = function(x, t, b, c) {
        // draw a vertical 1-pixel wide sliver of wall
      var xc = x + this.sliverWidth * .5;
      this.canvas.beginPath();
      this.canvas.strokeStyle = c;
      this.canvas.moveTo(xc, t);
      this.canvas.lineTo(xc, b);
      this.canvas.closePath();
      this.canvas.stroke();
    }
    
    this.processInput = function() {
     this.idle = true;
     
        if (this.keysPressed.left) {
            // rotate this.camera counter-clockwise
        this.idle = false;
        trace('turning left');
            this.camera.direction -= this.player.speed.turn;
            if (this.camera.direction < 0) { this.camera.direction += this.TABLE_ENTRIES; }
        }
        if (this.keysPressed.right) {
            // rotate this.camera clockwise
        this.idle = false;
        trace('turning right');
            this.camera.direction += this.player.speed.turn;
            if (this.camera.direction >= this.TABLE_ENTRIES) { this.camera.direction -= this.TABLE_ENTRIES; }
        }
        if (this.keysPressed.up) {
            // ensure next step will take this.camera into empty cell
        this.idle = false;
        trace('moving forward');
            var newX = this.camera.position._x + this.player.speed.forward / this.TABLE_INV_COS[this.camera.direction];
            var newY = this.camera.position._y + this.player.speed.forward / this.TABLE_INV_SIN[this.camera.direction];
            var row = newY >> this.level.CELL_SIZE_SHIFT;
            var col = newX >> this.level.CELL_SIZE_SHIFT;
            if (this.level.map[row][col] == this.level.CELLTYPE_OPEN) {
                this.camera.position._x = newX;
                this.camera.position._y = newY;
            }
        }
        if (this.keysPressed.down) {
            // ensure next step will take this.camera into empty cell
        this.idle = false;
        trace('moving backward');
            var newX = this.camera.position._x - this.player.speed.backward / this.TABLE_INV_COS[this.camera.direction];
            var newY = this.camera.position._y - this.player.speed.backward / this.TABLE_INV_SIN[this.camera.direction];
            var row = newY >> this.level.CELL_SIZE_SHIFT;
            var col = newX >> this.level.CELL_SIZE_SHIFT;
            if (this.level.map[row][col] == this.level.CELLTYPE_OPEN) {
                this.camera.position._x = newX;
                this.camera.position._y = newY;
            }
        }
    }

    this.buildPalette = function() {
        // for each walltype color pair,
        // extract the r,g,b components for shading use later
        //
        // 24-bit color:
        //   rrrrrrrrggggggggbbbbbbbb
        // 24      16       8       0
        //
        // extraction:
        //   r = c >> 16              : shift out the green and blue
        //   g = (c & 0x00FF00) >> 8  : mask out the red, shift out the blue
        //   b = c & 0x0000FF         : mask out the red and green
        // combination:
        //   c = (r << 16) + (g << 8) + b  : shift the components into place and combine
        
        this.PALETTE = new Array();
        // the palette will be used to interp from dark to light (far to near),
        // so delta is set in this direction
        for (var i = 0; i < this.level.walltypes.length; i++) {
            // grab wallcolor near and wallcolor far
            var wcn = this.level.colors.wallsNear[i];
            var wcf = this.level.colors.wallsFar[i];
            
            // extract rgb components for near and far
            var rn = (wcn & 0xff0000) >> 16;
            var rf = (wcf & 0xff0000) >> 16;
            //var rn = wcn >> 16;
            //var rf = wcf >> 16;
            var gn = (wcn & 0x00ff00) >> 8;
            var gf = (wcf & 0x00ff00) >> 8;
            var bn = wcn & 0x0000ff;
            var bf = wcf & 0x0000ff;
            
            // assemble object and store in lookup table for use later
            var C = {
                r : { near:rn, far:rf, delta:rn-rf},
                g : { near:gn, far:gf, delta:gn-gf},
                b : { near:bn, far:bf, delta:bn-bf}
            };
            this.PALETTE[i] = C;
        }
    }
    
    this.buildTables = function() {
        // precompute values for expensive math ops
        // we already know the field of view and horizontal screen res,
        // and thus the degrees of view spanned by a single sliver of res,
        // so we compute the trig values for enough slivers to cover 360 deg.
        
        // initialize the tables
        this.TABLE_INV_SIN = new Array();
        this.TABLE_INV_COS = new Array();
        this.TABLE_TAN = new Array();
        this.TABLE_INV_TAN = new Array();
        this.QUAD_BOUNDARIES = new Array();
        this.TABLE_REFLECTANCE_LATITUDE = new Array();
        this.TABLE_REFLECTANCE_LONGITUDE = new Array();
        
        // define some unit circle constants
        var PI_1over2 = Math.PI * 1 / 2; //  90 degrees
        var PI_1over1 = Math.PI * 1;     // 180 degrees
        var PI_3over2 = Math.PI * 3 / 2; // 270 degrees
        var PI_2over1 = Math.PI * 2;     // 360 degrees
        
        // walk around the unit circle, jotting down trig values along the way.
        // we need to look out for horizontal and vertical asymptotes, where tangent
        // goes to infinity, and substitute a grossly underestimated value that
        // won't break our calculations.
        // also, when we cross an asymptote, we'll record the index i
        // QUAD_
        var quadrant = 0;
        var angle = 0;
        for (var i = 0; i < this.TABLE_ENTRIES; i++) {
            var cosine = Math.cos(angle);
            var sine = Math.sin(angle);
            var absCosine = Math.abs(cosine);
            var absSine = Math.abs(sine);
            
            if (absCosine == 0 || absSine == 1) {
                // 90 or 270 degrees
                this.TABLE_TAN[i] = -this.INFINITY;
                this.TABLE_INV_TAN[i] = 0;
                if (quadrant == 1) { this.TABLE_INV_COS[i] = -this.INFINITY; }
                else               { this.TABLE_INV_COS[i] = this.INFINITY; }
                this.TABLE_INV_SIN[i] = 1 / sine;
                this.QUAD_BOUNDARIES[quadrant] = i;
                quadrant++;
            }
            else if (absCosine == 1 || absSine == 0) {
                // 0 or 180 degrees
                this.TABLE_TAN[i] = 0;
                this.TABLE_INV_TAN[i] = this.INFINITY;
                if (quadrant == 0) { this.TABLE_INV_SIN[i] = this.INFINITY; }
                else               { this.TABLE_INV_SIN[i] = -this.INFINITY; }
                this.TABLE_INV_COS[i] = 1 / cosine;
                this.QUAD_BOUNDARIES[quadrant] = i;
                quadrant++;
            }
            else {
                // no asymptotes to worry about
                this.TABLE_TAN[i] = sine / cosine;
                this.TABLE_INV_TAN[i] = cosine / sine;
                this.TABLE_INV_COS[i] = 1 / cosine;
                this.TABLE_INV_SIN[i] = 1 / sine;
            }
            
            // for specular lighting,
            // precalculate the cosine of the angle between
            // every ray and the surface normal of:
            //   1) a latitudinal (horizontal) surface
            //   2) a longitudinal (vertical) surface
            // the calculation requires that the angle be [0,PI/2]
            var h = 0;
            var v = 0;
            switch (quadrant-1) {
                case 0:
                h = PI_1over2 - angle;
                v = angle;
                break;
                
                case 1:
                h = angle - PI_1over2;
                v = PI_1over1 - angle;
                break;
                
                case 2:
                h = PI_3over2 - angle;
                v = angle - PI_1over1;
                break;
                
                case 3:
                h = angle - PI_3over2;
                v = PI_2over1 - angle;
                break;
            }
            this.TABLE_REFLECTANCE_LATITUDE[i]  = Math.sin( Math.min(PI_1over2, Math.max(0, h)) );
            this.TABLE_REFLECTANCE_LONGITUDE[i] = Math.cos( Math.min(PI_1over2, Math.max(0, v)) );
            
            angle += this.SLIVER_ARC;
        }
        
        // pre-compute view correction values for each sliver
        this.TABLE_VIEW_CORRECTION = new Array();
        var FOVangle = this.SLIVER_ARC * (-Math.round(this.FOV*.5));
        for (var sliver = 0; sliver < this.RES.w; sliver++) {
            this.TABLE_VIEW_CORRECTION[sliver] = Math.cos(FOVangle); // minimal fish-eye
            //this.TABLE_VIEW_CORRECTION[sliver] = 1 / Math.cos(FOVangle); // extra fish-eye! cool.
            FOVangle += this.SLIVER_ARC;
        }
    }
    
    this.buildTables();
    
}