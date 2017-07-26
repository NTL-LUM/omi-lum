<template>
    <div class="session" ref="session">
        <!--         
        <div class="info">
            <pre>
{{info}}
            </pre>
        </div> 
        -->
        <h1 class="energy">{{energyPct}}</h1>
        <div class="energy-bar" :style="{width: `${energyPct}%`}"></div>
        <div class="connected-users">
            <ul>
                <li v-for="user in connectedUsers">
                    <div class="user-photo">
                        <img :src="user.photoURL" alt="">
                    </div>
                </li>
                <small class="max-users" v-if="totalConnectedUsers > maxUsers">+30</small>
            </ul>
        </div>
        
        <div class="thumbs">
            <div class="thumbs-button" @click="thumbsClick(1)">
                <span class="icon"><i class="fa fa-thumbs-up"></i></span>
            </div>
            <div class="thumbs-button" @click="thumbsClick(-1)">
                <span class="icon"><i class="fa fa-thumbs-down"></i></span>
            </div>
        </div>

        <router-link :to="{path: '/'}" class="back-button button">Back</router-link>
        <span class="thumbs-count">{{thumbsCount}}</span>
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
import GyroNorm from 'gyronorm';
import Vec2f from '../vec2f'
import Vec3f from '../vec3f'
import SessionApp from '../sessions-app';

