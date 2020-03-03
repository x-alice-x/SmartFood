<template>
    <div class="dishes">
        <div class="container">
            <div class="dish" v-for="(dish, index) in dishes.dishes" :key="index" @click="buyFirstDish">
                <div class="dish-top" >
                    <div class="dish-img" :style="{'background-image': `url(${dish.image})`}"></div>
                </div>
                <div class="dish-midle">
                    <div class="dish-name">
                        {{ dish.name }}
                    </div>
                    <div v-if="!showBuy" class="dish-descr">{{dish.description}}</div>
                    <div class="dish-add" v-if="showBuy">
                        <img src="../assets/img/minus.svg">
                        <div class="dish-amount">
                            <div class="dish-amount-color">
                                {{dish.amount}}
                            </div>
                        </div>
                        <img src="../assets/img/plus.svg" @click="deleteDish">
                    </div>
                </div>
                <div class="dish-bottom">
                    <div class="dish-typ">
                        <a>{{ dish.price.replace(/.00/, '') }} ₽</a>
                        <a>{{ dish.weight }} г.</a>
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
        methods: {
            // Добавление блюда в корзину
            buyFirstDish() {
                console.log(this.showBuy)
                this.showBuy = true
            },
            // Удаление блюда в корзину
            deleteDish() {
                console.log(this.showBuy)
                this.showBuy = false
            }
        },
        computed: {
            dishes() {
                if(this.$store.getters.currentDishes){
                    return this.$store.getters.currentDishes
                }
                else {
                    return []
                }
            },
        },
        async mounted(){
            this.$store.dispatch('fetchMenu')
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";
    .container {
        margin: 50px 25px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        color: $font-color;
    }
    .dish {
        width: 350px;
        display: flex;
        flex-direction: column;
        text-align: center;
        margin: 10px;
        border-radius: 10px;
        height: auto;
        min-height: 411px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        transition: 0.3s;
        &:hover{
            box-shadow: 0 0 15px rgba(0,0,0,0.6);
        }
        &-add {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            img {
                outline: none;
                margin: 0 10px;
                width: 30px;
                height: 30px;
            }
        }
        &-amount {
            width: 82px;
            height: 30px;
            background: #FFFFFF;
            border: 1px solid $font-color;
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
        &-midle {
            width: 100%;
            background: white;
            transition: 0.3s;
            height: 130px;
        }
        &-name {
            font-weight: 700;
            font-size: 22px;
            line-height: 21px;
            margin-top: 15px;
            width: 90%;
            margin-right: auto;
            margin-left: auto;
        }
        &-descr {
            width: 90%;
            font-weight: 300;
            font-size: 14px;
            line-height: 16px;
            margin-right: auto;
            margin-left: auto;
            margin-top: 20px;
        }
        &-top {
            height: 250px;
            position: relative;
            text-align: right;
        }
        &-img {
            height: 250px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }
        &-bottom{

        }
        &-typ {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            background: $c-main;
            height: 60px;
            a {
                z-index: 10;
                font-weight: bold;
                font-size: 30px;
                line-height: 35px;
            }
            a:nth-child(2n) {
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
    }
</style>