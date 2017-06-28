<template>
    <div class="session" ref="session">
    </div>   
</template>

<script>
var app;
var points = []
var MAX_POINTS = 100
import Vec2f from '../vec2f'
export default {
    name: 'SessionPage',
    props: {},
    data() {
        return {
        }
    },
    components: {
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    created() {
    },
    mounted() {
        var vm = this
    	points = []
    	app = Sketch.create({
    		container: this.$refs.session
    	})
    	app.setup = function() {
    		
    	}
    	app.draw = function() {
			this.beginPath();
			this.fillStyle = 'black'
			if (!points.length) return
    		var perps = []
    		var strip = []
    		var perp;
    		for (var i = 1; i < points.length; i++) {
    			perp = Vec2f.getPerp(points[i], points[i-1])
    			perps.push(perp);
    		}
    		for (var i = 0; i < perps.length; i++) {
    			var rad = map(i, 0, perps.length, 10, 2)
				var p = perps[i]
    			var a = points[i].clone();
    				a.add(p.x * 10, p.y * 10)
    			
    			strip[(perps.length-1) - i] = {x: points[i].x + p.x * rad, y: points[i].y + p.y * rad}
    			strip[i] = {x: points[i].x + p.x * -rad, y: points[i].y + p.y * -rad}
    		}
    		
    		this.moveTo( strip[0].x, strip[0].y) 
    		for (var i = 1; i < strip.length; i++) {
		    	this.lineTo( strip[i].x, strip[i].y);
    		}
	    	this.lineTo( strip[0].x, strip[0].y);

	    	this.fill();
    	}
    	app.mousemove = function() {
    		var pt = app.mouse
            var nx = pt.x / app.width
            var ny = pt.y / app.height
    		points.push(new Vec2f(pt.x, pt.y))
            if (points.length > MAX_POINTS) {
                points.shift()
            }

            // we need to add this point
            var sessionID = 'session_1' 
            var authID = vm.authID

            // for right now we are just storing a single point of data
            vm.$db.ref(`sessions/${sessionID}/${authID}`).update({x: nx, y: ny})

    	}
        app.mousedown = function() {
            points = []
        }
    },
    destroyed() {
    	app.destroy()
    }
}
</script>

<style scoped lang="scss">

</style>