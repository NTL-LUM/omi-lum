<template>
<div class="section profile is-full-height">

    <router-link :to="{path: '/logout'}" class="logout-button is-link">logout</router-link><br>

    <div class="container">
        <div class="columns">
            <div class="column is-6 is-offset-3">    
                
                <div class="is-text-centered" v-if="authenticated">
                    <div class="is-margin-centered image is-96x96 profile-image">
                        <img :src="authProfile.photoURL" alt="">
                    </div>
                    <h1 class="title">{{authProfile.displayName}}</h1>
                    <h1 class="subtitle is-6">{{authProfile.email}}</h1>                    
                    <div class="sessions">
                        <ul>
                            <li v-for="session in sessions">
                                <h1>{{session.name}}</h1>
                                <h1 class="date">{{session.date}}</h1>
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
                {name: 'Royale', date: '06/25'},
                {name: 'Guilt', date: '03/31'},
                {name: 'Rover', date: '02/26'}
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
.profile {
    .title {
        font-size: 20px;
        color: white;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .subtitle {
        color: RGB(141, 136, 147);
        margin-top: 3px;
    }
}
.sessions {
    ul {
        li {
            background: rgb(55, 38, 77);
            text-align: left;
            margin-bottom: 10px;
            padding: 5px;
            border-radius: 8px;
            color: white;
            height: 60px;
            display: flex;
            width: 100%;
            align-items: center;
            h1 {
                flex: 1;
                margin-left: 10px;
                font-weight: bold;
            }
            .date {
                font-weight: bold;
                flex: 1;
                margin-right: 10px;
                text-align: right;
            }
        }
    }
}
.join-session {
    margin-top: 20px;
    border: none;
    background: RGB(111, 55, 140);
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 25px;
    width: 200px;
    height: 50px;
}
.profile-image {
    border: 3px solid white;
}
.logout-button {
    position: absolute;
    top: 10px;
    right: 20px;
    text-transform: uppercase;
    color: white;
}
</style>