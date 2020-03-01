<template>
    <div class="dishes">
        <div class="container">
            <div class="dish" v-for="(dish, index) in dishes" :key="index">
                <div class="dish-top" >
                    <div class="dish-img" :style="{'background-image': `url(${dish.image})`}"></div>
                    <div class="dish-typ">
                        <a>{{ dish.price.replace(/.00/, '') }} ₽</a>
                        <a>{{ dish.weight }} г.</a>
                        <div class="dish-typ-background"></div>
                    </div>
                </div>
                <div class="dish-bottom">
                    <div class="dish-name">
                        {{ dish.name }}
                    </div>
                    <div v-if="showBuy === false" class="dish-descr">{{dish.description}}</div>
                    <div class="dish-add" v-if="showBuy === true">
                        <button>+</button>
                        <div class="dish-amount">
<!--                                   <div class="dish-amount-color">-->
<!--                                       {{dish.amount}}-->
<!--                                   </div>-->
                        </div>
                        <button>-</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showBuy: false,
                date: 0,
            }
        },
        computed: {
            dishes() {
                if(this.$store.getters.allDishes[0]){
                    return this.$store.getters.allDishes[0].dishes
                }
                else {
                    return []
                }
            },
        },
        async mounted(){
            this.$store.dispatch('fetchDishes')
        }
    }
</script>

<style scoped lang="scss">
@import "../assets/scss/vars.scss";
@import "../assets/scss/root.scss";
.container {
    margin: 50px 35px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.dish {
    width: 350px;
    flex-basis: 350px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    text-align: center;
    margin-bottom: 30px;
    position: relative;
    height: auto;
    min-height: 370px;
    transition: 0.2s;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-top-right-radius: 20px;
    transition: 0.3s;
    &:hover{
        box-shadow: 0 0 15px rgba(0,0,0,0.6);
    }
    &-add {
        display: flex;
        justify-content: center;
        background: $c-main;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        button {
            background-color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            font-weight: 900;
            font-size: 32px;
            line-height: 21px;
            margin-left: 10px;
            margin-right: 10px;
        }
    }
    &-amount {
        width: 82px;
        height: 25px;
        background: #FFFFFF;
        border-radius: 10px;
        &-color {
            background: $c-main;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 900;
            font-size: 18px;
            line-height: 21px;
            height: 100%;
        }
    }
    &-bottom {
        width: 100%;
        color: white;
        background: $c-main;
        opacity: 0.9;
        transition: 0.3s;
        height: 130px;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;
    }
    &-name {
        font-weight: 700;
        font-size: 25px;
        line-height: 32px;
        width: 90%;
    }
    &-top {
        height: 250px;
        position: relative;
        text-align: right;
    }
    &-typ {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        background: $c-main;
        opacity: 0.8;
        border-bottom-left-radius: 20px;
        height: auto;
        width: auto;
        padding-left: 10px;
        padding-bottom: 10px;
        a {
            z-index: 10;
            padding-top: 15px;
            padding-right: 15px;
            font-weight: 700;
            font-size: 30px;
            line-height: 35px;
            color: white;
        }
        a:nth-child(2n) {
            padding-top: 0;
            padding-right: 15px;
            font-weight: 300;
            font-size: 24px;
            line-height: 28px;
        }
        /*&-background {*/
        /*    top: 0;*/
        /*    right: 0;*/
        /*    position: absolute;*/
        /*}*/
    }
    &-img {
        height: 250px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    &-descr {
        width: 330px;
        font-weight: 300;
        font-size: 14px;
        line-height: 16px;
        margin-right: auto;
        margin-left: auto;
        padding-bottom: 7px;
    }
}
</style>