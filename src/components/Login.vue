<template>
<div class="section is-full-height login-container">
    <div class="container">
        <div class="is-text-centered" v-if="!authenticated">
            <div class="logo">
                <img src="/static/img/logo.png" alt="">
            </div>
            <h2 class="logo-name">
                <img src="../assets/lum.svg" alt="">
            </h2>
            <a href="/auth" class="spotify-login-button button">Sign in with Spotify</a>
        </div>  
    </div>
</div>
</template>

<script>
export default {
    name: 'Login',
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
    }
}
</script>

<style scoped lang="scss">
.logo {
    padding: 30px;
}
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(../assets/login-bg.png); 
}
.logo-name {
    color: white;
    font-size: 35px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 47px;
    margin-bottom: 30px;
}
</style>