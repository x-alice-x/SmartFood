<template>
    <div class="cart">
        <div class="dish-container">
            <!-- <Header/> -->
            <div v-for="(dish, index) in todayCart.basket_dishes" :key="index">
                <div class="dish" v-show="dish.count > 0">
                    <div class="dish-photo">
                        <img :src="dish.image">
                    </div>
                    <div class="info">
                        <p class="name">{{dish.name}}</p>
                        <p class="weight">{{dish.weight}} г.</p>
                        <p class="price">{{dish.price.replace(/.00/, '')}} &#8381;</p>
                    </div>
                    <div class="dish-add">
                        <img src="../assets/img/minus.svg"
                             @click="deleteDish(index, dish.category_id, todayCart.id, dish.id, count = 1)">
                        <div class="amount">
                            <p>{{dish.count}}</p>
                        </div>
                        <img src="../assets/img/plus.svg"
                             @click="buyDish(index, dish.category_id, todayCart.id, dish.id, count = 1)">
                    </div>
                </div>
            </div>
            <swipe-list
                    ref="list"
                    class="dish-mobile-cart"
                    :items="todayCart.basket_dishes"
            >

                <template v-slot="{item, index, revealed}">

                    <!-- item is the corresponding object from the array -->
                    <!-- index is clearly the index -->
                    <!-- revealLeft is method which toggles the left side -->
                    <!-- revealRight is method which toggles the right side -->
                    <!-- close is method which closes an opened side -->
                    <div ref="content" class="card-content-cart"
                         v-show="item.count > 0"
                         :data-categoryIndex="item.category_id"
                         :data-dishIndex="index"
                         :data-todayCartId="todayCart.id"
                         :data-dishId="item.id"
                         :data-revealed="revealed"
                         :id="item.in_blacklist ? 'blacklisted' : index"
                         @click="closeContent">
                        <div class="dish-mobile-img-cart">
                            <img :src="item.image">
                        </div>
                        <div class="dish-mobile-text-cart">
                            <div class="dish-mobile-text-disc-cart">
                                {{ item.name }}
                            </div>
                            <div class="dish-mobile-price-grams-cart">
                                {{ item.weight }} г.
                            </div>
                            <div class="dish-mobile-price-price-cart">
                                {{ item.price.replace(/.00/, '') }} &#8381;
                            </div>
                        </div>
                        <div class="dish-mobile-price-cart">
                            <div class="dish-mobile-price-count-cart">
                                Кол-во: {{ item.count }} шт.
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:left="{ item, close, index }">
                    <div class="swipeout-action dish-mobile-add-cart"
                         @click="buyDish(index, item.category_id, todayCart.id, item.id, count = 1)"
                         :style="{width: widthXCart + 'px', transition: '.1s !important'}"
                         :class="{aloneButtonL: item.showTransitionLeft && $el.clientWidth > 500,
                                 aloneButtonM: item.showTransitionLeft && $el.clientWidth <= 500 && $el.clientWidth > 400,
                                 aloneButtonS: item.showTransitionLeft && $el.clientWidth <= 400}"
                    >
                        <div class="dish-mobile-add-dish-cart">
                            <img src="../assets/img/plus1.svg">
                            <div>ДОБАВИТЬ</div>
                        </div>
                    </div>
                </template>
                <template v-slot:right="{ item, close, index }">
                    <div class="swipeout-action dish-mobile-delete-cart"
                         @click="deleteDish(index, item.category_id, todayCart.id, item.id, count = 1)"
                         :style="{width: widthXCart + 'px', transition: '.1s !important'}"
                         :class="{aloneButtonDelL: item.showTransitionRight && $el.clientWidth > 500,
                                 aloneButtonDelM: item.showTransitionRight && $el.clientWidth <= 500 && $el.clientWidth > 400,
                                 aloneButtonDelS: item.showTransitionRight && $el.clientWidth <= 400}"
                    >
                        <div class="dish-mobile-delete-dish-cart">
                            <img src="../assets/img/minus1.svg">
                            <div>УДАЛИТЬ</div>
                        </div>
                    </div>
                </template>
                <template v-slot:empty>
                    <div>
                        list is empty ( filtered or just empty )
                    </div>
                </template>
            </swipe-list>
        </div>

        <div class="sum-container">
            <div class="sum">
                <p>Итого:</p>
                <p class="number">{{todayCart.basket_summ}} &#8381;</p>
            </div>
            <div class="limit"
                 :style="{'color' : (this.todayCart.basket_summ >= this.todayCart.basket_summ_limit ? '#ED2736':'#42D547')}">
                <p>Оставшийся лимит:</p>
                <p class="number">{{todayCart.basket_summ_limit - this.todayCart.basket_summ}} &#8381;</p>
            </div>
        </div>
        <div class="btns">
            <button class="clear-cart" @click="clearCart(todayCart.id)">Очистить корзину</button>
        </div>
    </div>
