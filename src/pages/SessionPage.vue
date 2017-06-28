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
    	points = []
    	app = Sketch.create({
    		container: this.$refs.session
    	})
    	app.setup = function() {
    		for (var i = 0; i < MAX_POINTS; i++) {
    			points[i] = new Vec2f(0, 0)
    		}
    	}
    	app.draw = function() {
			this.beginPath();
			this.strokeStyle = 'black'
			for (var i = points.length - 1; i >= 1; i--) {
				points[i].set(points[i-1])
			}
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

	    	this.stroke();
    	}
    	app.mousemove = function() {
    		var pt = app.mouse
    		points[0].set(pt.x, pt.y)
    	}
    },
    destroyed() {
    	app.destroy()
    }
}
</script>

<style scoped lang="scss">

</style>