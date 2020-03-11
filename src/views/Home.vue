<template>
    <div class="main">
        <Header></Header>
        <Weekdays class="week"></Weekdays>
        <Dishes></Dishes>
    </div>
</template>

<script>
import Header from '../components/Header'
import Weekdays from '../components/Weekdays'
import Dishes from '../components/Dishes'
    export default {
        name: "Home",
        components: {
            Header,
            Weekdays,
            Dishes,
        }
    }
</script>

<style scoped lang="scss">
@import "../assets/scss/vars.scss";
@import "../assets/scss/root.scss";
.week {
    position: fixed;
    width: 100%;
    margin-top: 30px;
}
</style>