</template>

<script>
    import {SwipeList} from 'vue-swipe-actions';
    import 'vue-swipe-actions/dist/vue-swipe-actions.css';
    import $ from "jquery";
    // import Header from './Header'
    export default {
        components: {SwipeList},
        data() {
            return {
                revealedCart: '',
                categoryIndexCart: 0,
                dishIndexCart: 0,
                oldDishIndexCart: 0,
                todayCartId: 0,
                dishIdCart: 0,
                downXCart: 0,
                upXCart: 0,
                moveXCart: 0,
                widthXCart: 0,
                // showCart: false,
            }
        },
        methods: {
            buyDish(index, categoryIndex, menu_id, dish_id, count) {
                this.$store.dispatch("OrderDish", {menu_id, dish_id, count});
                this.todayCart.basket_dishes[index].count++;
                this.todayCart.basket_summ = this.todayCart.basket_summ
                    + parseInt(this.todayCart.basket_dishes[index].price);
                this.todayMenu.basket_summ = this.todayCart.basket_summ;
                for (let i = 0; i < this.todayMenu.categories.length; i++) {
                    if (this.todayMenu.categories[i].id == categoryIndex) {
                        for (let j = 0; j < this.todayMenu.categories[i].dishes.length; j++)
                            if (this.todayMenu.categories[i].dishes[j].id == dish_id) {
                                this.todayMenu.categories[i].dishes[j].in_basket_count++;
                            }
                    }
                }
                // this.todayMenu.categories[categoryIndex].dishes[dish_id].in_basket_count++;
            },
            deleteDish(index, categoryIndex, menu_id, dish_id, count) {
                this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
                console.log(this.todayCart.basket_dishes[index])
                this.todayCart.basket_dishes[index].count--;
                this.todayCart.basket_summ = this.todayCart.basket_summ
                    - parseInt(this.todayCart.basket_dishes[index].price);
                this.todayMenu.basket_summ = this.todayCart.basket_summ;
                for (let i = 0; i < this.todayMenu.categories.length; i++) {
                    if (this.todayMenu.categories[i].id == categoryIndex) {
                        for (let j = 0; j < this.todayMenu.categories[i].dishes.length; j++)
                            if (this.todayMenu.categories[i].dishes[j].id == dish_id) {
                                this.todayMenu.categories[i].dishes[j].in_basket_count--;
                            }
                    }
                }
            },
            clearCart(menu_id) {
                let dish_id = 0;
                let categoryIndex = 0;
                this.$store.dispatch("ClearCart", {menu_id});
                for (let i = 0; i < this.todayCart.basket_dishes.length; i++) {
                    dish_id = this.todayCart.basket_dishes[i].id;
                    categoryIndex = this.todayCart.basket_dishes[i].category_id;
                    this.todayCart.basket_dishes[i].count = 0;
                    for (let k = 0; k < this.todayMenu.categories.length; k++) {
                        if (this.todayMenu.categories[k].id == categoryIndex) {
                            for (let j = 0; j < this.todayMenu.categories[k].dishes.length; j++)
                                if (this.todayMenu.categories[k].dishes[j].id == dish_id) {
                                    this.todayMenu.categories[k].dishes[j].in_basket_count = 0;
                                }
                        }
                    }
                }
                this.todayCart.basket_summ = 0;
                this.todayMenu.basket_summ = 0;
                window.screen.width > 790 ? this.$emit('closeCart') : this.$emit('closeCartMobile');
            },
            closeContent() {
                this.$refs.list.close()
                setTimeout(() => {
                    this.$store.commit('showTransitionCart', {
                        name: 'all',
                        indexDishes: this.dishIndexCart,
                        bool: false
                    });
                    if (window.screen.width > 650) {
                        this.widthXCart = 60;
                    } else if (window.screen.width <= 650 && window.screen.width > 500) {
                        this.widthXCart = 30;
                    } else if (window.screen.width <= 500 && window.screen.width > 400) {
                        this.widthXCart = 10;
                    } else if (window.screen.width <= 400) {
                        this.widthXCart = 1;
                    }
                }, 50)
            },
        },
        computed: {
            todayCart() {
                return this.$store.getters.getTodayCart;
            },
            todayMenu() {
                return this.$store.getters.todayMenu;
            }
        },
        async mounted() {
            let self = this;
            if (window.screen.width > 650) {
                this.widthXCart = 60;
            } else if (window.screen.width <= 650 && window.screen.width > 500) {
                this.widthXCart = 30;
            } else if (window.screen.width <= 500 && window.screen.width > 400) {
                this.widthXCart = 10;
            } else if (window.screen.width <= 400) {
                this.widthXCart = 1;
            }
            await this.$store.dispatch("fetchCart");
            $(document).on("touchstart", ".card-content-cart", function (event) {
                self.categoryIndexCart = event.currentTarget.dataset.categoryindex;
                self.dishIndexCart = event.currentTarget.dataset.dishindex;
                if (self.dishIndexCart != self.oldDishIndexCart) {
                    self.$refs.list.$children[self.oldDishIndexCart].close();
                }
                self.todayCartId = event.currentTarget.dataset.todaycartid;
                self.dishIdCart = event.currentTarget.dataset.dishid;
                self.downXCart = event.changedTouches[0].clientX;
                event.stopPropagation();
            });
            $(document).on("touchmove", ".card-content-cart", function (event) {
                self.moveXCart = event.changedTouches[0].clientX;
                if (self.moveXCart - self.downXCart >= window.screen.width / 1.6) {
                    self.widthXCart = 220;
                    setTimeout(() => {
                        self.$store.commit('showTransitionCart', {
                            name: 'left',
                            indexDishes: self.dishIndexCart,
                            bool: true
                        });
                    }, 50)
                } else if (self.moveXCart - self.downXCart <= -(window.screen.width / 1.6)) {
                    self.widthXCart = 220;
                    setTimeout(() => {
                        self.$store.commit('showTransitionCart', {
                            name: 'right',
                            indexDishes: self.dishIndexCart,
                            bool: true
                        });
                    }, 50)
                } else {
                    self.$store.commit('showTransitionCart', {
                        name: 'all',
                        indexDishes: self.dishIndexCart,
                        bool: false
                    });
                }
            });
            $(document).on("touchend", ".card-content-cart", function (event) {
                self.upXCart = event.changedTouches[0].clientX;
                self.revealedCart = event.currentTarget.dataset.revealed;
                self.oldDishIndexCart = self.dishIndexCart;
            });
        },
        watch: {
            upXCart: function () {
                if (Math.abs(this.upXCart - this.downXCart) >= window.screen.width / 1.6) {
                    if (this.revealedCart === 'right') {
                        /*eslint-disable */
                        this.deleteDish(this.dishIndexCart, this.categoryIndexCart, this.todayCartId, this.dishIdCart, 1);
                        /*eslint-enable */
                        this.$refs.list.close()
                        setTimeout(() => {
                            this.$store.commit('showTransitionCart', {
                                name: 'all',
                                indexDishes: this.dishIndexCart,
                                bool: false
                            });
                            if (window.screen.width > 650) {
                                this.widthXCart = 60;
                            } else if (window.screen.width <= 650 && window.screen.width > 500) {
                                this.widthXCart = 30;
                            } else if (window.screen.width <= 500 && window.screen.width > 400) {
                                this.widthXCart = 10;
                            } else if (window.screen.width <= 400) {
                                this.widthXCart = 1;
                            }
                        }, 50)
                    } else if (this.revealedCart === 'left') {
                        /*eslint-disable */
                        this.buyDish(this.dishIndexCart, this.categoryIndexCart, this.todayCartId, this.dishIdCart, 1);
                        /*eslint-enable */
                        this.$refs.list.close()
                        setTimeout(() => {
                            this.$store.commit('showTransitionCart', {
                                name: 'all',
                                indexDishes: this.dishIndexCart,
                                bool: false
                            });
                            if (window.screen.width > 650) {
                                this.widthXCart = 60;
                            } else if (window.screen.width <= 650 && window.screen.width > 500) {
                                this.widthXCart = 30;
                            } else if (window.screen.width <= 500 && window.screen.width > 400) {
                                this.widthXCart = 10;
                            } else if (window.screen.width <= 400) {
                                this.widthXCart = 1;
                            }
                        }, 50)
                    }
                } else {
                    this.$store.commit('showTransitionCart', {
                        name: 'all',
                        indexDishes: this.dishIndexCart,
                        bool: false
                    });
                    if (window.screen.width > 650) {
                        this.widthXCart = 60;
                    } else if (window.screen.width <= 650 && window.screen.width > 500) {
                        this.widthXCart = 30;
                    } else if (window.screen.width <= 500 && window.screen.width > 400) {
                        this.widthXCart = 10;
                    } else if (window.screen.width <= 400) {
                        this.widthXCart = 1;
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";

    .dish-mobile-cart {
        display: none;
    }

    .cart {
        width: 500px;
        height: auto;
        box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.25);
        background: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        .dish-container {
            height: 500px;
            // padding-top: 2%;
            overflow-y: scroll;
        }

        .dish-photo {
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 80px;
                height: auto;
                clip-path: circle(30px at center);
                margin-left: -10px;
                margin-top: -10px;
                margin-right: 10px;
            }
        }

        .dish {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin: 2%;
            width: 94%;
            height: 80px;

            .info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                width: 90%;
                height: auto;
                font-size: 14px;
                font-weight: 700;

                .name {
                    font-size: 16px;
                }

                .weight {
                    font-size: 14px;
                    font-weight: 300;
                    text-align: left;
                    margin-top: 5px;
                }

                .price {
                    font-weight: 700;
                    font-size: 14px;
                    text-align: left;
                    margin-top: 3px;
                }
            }
        }

        .dish-add {
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 20px;
                height: auto;
                margin: 0 5px;
                padding: 9px;
                cursor: pointer;
            }

            .amount {
                border: 1px solid #460b79;
                border-radius: 10px;
                background: #fff;
                width: 68px;
                height: 28px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .sum-container {
            width: 100%;
            border-top: 1px solid #bfbcbc;
            border-bottom: 1px solid #bfbcbc;
            margin-bottom: 2%;
            overflow: hidden;
        }

        .sum {
            display: flex;
            justify-content: space-between;
            width: 95%;
            color: #460b79;
            font-size: 20px;
            font-weight: 700;
            margin: 14px auto 10px 25px;
        }

        .limit {
            display: flex;
            justify-content: space-between;
            width: 95%;
            // color: #44a334;
            font-size: 18px;
            font-weight: 400;
            margin-left: 25px;
            margin-bottom: 14px;
        }

        .number {
            margin-right: 5%;
            font-size: 18px;
        }

        .btns {
            margin-bottom: 2%;
            width: 100%;
            min-height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;

            button {
                border-radius: 46px;
                outline: none;
                width: 192px;
                height: 48px;
                font-family: 'Roboto', sans-serif;
                font-size: 16px;
                background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
                border-radius: 46px;
                border: none;
                color: #fff;
                text-transform: uppercase;
                font-weight: 700;
            }
        }

        @media (max-width: 790px) {
            .sum-container {
                display: none;
            }
            .cart {
                width: 100vw;
                height: 95vh;
                // margin-top: 50px;
            }
            .dish-container {
                height: 850px;
                overflow: scroll;
                // margin-top: 38px;
            }
            .dish {
                display: none;
            }
            .dish-mobile-cart {
                display: flex;
                width: 100%;
                overflow-y: scroll;

                .swipeout-action {
                    display: flex;
                    align-items: center;
                    padding: 0 3rem;
                    cursor: pointer;
                    left: 0;
                }

                .swipeout-action.dish-mobile-delete-cart {
                    height: 100%;
                    background: linear-gradient(90deg, #A60000 0%, #CE0000 100%), #FFFFFF;

                    .dish-mobile-delete-dish-cart {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 60px;

                        img {
                            width: 40px;
                        }

                        div {
                            margin-top: 5px;
                            font-weight: 700;
                            font-size: 14px;
                            color: #FFFFFF;
                        }
                    }
                }

                .swipeout-action.dish-mobile-add-cart {
                    display: flex;
                    justify-content: flex-end;
                    height: 100%;
                    background: linear-gradient(90deg, #460B79 0%, #88267F 100%), #FFFFFF;

                    .dish-mobile-add-dish-cart {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 60px;

                        img {
                            width: 40px;
                        }

                        div {
                            margin-top: 5px;
                            font-weight: 700;
                            font-size: 14px;
                            color: #FFFFFF;
                        }
                    }
                }

                .card-content-cart {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 110px;
                    background: #FFFFFF;
                    width: 100%;
                    border-top: 1px solid #F2EDF6;

                    .dish-mobile-img-cart {
                        img {
                            width: 135px;
                            height: auto;
                            clip-path: circle(50px at center);
                            margin-left: -12px;
                        }
                    }

                    .dish-mobile-text-cart {
                        width: 60%;
                        height: 125px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: center;
                        flex-direction: column;

                        .dish-mobile-text-disc-cart {
                            display: flex;
                            flex-wrap: wrap;
                            font-weight: 700;
                            font-size: 22px;
                            color: #460B79;
                        }

                        .dish-mobile-price-grams-cart, .dish-mobile-price-price-cart {
                            font-weight: 400;
                            font-size: 20px;
                            display: flex;
                            align-items: center;
                            text-align: right;
                            color: #460B79;
                        }

                        .dish-mobile-price-price-cart {
                            font-weight: 700;
                        }
                    }

                    .dish-mobile-price-cart {
                        width: 20%;

                        .dish-mobile-price-count-cart {
                            font-size: 20px;
                        }
                    }
                }

                .transition-right {
                    transform: translate3d(100%, 0, 0) !important;
                }

                .transition-left {
                    transform: translate3d(-500%, 0, 0) !important;
                }

                .toolbar {
                    display: flex;
                    align-items: center;
                }

                .toolbar .toolbar-section {
                    flex: 0 0 auto;
                }

                .toolbar .toolbar-section--center {
                    flex: 1000 1 0%;
                }
            }
            .btns {
                position: fixed;
                bottom: 40px;

                button {
                    font-weight: 400;
                    width: 170px;
                    font-size: 14px;
                    height: 44px;
                }
            }
        }
        @media (max-width: 650px) {
            .dish-container {
                height: 800px;
                // padding-top: 50px;
                overflow: scroll;
                margin-top: 0;
            }
            .dish-mobile-cart {
                .swipeout-action.dish-mobile-delete-cart {
                    .dish-mobile-delete-dish-cart {
                        width: 30px;

                        div {
                            font-size: 12px;
                        }
                    }
                }

                .swipeout-action.dish-mobile-add-cart {
                    .dish-mobile-add-dish-cart {
                        width: 30px;

                        div {
                            font-size: 12px;
                        }
                    }
                }

                .card-content-cart {
                    height: 90px;

                    .dish-mobile-img-cart {
                        img {
                            width: 110px;
                            height: auto;
                            clip-path: circle(40px at center);
                            margin-left: -12px;
                        }
                    }

                    .dish-mobile-text-cart {
                        width: 60%;
                        height: 125px;

                        .dish-mobile-text-disc-cart {
                            font-size: 18px;
                        }

                        .dish-mobile-price-grams-cart, .dish-mobile-price-price-cart {
                            font-size: 16px;
                        }
                    }

                    .dish-mobile-price-cart {
                        .dish-mobile-price-count-cart {
                            font-size: 18px;
                        }
                    }
                }
            }
            .btns {
                position: fixed;
                bottom: 40px;
            }
        }
        @media (max-width: 550px) {
            .dish-mobile-cart {
                .card-content-cart {
                    .dish-mobile-price-cart {
                        width: 13%;
                    }
                }
            }
        }
        @media (max-width: 500px) {
            .sum {
                p {
                    font-size: 16px;
                }

                .number {
                    font-size: 16px;
                    margin-right: 20px;
                }
            }
            .limit {
                p {
                    font-size: 16px;
                }

                .number {
                    font-size: 16px;
                    margin-right: 20px;
                }
            }
            .dish-container {
                height: 500px;
                overflow: scroll;
            }
            .dish-mobile-cart {
                .swipeout-action.dish-mobile-delete-cart {
                    .dish-mobile-delete-dish-cart {
                        width: 10px;

                        img {
                            width: 25px;
                        }

                        div {
                            font-size: 10px;
                        }
                    }
                }

                .swipeout-action.dish-mobile-add-cart {
                    .dish-mobile-add-dish-cart {
                        width: 10px;

                        img {
                            width: 25px;
                        }

                        div {
                            font-size: 10px;
                        }
                    }
                }
            }
        }
        @media (max-width: 475px) {
            .dish-mobile-cart {
                .card-content-cart {
                    height: 90px;

                    .dish-mobile-img-cart {
                        img {
                            width: 110px;
                            height: auto;
                            clip-path: circle(35px at center);
                            margin-left: -12px;
                        }
                    }

                    .dish-mobile-text-cart {
                        width: 60%;
                        height: 125px;

                        .dish-mobile-text-disc-cart {
                            font-size: 16px;
                        }

                        .dish-mobile-price-grams-cart, .dish-mobile-price-price-cart {
                            font-size: 14px;
                        }
                    }

                    .dish-mobile-price-cart {
                        .dish-mobile-price-count-cart {
                            font-size: 16px;
                        }
                    }
                }
            }
            .btns {
                position: fixed;
                bottom: 30px;
            }
        }
        @media (max-width: 430px) {
            .dish-container {
                height: 600px;
            }
            .dish-mobile-cart {
                .card-content-cart {

                    .dish-mobile-text-cart {
                        width: 60%;
                        height: 125px;

                        .dish-mobile-text-disc-cart {
                            font-size: 16px;
                        }

                        .dish-mobile-price-grams-cart, .dish-mobile-price-price-cart {
                            font-size: 14px;
                        }
                    }

                    .dish-mobile-price-cart {
                        width: 15%;

                        .dish-mobile-price-count-cart {
                            font-size: 16px;
                        }
                    }
                }
            }
            .btns {
                position: fixed;
                bottom: 50px;
            }
        }
        @media (max-width: 400px) {
            .dish-mobile-cart {
                .swipeout-action.dish-mobile-delete-cart {
                    .dish-mobile-delete-dish-cart {
                        width: 0px;
                        /*img {*/
                        /*    width: 25px;*/
                        /*}*/
                        div {
                            font-size: 10px;
                        }
                    }
                }

                .swipeout-action.dish-mobile-add-cart {
                    .dish-mobile-add-dish-cart {
                        width: 0px;
                        /*img {*/
                        /*    width: 25px;*/
                        /*}*/
                        div {
                            font-size: 10px;
                        }
                    }
                }

                .card-content-cart {
                    height: 90px;

                    .dish-mobile-img-cart {
                        img {
                            width: 90px;
                            clip-path: circle(30px at center);
                        }
                    }

                    .dish-mobile-text-cart {
                        width: 60%;
                        height: 125px;

                        .dish-mobile-text-disc-cart {
                            font-size: 13px;
                        }

                        .dish-mobile-price-grams-cart, .dish-mobile-price-price-cart {
                            font-size: 16px;
                        }
                    }

                    .dish-mobile-price-cart {
                        width: 15%;

                        .dish-mobile-price-count-cart {
                            font-size: 15px;
                        }
                    }
                }
            }
        }
        @media (max-width: 400px) {
            .dish-mobile-cart {
                .card-content-cart {
                    .dish-mobile-img-cart {
                        img {
                            width: 90px;
                            clip-path: circle(30px at center);
                        }
                    }

                    .dish-mobile-text-cart {
                        width: 50%;
                        height: 125px;

                        .dish-mobile-text-disc-cart {
                            font-size: 13px;
                        }

                        .dish-mobile-price-grams-cart, .dish-mobile-price-price-cart {
                            font-size: 14px;
                        }
                    }

                    .dish-mobile-price-cart {
                        width: 20%;

                        .dish-mobile-price-count-cart {
                            font-size: 15px;
                        }
                    }
                }
            }
        }

        @media (max-width: 376px) {
            .dish-container {
                height: 520px;
            }
            .btns {
                position: fixed;
                bottom: 40px;
            }
        }
        @media (max-width: 375px) and (min-height: 800px) {
            .dish-container {
                height: 670px;
            }
        }
        @media (max-width: 340px) {
            .dish-container {
                height: 450px;
                overflow: scroll;
            }
            .btns {
                position: fixed;
                bottom: 40px;
            }
        }
        // .limit {
        //   // color: #44A334;
        //   font-size: 18px;
        //   font-weight: 400;
        //   margin-left: 25px;
        //   margin-bottom: 14px;
    }

</style>
