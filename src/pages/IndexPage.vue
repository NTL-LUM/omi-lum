<template>
    <component :is="component"></component>
</template>

<script>
import Login from '@/components/Login'
import Profile from '@/components/Profile'
export default {
    name: 'IndexPage',
    props: {},
    data() {
        return {
            showEditModal: false
        }
    },
    components: {
        Login,
        Profile
    },
    methods: {
        toggleEditModal() {
            this.showEditModal = !this.showEditModal
        },
        save() {
            if (this.authProfile) {
                this.$db.ref(`users/${this.authProfile.uid}`).update({
                    github: this.parseValue(this.authProfile.github),
                    color: this.parseValue(this.authProfile.color)
                }).then(() => {
                    this.showEditModal = false
                })
            }
        }
    },
    computed: {
        component() {
            if (!this.authProfile) {
                return 'Login';
            } else {
                return 'Profile';
            }
        }
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
.edit-button {
    margin-top: 30px;
}
</style>