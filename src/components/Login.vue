<template>
<div class="section is-full-height login-container">
    <div class="container">
        <div class="is-text-centered" v-if="!authenticated">
            <div class="logo">LUM Logo Here</div>
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
    margin-top: -50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>