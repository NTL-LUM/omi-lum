var Vec3f = function(x, y, z) {
    this.x = this.y = this.z = 0;
    if (x == undefined && y == undefined && z == undefined) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else if (typeof x == 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (y == undefined) {
      this.x = x;
      this.y = x;
      this.z = x;
    } else {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      this.z = parseFloat(z);
    }

  this.clone = function() {
    return new Vec3f(this.x, this.y, this.z)
  }

  this.lerp = function(b, n) {
      this.x += (b.x - this.x) * n;
      this.y += (b.y - this.y) * n;
      this.z += (b.z - this.z) * n;
      return this;
  }
  
  this.mult = function(x, y, z) {
    if (typeof x == 'object') {
      this.x *= x.x;
      this.y *= x.y;
      this.z *= x.z;
    } else if (y == undefined) {
      this.x *= x;
      this.y *= x;
      this.z *= z;
    } else {
      this.x *= x;
      this.y *= y;
      this.z *= z;
    }
  }
  this.div = function(x, y, z) {
    if (typeof x == 'object') {
      this.x /= x.x;
      this.y /= x.y;
      this.z /= x.z;
    } else if (y == undefined) {
      this.x /= x;
      this.y /= x;
      this.z /= z;
    } else {
      this.x /= x;
      this.y /= y;
      this.z /= z;
    }
  }
  this.add = function(x, y, z) {
    if (typeof x == 'object') {
      this.x += x.x;
      this.y += x.y;
      this.z += x.z;
    } else if (y == undefined) {
      this.x += x;
      this.y += x;
      this.z += z;
    } else {
      this.x += x;
      this.y += y;
      this.z += z;
    }
  }
  this.sub = function(x, y, z) {
    if (typeof x == 'object') {
      this.x -= x.x;
      this.y -= x.y;
      this.z -= x.z;
    } else if (y == undefined) {
      this.x -= x;
      this.y -= x;
      this.z -= z;
    } else {
      this.x -= x;
      this.y -= y;
      this.z -= z;
    }
  }
  this.set = function(x, y, z) {
     if (typeof x == 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (y == undefined) {
      this.x = x;
      this.y = x;
      this.z = x;
    } else {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      this.z = parseFloat(z);
    }
    return this;
  }
  this.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }
  this.normalize = function() {
    var d = this.length()
    if (d>0) {
      this.x /= d;
      this.y /= d;
      this.z /= d;
    }
  }
}


export default Vec3f;

