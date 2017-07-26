var Vec2f = function(x, y) {

	if (typeof x == 'object') {
		this.x = x.x;
		this.y = x.y;
	} else if (y == undefined) {
		this.x = x;
		this.y = x;
	} else {
		this.x = x;
		this.y = y;
	}
	return this
}

Vec2f.prototype.clone = function() {
	return new Vec2f(this.x, this.y)
}


// angle in radians
Vec2f.prototype.angle = function() {
	return Math.atan2(this.y, this.x)
}

Vec2f.prototype.mult = function(x, y) {
	if (typeof x == 'object') {
		this.x *= x.x;
		this.y *= x.y;
	} else if (y == undefined) {
		this.x *= x;
		this.y *= x;
	} else {
		this.x *= x;
		this.y *= y;
	}
	return this
}
Vec2f.prototype.div = function(x, y) {
	if (typeof x == 'object') {
		this.x /= x.x;
		this.y /= x.y;
	} else if (y == undefined) {
		this.x /= x;
		this.y /= x;
	} else {
		this.x /= x;
		this.y /= y;
	}
	return this
}
Vec2f.prototype.add = function(x, y) {
	if (typeof x == 'object') {
		this.x += x.x;
		this.y += x.y;
	} else if (y == undefined) {
		this.x += x;
		this.y += x;
	} else {
		this.x += x;
		this.y += y;
	}
	return this
}
Vec2f.prototype.sub = function(x, y) {
	if (typeof x == 'object') {
		this.x -= x.x;
		this.y -= x.y;
	} else if (y == undefined) {
		this.x -= x;
		this.y -= x;
	} else {
		this.x -= x;
		this.y -= y;
	}
	return this
}
Vec2f.prototype.set = function(x, y) {
	if (typeof x == 'object') {
		this.x = x.x;
		this.y = x.y;
	} else if (y == undefined) {
		this.x = x;
		this.y = x;
	} else {
		this.x = x;
		this.y = y;
	}
	return this
}
Vec2f.prototype.length = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}
Vec2f.prototype.normalize = function() {
	var d = Math.sqrt(this.x*this.x + this.y*this.y);
	if (d>0) {
		this.x /= d;
		this.y /= d;
	}
	return this
}

Vec2f.prototype.magSq = function() {
	return (this.x*this.x + this.y*this.y);
}

Vec2f.prototype.limit = function(max) {
	if (this.magSq() > max*max) {
  		this.normalize();
  		this.mult(max);
	}
	return this
}


// static methods
Vec2f.distance = function(a, b) {
	var vx = b.x - a.x;
	var vy = b.y - a.y;
	return Math.sqrt(vx*vx + vy*vy);
}
Vec2f.random = function(min, max, scale) {
	scale = scale || 1
	min = min || -1
	max = max || 1
	return new Vec2f(random(min, max)*scale, random(min, max)*scale)
}
Vec2f.diff = function(a, b) {
	var vx = b.x - a.x;
	var vy = b.y - a.y;
	return new Vec2f(vx, vy)
}
Vec2f.sub = function(a, b) {
	var vx = a.x - b.x;
	var vy = a.y - b.y;
	return new Vec2f(vx, vy)
}
Vec2f.add = function(a, b) {
	var vx = a.x + b.x;
	var vy = a.y + b.y;
	return new Vec2f(vx, vy)
}
Vec2f.getPerp = function(a, b) {
    var vx = b.x - a.x;
    var vy = b.y - a.y;
    var len = Math.sqrt(vx*vx + vy*vy);
    var p = new Vec2f();
    if (len > 0) {
      p.x = -(vy/len);
      p.y = vx/len;
    }
    return p;
  }

export default Vec2f;