export default {
    name: 'SessionPage',
    props: {},
    data() {
        return {
            info: null,
            maxUsers: 30,
            usersPresence: null,
            users: null,
            energy: 1,
            thumbsCount: 0
        }
    },
    components: {
    },
    methods: {
        thumbsClick(state) {
            this.thumbsCount += state;
            this.$db.ref(`sessions/${sessionID}/${this.authID}`).update({thumbs_count:this.thumbsCount})
        }
    },
    computed: {
        energyPct() {
            return (this.energy * 100).toFixed(0)
        },
        totalConnectedUsers() {
             var count = 0;
             for(var k in this.usersPresence) {
                if (k != '.key' && this.usersPresence[k]) {
                    count ++;
                }
            }
            return count;
        },
        connectedUsers() {
            var users = []
            for(var k in this.usersPresence) {
                if (k != '.key' && this.usersPresence[k]) {
                    if (users.length < this.maxUsers) {
                        users.push(this.users[k])
                    }
                }
            }
            return users;
        }
    },
    watch: {
    },
    created() {
        this.$db.ref(`history/${sessionID}/users/${this.authID}`).set(null)
        this.$bindAsObject('users', this.$db.ref('users'))
        this.$bindAsObject('usersPresence', this.$db.ref('presence'))
    },
    mounted() {
        var lastSnapShotTime = 0;
        var Gravity = 0.4;
        var Particle = function(x, y, radius) {
            this.pos = new Vec2f(0, 0)
            this.vel = new Vec2f(0, 0)
            this.frc = new Vec2f(0, 0)
            this.maxSpeed = 2.4
            this.mass = 20;
            this.radius = radius
            this.maxJiggle = random(200, 210);
            this.update = function(app, energy) {

                this.frc.set(0, 0);

                var center = new Vec2f(app.width/2, app.height/2)
                // var vec = Vec2f.diff(this.pos, center)
                // var len = vec.length()
                var accFrc = new Vec2f(app.acc.x, app.acc.y)
                    accFrc.mult(-this.maxJiggle * energy)
                // vec.normalize()
                // vec.mult(energy * 10)
                // this.frc.add(vec)
                // this.frc.add(accFrc)

                // this.vel.add(this.frc.x, this.frc.y)
                // this.vel.mult(0.98)
                this.pos.set(accFrc.x,  accFrc.y);
                this.pos.add(center)
            }

            this.draw = function(app, energy) {
                this.update(app, energy)
                app.fillStyle = 'rgb(111, 55, 140)'
                app.drawDisk(this.pos.x, this.pos.y, this.radius)

                app.fillStyle = `rgba(255, 255, 255, ${1-energy})`
                app.drawDisk(this.pos.x, this.pos.y, this.radius)
            }
            return this
        }

        var userEnergy = 0
        var energySmoothed = 0;
        var vm = this
    	points = []
        var energyHistory = []
        var rings = []
    	app = Sketch.create({
    		container: this.$refs.session
    	})

        app.acc = new Vec3f()
        app.accTarget = new Vec3f()
        var points = []
    	app.setup = function() {

            lastSnapShotTime = new Date().getTime();
            var nRings = 4;
            for (var i = 0; i < nRings; i++) {
                var rad = map(i, 0, nRings-1, 90, 10)
                rings.push(new Particle(app.width/2, app.height/2, rad))
            }
            // setup the accekeratuion
            var gn = new GyroNorm();
            gn.init().then(function() {
                gn.start(function(data) {
                    vm.info = data.dm
                    app.accTarget.set(data.dm.x, data.dm.y, data.dm.z);
                    // Process:
                    // data.do.alpha    ( deviceorientation event alpha value )
                    // data.do.beta     ( deviceorientation event beta value )
                    // data.do.gamma    ( deviceorientation event gamma value )
                    // data.do.absolute ( deviceorientation event absolute value )

                    // data.dm.x        ( devicemotion event acceleration x value )
                    // data.dm.y        ( devicemotion event acceleration y value )
                    // data.dm.z        ( devicemotion event acceleration z value )

                    // data.dm.gx       ( devicemotion event accelerationIncludingGravity x value )
                    // data.dm.gy       ( devicemotion event accelerationIncludingGravity y value )
                    // data.dm.gz       ( devicemotion event accelerationIncludingGravity z value )

                    // data.dm.alpha    ( devicemotion event rotationRate alpha value )
                    // data.dm.beta     ( devicemotion event rotationRate beta value )
                    // data.dm.gamma    ( devicemotion event rotationRate gamma value )
                });
            }).catch(function(e) {
                console.log('Error with Gyro', e);
            });
    	}
        
        // -------------------------------------
        app.drawDisk = function(x, y, rad) {
            app.beginPath()
            app.arc(x, y, rad, 0, Math.PI*2, false);            // outer (filled)
            app.arc(x, y, rad - 10, 0, Math.PI*2, true); // outer (unfills it)
            app.fill();
        }

        // -------------------------------------
        var t = 0;
    	app.draw = function() {

            // color the background
            this.fillStyle = `RGB(58, 33, 76)`
            this.fillRect(0, 0, this.width, this.height)
            this.fillStyle = `rgba(255, 255, 255, ${vm.energy})`
            this.fillRect(0, 0, this.width, this.height)
            
            // for testing...
            /*app.accTarget.set(random(-t, t), random(-t, t), random(-t, t))
            t += 0.1;
            if (t > 10) t = 0*/

            // lerp the motion
            app.acc.lerp(app.accTarget, 0.02)
            var v = app.acc.length()
            v = parseFloat(v.toFixed(8))
            if(v < 0) v = 0
            if(v > 1) v = 1
            vm.energy = v;
            
            if (points.length > 10) {
                points[0] = v
                for (var i = points.length - 1; i >= 1; i--) {
                    points[i] = points[i-1]
                }
            } else {
                points.push(v)
            }

            for (var i = 0; i < rings.length; i++) {
                rings[i].draw(this, v)
            }
            if (points.length) {
                this.strokeStyle = 'rgb(111, 55, 140)'
                this.beginPath();
                for (var i = 0; i < points.length; i++) {
                    var x = map(i, 0, points.length-1, 0, app.width);
                    var y = (app.height-50) - (points[i] * 50)
                    if (i == 0) this.moveTo( x, y);
                    this.lineTo(x, y);
                }
                this.stroke();
            }
            // we are posting date ever 300 mills
            var timeSinceLastSnap = new Date().getTime() - lastSnapShotTime;
            if (timeSinceLastSnap > 300) {
                console.log('Post Energy Snap', vm.energy);
                vm.$db.ref(`sessions/${sessionID}/${vm.authID}`).update({energy:vm.energy})
                lastSnapShotTime = new Date().getTime()
            }
            // log history
            energyHistory.push(vm.energy)
    	}
    	app.mousemove = function() {
    		
    	}
        app.mousedown = function() {
            points = []
        }
        app.mouseup = function() {
        }

        // interval for loging history
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
                energy: vm.energy,
                thumbs_count: vm.thumbsCount
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
    bottom: 40px;
    left: 0;
    height: 5px;
    background: RGB(111, 55, 140);
    z-index: 30;
}
.connected-users {
    max-width: 85%;
    pointer-events: none;
    position: absolute;
    top: 10px;
    left: 10px;
    .max-users {
        background: white;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 10px;
        color: black;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
    }
    li {
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
        .user-photo {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid white;
            img {
                width: 30px;
            }
        }
    }
}
.back-button {
    position: absolute;
    top: 10px;
    right: 10px;
    text-transform: uppercase;
    font-size: 13px;
    border-radius: 20px;
    border: none;
    color: white;
    background: RGB(111, 55, 140);
}
.thumbs-count {
    position: absolute;
    top: 50px;
    min-width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
    right: 10px;
    text-transform: uppercase;
    font-size: 13px;
    border-radius: 20px;
    border: none;
    color: white;
    background: RGB(111, 55, 140);
}
.info {
    position: absolute;
    top: 100px;
    width: 200px;
    color: white;
}
.thumbs {
    display: flex;
    width: 100%;
    justify-content: space-around;
    height: 50px;
    position: absolute;
    bottom: 50px;
    .thumbs-button {
        transition: all 200ms;
        background: rgba(0, 0, 0, 0.3);
        width: 150px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 25px;
        i {
            color: white;
        }
        &:hover {
            background: rgba(0, 0, 0, 0.7);
        }
    }
}
</style>