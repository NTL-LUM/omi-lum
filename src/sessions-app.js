var App = function(p) {
	var acc = p.createVector()
	var preAcc = p.createVector()
	var data = Array(100).fill(p.createVector())
	
	var x, y, z, dirX, dirY, accelerationLog;
    var r = 0;
    var b = 255;
    var userEnergy = 0;
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight-10)//, p.WEBGL);
        x = 0;
        y = 0;
        z = 0;
    }
    p.draw = function() {
        p.background(0);
    	/*
        p.handleAcceleration();
        r = p.map(x, 0, 10, 0, 255);
        b = p.map(y, 0, 10, 0, 255);
        p.background(r, 0, b);
        p.camera(-x * 100, y * 100, -z * 100 );
        p.rotateX((p.frameCount % p.TWO_PI) * .2 * x);
        p.rotateY((p.frameCount % p.TWO_PI) * .2 * y);
        p.rotateZ((p.frameCount % p.TWO_PI) * .2 * z);
        p.ambientLight(100, 10, 180);
        p.rotateZ(p.frameCount*0.01);
        //pointLight(0, 255, 255);
        //ambientLight(115, 20, 180); //even red light across our objects
        dirY = (y / p.height - 0.5) * 2;
        dirX = (x / p.width - 0.5) * 2;
        p.directionalLight(115, 20, 180, dirX, -dirY, 0.25);
        p.ambientMaterial(250);
        p.torus(30, 7);
        p.torus(60, 7);
        p.torus(90, 7);
        p.torus(120, 7);
		*/
		p.stroke(255)
        p.noFill();
        
        p.beginShape();
        for (var i = 0; i < data.length; i++) {
        	var x = p.map(i, 0, data.length-1, 0, p.width);
        	var y = (p.height/2) + data[i].y * 100
        	p.vertex(x, y);
        }
        p.endShape();


        if (data.length > 100) {
    		data[0] = {x:0, y:p.random(), z:0}
	        for (var i = data.length - 1; i >= 1; i--) {
	        	data[i] = data[i-1]
	        }
    	}

    }
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight-10);
    }
    p.handleAcceleration = function() {
    	acc.set(p.accelerationX, p.accelerationY, p.accelerationZ)

        x = p.accelerationX;
        y = p.accelerationY;
        z = p.accelerationZ;
        p.accelerationLog = 'x:'+x+' y:'+y+' z:'+z;
    	data.push({x:x, y:y, z:z});
    }
}
   
export default function(vm) {
	new p5(App, vm.$refs.session)
}