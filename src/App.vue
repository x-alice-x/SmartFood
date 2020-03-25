<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {

        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/vars.scss";
    @import "./assets/scss/root.scss";
body, html {
    overflow: unset !important;
}
</style>
