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

	this.clone = function() {
		return new Vec2f(this.x, this.y)
	}


	// angle in radians
	this.angle = function() {
		return Math.atan2(this.y, this.x)
	}

	this.mult = function(x, y) {
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
	}
	this.div = function(x, y) {
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
	}
	this.add = function(x, y) {
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
	}
	this.sub = function(x, y) {
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
	}
	this.set = function(x, y) {
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
	}
	this.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	this.normalize = function() {
		var d = Math.sqrt(this.x*this.x + this.y*this.y);
		if (d>0) {
			this.x /= d;
			this.y /= d;
		}
	}
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