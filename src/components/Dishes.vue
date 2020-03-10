<template>
    <div class="dishes">
        <div class="container">
            <div class="dish" v-for="(dish, index) in dishes.dishes" :key="index" @click="buyDish(dishes.id, dish.id)">
                <div class="dish-top">
                    <div class="dish-img" :style="{'background-image': `url(${dish.image})`}"></div>
                </div>
                <div class="dish-middle">
                    <div class="dish-name">
                        {{ dish.name }}
                    </div>
                    <div v-if="dish.inEmployeeBasket === 0" class="dish-descr">{{dish.description}}</div>
                    <div class="dish-add" v-if="dish.inEmployeeBasket > 0">
                        <button>
                            <img src="../assets/img/minus.svg" @click="deleteDish(dishes.id, dish.id)">
                        </button>
                        <div class="dish-amount">
                            <div class="dish-amount-color">
                                {{dish.inEmployeeBasket}}
                            </div>
                        </div>
                        <button>
                            <img src="../assets/img/plus.svg" @click="buyDish(dishes.id, dish.id)">
                        </button>
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
        <div class="dish-mobile" v-for="(dish, index) in dishes.dishes" :key="index"
             v-touch:swipe.left="onSwipeLeft.bind(this, index, dishes.id, dish.id)"
             v-touch:swipe.right="onSwipeRight.bind(this, index, dishes.id, dish.id)">
            <section class="dish-mobile-basket"
                    :class="{
                    'dish-mobile-basket-to-right': dish.swipe === 'right',
                    'dish-mobile-basket-to-left': dish.swipe === 'left',
                    'dish-mobile-basket-to-middle': dish.swipe === 'middle'}">
                <img src="../assets/img/cart.svg">
            </section>
            <section class="dish-mobile-middle"
                     :class="{
                     'dish-mobile-middle-to-right': dish.swipe === 'right',
                     'dish-mobile-middle-to-left': dish.swipe === 'left',
                     'dish-mobile-middle-to-middle': dish.swipe === 'middle'}">
                <div class="dish-mobile-middle-about">
                    <div class="dish-mobile-middle-about-name">
                        {{ dish.name }}
                    </div>
                    <div class="dish-mobile-middle-about-desc">
                        {{dish.description}}
                    </div>
                </div>
                <div class="dish-mobile-middle-typ">
                    <div class="dish-mobile-middle-typ-counter">
                        В корзине: {{dish.inEmployeeBasket}}
                    </div>
                    <div class="dish-mobile-middle-typ-PW">
                        <a>{{ dish.weight }} г.</a>
                        <a>{{ dish.price.replace(/.00/, '') }} ₽</a>
                    </div>
                </div>
            </section>
            <section class="dish-mobile-delete"
                     :class="{
                     'dish-mobile-delete-to-right': dish.swipe === 'right',
                     'dish-mobile-delete-to-left': dish.swipe === 'left',
                     'dish-mobile-delete-to-middle': dish.swipe === 'middle'}">
                <img src="../assets/img/delete.svg">
            </section>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Vue2TouchEvents from 'vue2-touch-events'

    Vue.use(Vue2TouchEvents)
    export default {
        methods: {
            // Добавление блюда
            buyDish(menu_id, dish_id) {
                this.$store.dispatch("OrderDish", {menu_id, dish_id});
                event.stopPropagation()
            },
            // Удаление блюда
            deleteDish(menu_id, dish_id) {
                this.$store.dispatch("DeleteDish", {menu_id, dish_id});
                event.stopPropagation()
            },
            // Удаление блюда по свайпу
            onSwipeLeft(index, menu_id, dish_id) {
                this.$store.dispatch("DeleteDish", {menu_id, dish_id});
                this.dishes.dishes[index].swipe = 'left'
                setTimeout(this.setSwipeMiddle, 200, index)
            },
            // Добавление блюда по свайпу
            onSwipeRight(index, menu_id, dish_id) {
                this.$store.dispatch("OrderDish", {menu_id, dish_id});
                this.dishes.dishes[index].swipe = 'right'
                setTimeout(this.setSwipeMiddle, 200, index)
            },
            // Это нужно для свайпа обратно
            setSwipeMiddle(index) {
                this.dishes.dishes[index].swipe = 'middle'
            }
        },
        computed: {
            dishes() {
                if (this.$store.getters.currentDishes){
                    console.log(this.$store.getters.currentDishes)
                    return this.$store.getters.currentDishes
                }
                else {
                    return []
                }
            },
        },
        async mounted(){
            await this.$store.dispatch('fetchMenu');
            if (this.$store.getters.getError) {
                await this.$store.dispatch("SetNotAuth");
                await this.$store.dispatch("ClearCookies");
                this.$router.push('/signin');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";
    .dishes{
        height: 600px;
    }
    .container {
        margin: 50px 25px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
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
        &-amount {
            width: 82px;
            height: 30px;
            background: #FFFFFF;
            border: 1px solid $font-color;
            border-radius: 10px;
            color: $font-color;
            &-color {
                font-weight: 700;
                font-size: 18px;
                display: flex;
                justify-content: center;
                padding-top: 5px;
            }
        }
        &-middle {
            width: 100%;
            background: white;
            transition: 0.3s;
            height: 130px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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
            padding-bottom: 20px;
        }
        &-add {
            padding-bottom: 20px;
            display: flex;
            justify-content: center;
            button{
                background: none;
                border: none;
                outline: none;
                img {
                    outline: none;
                    margin: 0 10px;
                    width: 30px;
                    height: 30px;
                }
            }
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
    .dish-mobile{display: none;}
    @media (max-width: 790px) {
        .dish {display: none;}
        .container{margin-top: 10px;}
        .dish-mobile {
            position: relative;
            position: relative;
            color: $font-color;
            margin: 30px 0;
            display: grid;
            grid-template-columns: 15% 100% 15%;
            overflow: hidden;
            section {
                height: 100px;
            }
            &-basket{
                transition: 0.2s;
                background: $c-main;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: translateX(-100%);
                img {
                    width: 60px;
                    height: 60px;
                }
                &-to-right{
                    transform: translateX(0%);
                }
                &-to-left{
                    transform: translateX(-100%);
                }
                &-to-middle{
                    transform: translateX(-100%);
                }
            }
            &-middle{
                transition: 0.2s;
                transform: translateX(-15%);
                border-bottom: 1px solid $c-main;
                width: 100%;
                display: flex;
                justify-content: space-between;
                &-to-right{
                    transform: translateX(0%);
                }
                &-to-left{
                    transform: translateX(-30%);
                }
                &-to-middle{
                    transform: translateX(-15%);
                }
                &-about{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-left: 120px;
                    width: 60%;
                    &-name{
                        font-weight: 700;
                        font-size: 22px;
                        line-height: 21px;
                    }
                    &-desc{
                        padding-top: 10px;
                        font-weight: 300;
                        font-size: 14px;
                        line-height: 16px;
                    }
                }
                &-typ{
                    padding: 25px 20px 25px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    &-count{

                    }
                    &-PW{
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        font-size: 24px;
                        a:nth-child(1){
                            font-weight: 600;
                        }
                    }
                }
            }
            &-delete{
                background: linear-gradient(90deg, #A60000 0%, #CE0000 100%), #FFFFFF;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.2s;
                &-to-right{
                    transform: translateX(-100%);
                }
                &-to-left{
                    transform: translateX(-200%);
                }
                &-to-middle{
                    transform: translateX(0%);
                }
                img {
                    width: 60px;
                    height: 60px;
                }
            }
    }
    }
    @media (max-width: 600px) {
        .dish-mobile {
            grid-template-columns: 25% 100% 25%;
            &-middle{
                transform: translateX(-25%);
                &-to-right{
                    transform: translateX(0%);
                }
                &-to-left{
                    transform: translateX(-50%);
                }
                &-to-middle{
                    transform: translateX(-25%);
                }
                &-about{
                    padding-left: 60px;
                    width: 60%;
                    &-name{
                        font-weight: 700;
                        font-size: 20px;
                    }
                }
                &-typ{
                    padding: 10px 5px 10px 0;
                    &-PW{
                        font-size: 20px;
                    }
                }
            }
        }
    }
    @media (max-width: 420px) {
        .dish-mobile {
            &-middle{
                &-about{
                    padding-left: 10px;
                    width: 65%;
                    &-name{
                        font-size: 18px;
                    }
                    &-desc{
                        padding-top: 5px;
                        font-size: 13px;
                    }
                }
                &-typ{
                    padding: 5px 10px 5px 0;
                }
            }
        }
    }
    @media (max-width: 360px) {
        .dish-mobile {
            &-middle{
                &-about{
                    padding-left: 10px;
                    width: 65%;
                    &-name{
                        font-size: 16px;
                    }
                    &-desc{
                        padding-top: 5px;
                        font-size: 12px;
                    }
                }
                &-typ{
                    padding: 5px 10px 5px 0;
                }
            }
        }
    }
</style>