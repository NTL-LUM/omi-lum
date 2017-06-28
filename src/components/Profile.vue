<template>
<div class="section is-full-height">
    <div class="container">
        <div class="columns">
            <div class="column is-6 is-offset-3">    
                
                <div class="is-text-centered" v-if="authenticated">
                    <div class="is-margin-centered image is-96x96 profile-image">
                        <img :src="authProfile.photoURL" alt="">
                    </div>
                    <h1 class="title">{{authProfile.displayName}}</h1>
                    <h1 class="subtitle is-6">{{authProfile.email}}</h1>
                    <router-link :to="{path: '/logout'}" class="is-link">logout</router-link><br>
                    
                    <div class="sessions">
                        <ul>
                            <li v-for="session in sessions">
                                <h1>{{session.name}}</h1>
                                <small>{{session.date | fromnow}}</small>
                            </li>
                        </ul>
                    </div>

                    <router-link :to="{path: '/session'}" class="join-session button">Join Sessions</router-link>
                </div>

            </div>
        </div>   
    </div>
</div> 
</template>

<script>
export default {
    name: 'Profile',
    props: {},
    data() {
        return {
            sessions: [
                {name: 'Demo name A', date: new Date()},
                {name: 'Demo name B', date: new Date()},
                {name: 'Demo name C', date: new Date()}
            ]
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
    }
}
</script>

<style scoped lang="scss">
.sessions {
    ul {
        li {
            background: #eee;
            text-align: left;
            margin-bottom: 3px;
            padding: 5px;
            h1 {
                font-weight: bold;
            }
        }
    }
}
.join-session {
    margin-top: 20px;
}
</style>