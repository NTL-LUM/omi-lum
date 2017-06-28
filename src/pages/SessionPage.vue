<template>
    <div class="session" ref="session">
        <h1 class="energy">{{energy.toFixed(4)}}</h1>
        <div class="energy-bar" :style="{width: `${energyBarWidth}%`}"></div>
    </div>   
</template>

<script>
var energyTimer;
var app;
var points = []
var MAX_POINTS = 100
var MAX_ENERGY = 20
var ENERGY_TIMER_SECONDS = 10

var sessionID = 'session_1' 

import Vec2f from '../vec2f'

export default {
    name: 'SessionPage',
    props: {},
    data() {
        return {
            energy: 1,
            energyBarWidth: 0
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
        this.$db.ref(`history/${sessionID}/users/${this.authID}`).set(null)
    },
    mounted() {
        var userEnergy = 0
        var energySmoothed = 0;
        var vm = this
    	points = []
        var energyHistory = []
    	app = Sketch.create({
    		container: this.$refs.session
    	})
    	app.setup = function() {
    		
    	}
    	app.draw = function() {

            // if (userEnergy > erg) {
            //     erg = userEnergy;
            // }
            
            var ne = userEnergy / MAX_ENERGY

            //erg *= 0.78
            energySmoothed += (ne - energySmoothed) * 0.0972
            
            vm.energy = energySmoothed;
            vm.energyBarWidth = vm.energy * 100
            
            var drawColor = 255 - (vm.energy * 255)

            this.fillStyle = `black`
            this.fillRect(0, 0, this.width, this.height)

            this.fillStyle = `rgba(255, 255, 255, ${vm.energy})`
            this.fillRect(0, 0, this.width, this.height)


            this.save()
            this.fillStyle = `rgba(${parseInt(drawColor)}, ${parseInt(drawColor)}, ${parseInt(drawColor)}, 1)`
			this.beginPath();
			if (points.length < 2) return
    		var perps = []
    		var strip = []
    		var perp;
    		for (var i = 1; i < points.length; i++) {
    			perp = Vec2f.getPerp(points[i], points[i-1])
    			perps.push(perp);
    		}
    		for (var i = 0; i < perps.length; i++) {
                var n = map(i, 0, perps.length, 0.0, TWO_PI)
    			var rad = Math.sin(n) * 10
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
            this.restore()

            // log history
            energyHistory.push(vm.energy)
    	}
    	app.mousemove = function() {
    		var pt = app.mouse
            var nx = pt.x / app.width
            var ny = pt.y / app.height
    		points.push(new Vec2f(pt.x, pt.y))
            if (points.length > MAX_POINTS) {
                points.shift()
            }

            // for right now we are just storing a single point of data
            vm.$db.ref(`sessions/${sessionID}/${vm.authID}`).update({energy:vm.energy})

            userEnergy = Vec2f.distance({x:app.mouse.x, y:app.mouse.y}, {x:app.mouse.ox, y:app.mouse.oy})
            if (userEnergy >= MAX_ENERGY) {
                userEnergy = MAX_ENERGY
            }
    	}
        app.mousedown = function() {
            points = []
        }

        energyTimer = setInterval(function() {
            var avg = 0;
            if (energyHistory.length) {
                for (var i = 0; i < energyHistory.length; i++) {
                    avg += energyHistory[i];
                }
                avg /= energyHistory.length
            }
            energyHistory = []
            var timestamp = new Date().getTime()
            var energyPayload = {
                fb_timestamp: vm.firebaseTimestamp(),
                energy: vm.energy
            }
            vm.$db.ref(`history/${sessionID}/users/${vm.authID}/${timestamp}`).set(energyPayload)
            console.log('energyTimer', avg);

        }, ENERGY_TIMER_SECONDS * 1000)

    },
    destroyed() {
    	app.destroy()
        if (energyTimer) {
            clearInterval(energyTimer)
        }
    }
}
</script>

<style scoped lang="scss">
.energy {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 20;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: #444;
    z-index: 20;
}

.energy-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 40px;
    background: yellow;
    z-index: 10;
}
</style>