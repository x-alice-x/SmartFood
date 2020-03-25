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
    height: 100%;
    overflow: auto;
}
</style>
