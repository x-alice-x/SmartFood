<template>
    <div class="dishes">
        <div class="container">
            <Weekdays class="week"></Weekdays>
            <div class="dish-category" v-for="(categories, categoryIndex) in todayMenu.categories"
                 :key="categoryIndex">
                <h3 class="category-name" v-if="categories.dishes.length">{{categories.name}}</h3>
                <div class="dish-main">
                    <div class="dish"
                         v-for="(dish, index) in categories.dishes" :key="index"
                         @click="buyDish(todayMenu.id, dish.id, index, categoryIndex, buttonId = 'card', count = 1)"
                         :id="dish.in_blacklist ? 'blacklisted' : index"
                         :class="{ active: dish.in_basket_count == 0}">
                        <div class="dish-top">
                            <div class="dish-img" :style="{'background-image': `url(${dish.image})`}">
                                <div class="black-list-container" tabindex="-1" @click="manageBL">
                                    <img class="black-list" src="../assets/img/newDots.svg"/>
                                </div>
                                <div id="black-list-content">
                                    <button v-if="!dish.in_blacklist"
                                            @click="blackListChange(todayMenu.id, dish.id, index, categoryIndex)">
                                        Добавить в черный список
                                    </button>
                                    <button v-if="dish.in_blacklist"
                                            @click="blackListChange(todayMenu.id, dish.id, index, categoryIndex)">
                                        Вернуть из черного списка
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="dish-middle">
                            <div class="dish-name">
                                {{ dish.name }}
                            </div>
                            <div v-if="dish.in_basket_count === 0" class="dish-descr">{{dish.description}}</div>
                            <div class="dish-add" v-if="dish.in_basket_count > 0">
                                <button>
                                    <img src="../assets/img/minus.svg"
                                         @click="deleteDish(todayMenu.id, dish.id, index, categoryIndex, count = 1)">
                                </button>
                                <div class="dish-amount"
                                     :class="{invalid: invalid}">
                                    <div class="dish-amount-color">
                                        <input type="text" v-model.trim="dish.in_basket_count"
                                               @focusout="buyDish(todayMenu.id, dish.id, index, categoryIndex, buttonId = 'input',count = dish.in_basket_count)"
                                               @click="oldCount = dish.in_basket_count">
                                    </div>
                                </div>
                                <button>
                                    <img src="../assets/img/plus.svg"
                                         @click="buyDish(todayMenu.id, dish.id, index, categoryIndex, buttonId = 'plus', 1)">
                                </button>
                            </div>
                        </div>
                        <div class="dish-bottom">
                            <div class="dish-typ">
                                <a>{{ dish.price.replace(/.00/, '') }} &#8381;</a>
                                <a>{{ dish.weight }} г.</a>
                            </div>
                        </div>
                    </div>
                    <swipe-list
                            ref="list"
                            class="dish-mobile"
                            :items="categories.dishes"
                    >
                        <template v-slot="{item, index, revealed}">
                            <!-- item is the corresponding object from the array -->
                            <!-- index is clearly the index -->
                            <!-- revealLeft is method which toggles the left side -->
                            <!-- revealRight is method which toggles the right side -->
                            <!-- close is method which closes an opened side -->
                            <div ref="content" class="card-content"
                                 :data-categoryIndex="categoryIndex"
                                 :data-dishIndex="index"
                                 :data-todayMenuId="todayMenu.id"
                                 :data-dishId="item.id"
                                 :data-revealed="revealed"
                                 :data-inBlack="item.in_blacklist"
                                 :id="item.in_blacklist ? 'blacklisted' : index"
                                 @click="closeContent(categoryIndex)">
                                <div class="dish-mobile-img">
                                    <img :src="item.image">
                                </div>
                                <div class="dish-mobile-text">
                                    <div class="dish-mobile-text-disc">
                                        {{ item.name }}
                                    </div>
                                    <div class="dish-mobile-text-prelude">
                                        {{ item.description}}
                                    </div>
                                </div>
                                <div class="dish-mobile-price">
                                    <div class="dish-mobile-price-amount">
                                        В корзине: {{item.in_basket_count}}
                                    </div>
                                    <div class="dish-mobile-price-grams">
                                        {{ item.weight }} г.
                                    </div>
                                    <div class="dish-mobile-price-price">
                                        {{ item.price.replace(/.00/, '') }} &#8381;
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-slot:left="{ item, close, index }">
                            <div class="swipeout-action dish-mobile-add"
                                 @click="buyDish(todayMenu.id, item.id, index, categoryIndex, buttonId = 'plus', count = 1)"
                                 :style="{width: widthX + 'px', transition: '.1s !important'}"
                                 :class="{aloneButtonL: item.showTransition && !item.in_blacklist && $el.clientWidth > 500,
                                 aloneButtonM: item.showTransition && !item.in_blacklist && $el.clientWidth <= 500 && $el.clientWidth > 400,
                                 aloneButtonS: item.showTransition && !item.in_blacklist && $el.clientWidth <= 400}"
                            >
                                <div class="dish-mobile-add-dish">
                                    <img src="../assets/img/cartMobile.svg">
                                    <div>ДОБАВИТЬ</div>
                                </div>
                            </div>
                            <div class="swipeout-action dish-mobile-black-add"
                                 @click="blackListChange(todayMenu.id, item.id, index, categoryIndex)"
                                 v-if="item.in_blacklist && item.showBlackList">
                                <div class="dish-mobile-black-add-dish">
                                    <img src="../assets/img/blackListAdd.svg">
                                    <div>ВЕРНУТЬ ИЗ ЧЕРНОГО СПИСКА</div>
                                </div>
                            </div>
                        </template>
                        <template v-slot:right="{ item, close, index }">
                            <div class="swipeout-action dish-mobile-black-delete"
                                 @click="blackListChange(todayMenu.id, item.id, index, categoryIndex)"
                                 v-if="!item.in_blacklist && item.showBlackList">
                                <div class="dish-mobile-black-delete-dish">
                                    <img src="../assets/img/blackListDelete.svg">
                                    <div>ДОБАВИТЬ В ЧЕРНЫЙ СПИСОК</div>
                                </div>
                            </div>
                            <div class="swipeout-action dish-mobile-delete"
                                 @click="deleteDish(todayMenu.id, item.id, index, categoryIndex, count = 1)"
                                 :style="{width: widthX + 'px', transition: '.1s !important'}"
                                 :class="{aloneButtonDelL: item.showTransition && item.in_blacklist && $el.clientWidth > 500,
                                 aloneButtonDelM: item.showTransition && item.in_blacklist && $el.clientWidth <= 500 && $el.clientWidth > 400,
                                 aloneButtonDelS: item.showTransition && item.in_blacklist && $el.clientWidth <= 400}"
                            >
                                <div class="dish-mobile-delete-dish">
                                    <img src="../assets/img/delete.svg">
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
            </div>
            <transition name="slide-fade">
                <Cart v-if="showCart" @closeCartMobile="showCart=false" class="cart_comp"/>
            </transition>
            <div class="total-sum-container" @click="cartActive()">
                <div class="total-sum">
                    <div class="total-container">
                        <p class="money-spent">{{todayMenu.basket_summ}} &#8381;</p>
                        <img class="cart-icon" src="../assets/img/cart_white.svg"/>
                        <!-- Юля добавила ви байнд в р тэг ниже, не удалять -->
                        <p class="money-left"
                           v-bind:style="{'color' : (this.todayMenu.basket_summ >= this.todayMenu.basket_summ_limit ? '#ED2736':'#42D547')}">
                            {{moneyLeft}} &#8381;</p>
                    </div>
                    <div class="show-black-listed">
                        <label class="switch">
                            <input type="checkbox" @click="blackListMenuChange">
                            <span class="slider round"></span>
                        </label>
                        <p>Черный список</p>
                    </div>
                </div>
            </div>
        </div>
        <button @click="scrollTop" class="arrow"><img src="../assets/img/arrow.svg" alt="arrow"></button>
        <notifications class="my-style" group="foo"/>
    </div>
</template>

<script>
    import {SwipeList} from 'vue-swipe-actions';
    import 'vue-swipe-actions/dist/vue-swipe-actions.css';
    import Weekdays from './Weekdays'
    import Cart from './Cart'
    import $ from "jquery";
    export default {
        data() {
            return {
                activeItem: null,
                button: {
                    text: 'Добавить в черный список'
                },
                revealed: '',
                categoryIndex: 0,
                dishIndex: 0,
                oldCategoryIndex: 0,
                oldDishIndex: 0,
                todayMenuId: 0,
                dishId: 0,
                downX: 0,
                upX: 0,
                moveX: 0,
                widthX: 0,
                transitionX: 0,
                blackListShow: false,
                inBlack: false,
                showCart: false,
                oldCount: null,
                validationInput05: /^[0-9]+[0-9]|[,.]+[05]+$/,
                validationInput: /^[0-9]+$/,
                invalid: false
            };
        },
        components: {
            Weekdays,
            SwipeList,
            Cart
        },
        methods: {
            cartOpen() {

            },
            cartClose() {

            },
            // Кнопка вверх
            async scrollTop() {
                $('body').animate({'scrollTop': 0}, 500);
                $('html').animate({'scrollTop': 0}, 500)
            },
            cartActive() {
                this.showCart = !this.showCart;
                if (this.showCart == true) {
                    $('body').css('overflow', 'hidden');
                    $('cart_comp').css('overflow-y', 'scroll');
                } else {
                    $('body').css('overflow', 'unset');
                }
            },
            // Добавление блюда
            async buyDish(menu_id, dish_id, index, categoryIndex, buttonId, count) {
                if (buttonId === 'card') {
                    if (this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count == 0) {
                        this.$store.dispatch("OrderDish", {menu_id, dish_id, count});
                        this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count++;

                        this.todayMenu.basket_summ = this.todayMenu.basket_summ
                            + parseInt(this.todayMenu.categories[categoryIndex].dishes[index].price);
                        this.todayCart.basket_summ = this.todayMenu.basket_summ;
                        if (window.screen.width > 790) {
                            console.log("notif");
                            this.$notify({
                                group: 'foo',
                                title: this.todayMenu.categories[categoryIndex].dishes[index].name
                                    + ' добавлено в корзину',
                                duration: 450,
                                width: '130px',
                            });
                        }
                    }
                    event.stopPropagation()
                }
                // Если инпут
                else if (buttonId === 'input') {
                    let valid;
                    categoryIndex == 9 ? valid = this.validationInput05 : valid = this.validationInput;
                    let regexp = new RegExp(valid);
                    let isInputValid = regexp.test(count);

                    if (isInputValid) {
                        this.invalid = false;
                        if (this.oldCount < count) {
                            console.log(count)
                            count = count - this.oldCount;
                            await this.$store.dispatch("OrderDish", {menu_id, dish_id, count});
                            this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count + count;
                        } else if (this.oldCount > count) {
                            count = this.oldCount - count;
                            await this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
                            this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count - count;
                        }
                        let sum = 0;
                        await this.$store.dispatch("fetchCart");
                        console.log(this.todayCart);
                        for (let i = 0; i < this.todayCart.basket_dishes.length; i++) {
                            sum += this.todayCart.basket_dishes[i].price * this.todayCart.basket_dishes[i].count;
                        }
                        this.todayCart.basket_summ = sum;
                    } else if (!count) {
                        count = this.oldCount;
                        await this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
                        await this.$store.dispatch("fetchCart");
                        this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count = 0;
                        let sum = 0;
                        for (let i = 0; i < this.todayCart.basket_dishes.length; i++) {
                            sum += this.todayCart.basket_dishes[i].price * this.todayCart.basket_dishes[i].count;
                        }
                        this.todayCart.basket_summ = sum;
                    }
                    else {
                        this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count = this.oldCount;
                    }
                } else {
                    this.$store.dispatch("OrderDish", {menu_id, dish_id, count});
                    this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count++;
                    this.todayMenu.basket_summ = this.todayMenu.basket_summ
                        + parseInt(this.todayMenu.categories[categoryIndex].dishes[index].price)
                    this.todayCart.basket_summ = this.todayMenu.basket_summ;
                    event.stopPropagation()
                }
            },
            // Удаление блюда
            deleteDish(menu_id, dish_id, index, categoryIndex, count) {
                if (this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count != 0) {
                    this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
                    this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count--;
                    // this.todayCart.basket_dishes[index].count--;
                    this.todayMenu.basket_summ = this.todayMenu.basket_summ
                        - parseInt(this.todayMenu.categories[categoryIndex].dishes[index].price)
                    this.todayCart.basket_summ = this.todayMenu.basket_summ;
                }
                event.stopPropagation()
            },
            closeContent() {
                this.$refs.list[this.categoryIndex].close()
                setTimeout(() => {
                    this.$store.commit('showBlackList', {
                        indexCategory: this.categoryIndex,
                        indexDishes: this.dishIndex,
                        bool: true
                    });
                    this.$store.commit('showTransition', {
                        indexCategory: this.categoryIndex,
                        indexDishes: this.dishIndex,
                        bool: false
                    });
                    if (window.screen.width > 620) {
                        this.widthX = 60;
                    } else if (window.screen.width <= 620 && window.screen.width > 500) {
                        this.widthX = 30;
                    } else if (window.screen.width <= 500 && window.screen.width > 400) {
                        this.widthX = 10;
                    } else if (window.screen.width <= 400) {
                        this.widthX = 1;
                    }
                }, 50)
            },
            blackListChange(menu_id, dish_id, index, categoryIndex) {
                let whichFunc = this.todayMenu.categories[categoryIndex].dishes[index].in_blacklist
                this.$store.dispatch("BlackListChange", {menu_id, dish_id, whichFunc});
                this.todayMenu.categories[categoryIndex].dishes[index].in_blacklist = !whichFunc
                console.log(this.blackListShow)
                console.log(whichFunc)
                if (!whichFunc && !this.blackListShow) {
                    this.todayMenu.categories[categoryIndex].dishes.splice(index, 1)
                }
                event.stopPropagation()
            },
            blackListMenuChange() {
                this.blackListShow = !this.blackListShow
                this.blackListShow ? this.$store.dispatch("fetchMenu", 0) : this.$store.dispatch("fetchMenu", 1)
            },
            manageBL() {
                event.stopPropagation()
            }
        },
        computed: {
            todayMenu() {
                if (this.$store.getters.todayMenu) {
                    return this.$store.getters.todayMenu
                } else {
                    return []
                }
            },
            // Юля добавила moneyLeft
            moneyLeft() {
                return this.todayMenu.basket_summ >= this.todayMenu.basket_summ_limit ?
                    this.todayMenu.basket_summ - this.todayMenu.basket_summ_limit :
                    this.todayMenu.basket_summ_limit - this.todayMenu.basket_summ
            },
            todayCart() {
                return this.$store.getters.getTodayCart;
            }
        },
        async mounted() {
            let self = this;
            if (window.screen.width > 620) {
                this.widthX = 60;
            } else if (window.screen.width <= 620 && window.screen.width > 500) {
                this.widthX = 30;
            } else if (window.screen.width <= 500 && window.screen.width > 400) {
                this.widthX = 10;
            } else if (window.screen.width <= 400) {
                this.widthX = 1;
            }
            await this.$store.dispatch('fetchMenu');
            if (this.$store.getters.getError) {
                await this.$store.dispatch("SetNotAuth");
                await this.$store.dispatch("ClearCookies");
                this.$router.push('/');
            }
            $(document).on("touchstart", ".card-content", function (event) {
                self.categoryIndex = event.currentTarget.dataset.categoryindex;
                self.dishIndex = event.currentTarget.dataset.dishindex;
                if (self.categoryIndex != self.oldCategoryIndex || self.dishIndex != self.oldDishIndex) {
                    self.$refs.list[self.oldCategoryIndex].$children[self.oldDishIndex].close();
                }
                self.todayMenuId = event.currentTarget.dataset.todaymenuid;
                self.dishId = event.currentTarget.dataset.dishid;
                self.buttonId = event.currentTarget.dataset.buttonId;
                self.inBlack = event.currentTarget.dataset.inblack;
                self.downX = event.changedTouches[0].clientX;
                if (!self.revealed) {
                    self.$store.commit('showBlackList', {
                        indexCategory: self.categoryIndex,
                        indexDishes: self.dishIndex,
                        bool: true
                    });
                }
                event.stopPropagation();
            });
            $(document).on("touchmove", ".card-content", function (event) {
                self.moveX = event.changedTouches[0].clientX;
                if (self.moveX - self.downX >= window.screen.width / 1.6) {
                    self.transition = self.moveX - self.downX;
                    if (self.inBlack) {
                        self.widthX = 220;
                        setTimeout(() => {
                            self.$store.commit('showBlackList', {
                                indexCategory: self.categoryIndex,
                                indexDishes: self.dishIndex,
                                bool: false
                            });
                        }, 50)
                    } else {
                        self.widthX = 220;
                        setTimeout(() => {
                            self.$store.commit('showTransition', {
                                indexCategory: self.categoryIndex,
                                indexDishes: self.dishIndex,
                                bool: true
                            });
                        }, 0)
                    }
                } else if (self.moveX - self.downX <= -(window.screen.width / 1.6)) {
                    if (self.inBlack) {
                        self.widthX = 220;
                        setTimeout(() => {
                            self.$store.commit('showTransition', {
                                indexCategory: self.categoryIndex,
                                indexDishes: self.dishIndex,
                                bool: true
                            });
                        }, 0)
                    } else {
                        self.widthX = 220;
                        setTimeout(() => {
                            self.$store.commit('showBlackList', {
                                indexCategory: self.categoryIndex,
                                indexDishes: self.dishIndex,
                                bool: false
                            });
                        }, 50)
                    }
                } else {
                    self.$store.commit('showBlackList', {
                        indexCategory: self.categoryIndex,
                        indexDishes: self.dishIndex,
                        bool: true
                    });
                    self.$store.commit('showTransition', {
                        indexCategory: self.categoryIndex,
                        indexDishes: self.dishIndex,
                        bool: false
                    });
                }
            });
            $(document).on("touchend", ".card-content", function (event) {
                self.upX = event.changedTouches[0].clientX;
                self.revealed = event.currentTarget.dataset.revealed;
                self.oldCategoryIndex = self.categoryIndex;
                self.oldDishIndex = self.dishIndex;
            });
            // Кнопка вверх
            $(window).scroll(() => {
                $(window).scrollTop() > 200
                    ? $('.arrow').addClass('active')
                    : $('.arrow').removeClass('active')
            })
        },
        watch: {
            upX: function () {
                if (Math.abs(this.upX - this.downX) >= window.screen.width / 1.6) {
                    if (this.revealed === 'right') {
                        /*eslint-disable */
                        this.deleteDish(this.todayMenuId, this.dishId, this.dishIndex, this.categoryIndex, 1)
                        /*eslint-enable */
                        this.$refs.list[this.categoryIndex].close()
                        setTimeout(() => {
                            this.$store.commit('showBlackList', {
                                indexCategory: this.categoryIndex,
                                indexDishes: this.dishIndex,
                                bool: true
                            });
                            this.$store.commit('showTransition', {
                                indexCategory: this.categoryIndex,
                                indexDishes: this.dishIndex,
                                bool: false
                            });
                            if (window.screen.width > 620) {
                                this.widthX = 60;
                            } else if (window.screen.width <= 620 && window.screen.width > 500) {
                                this.widthX = 30;
                            } else if (window.screen.width <= 500 && window.screen.width > 400) {
                                this.widthX = 10;
                            } else if (window.screen.width <= 400) {
                                this.widthX = 1;
                            }
                        }, 50)
                    } else if (this.revealed === 'left') {
                        /*eslint-disable */
                        this.buyDish(this.todayMenuId, this.dishId, this.dishIndex, this.categoryIndex, this.buttonId, 1);
                        /*eslint-enable */
                        this.$refs.list[this.categoryIndex].close()
                        setTimeout(() => {
                            this.$store.commit('showBlackList', {
                                indexCategory: this.categoryIndex,
                                indexDishes: this.dishIndex,
                                bool: true
                            });
                            this.$store.commit('showTransition', {
                                indexCategory: this.categoryIndex,
                                indexDishes: this.dishIndex,
                                bool: false
                            });
                            if (window.screen.width > 620) {
                                this.widthX = 60;
                            } else if (window.screen.width <= 620 && window.screen.width > 500) {
                                this.widthX = 30;
                            } else if (window.screen.width <= 500 && window.screen.width > 400) {
                                this.widthX = 10;
                            } else if (window.screen.width <= 400) {
                                this.widthX = 1;
                            }
                        }, 50)
                    }
                } else {
                    this.$store.commit('showBlackList', {
                        indexCategory: this.categoryIndex,
                        indexDishes: this.dishIndex,
                        bool: true
                    });
                    this.$store.commit('showTransition', {
                        indexCategory: this.categoryIndex,
                        indexDishes: this.dishIndex,
                        bool: false
                    });
                    if (window.screen.width > 620) {
                        this.widthX = 60;
                    } else if (window.screen.width <= 620 && window.screen.width > 500) {
                        this.widthX = 30;
                    } else if (window.screen.width <= 500 && window.screen.width > 400) {
                        this.widthX = 10;
                    } else if (window.screen.width <= 400) {
                        this.widthX = 1;
                    }
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";

    // Плавное появление корзины
    .slide-fade-enter-active {
        transition: all .35s ease;
    }
    .slide-fade-leave-active {
        transition: all .35s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */ {
        transform: translateY(400px);
        opacity: 0;
    }

    .my-style {
       margin-top: 36px;
    }
    .cart_comp {
        position: fixed;
        top: 50px;
        width: 100vw;
        height: 93vh;
        z-index: 20;
    }
    /*Кнопка вверх*/
    .arrow {
        position: fixed;
        bottom: -55px;
        right: 100px;
        z-index: 9999;
        outline: none;
        transition: .4s;

        img {
            width: 50px;
            height: 50px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            border-radius: 50%;
        }
    }

    .arrow.active {
        bottom: 33px;
    }
    .dishes {
        max-width: 1500px;
        margin: auto;
    }
    .active {
        cursor: pointer;
    }
    // категории
    .category-name {
        font-size: 40px;
        color: #000;
        width: 25%;
        margin: 0 auto;
        margin-bottom: 1%;
        font-weight: 400;
        text-align: center;
    }
    /* контейнер для кнопочки открывающей кнопку чс */
    .black-list-container {
        outline: none;
        width: fit-content;
        padding: 15px 15px 5px 0;
        margin-left: 325px;
        cursor: pointer;
        background: transparent;
        display: flex;
        justify-content: flex-end;
        .black-list {
            width: 10px;
            height: 25px;
        }
    }
    /* сама кнопка чс */
    #black-list-content {
        display: none;
        position: absolute;
        width: 100%;
        z-index: 1;
    }
    #black-list-content button {
        width: 90%;
        cursor: pointer;
        outline: none;
        border: none;
        background: #fff;
        color: #460B79;
        opacity: .8;
        margin: 0 5%;
        min-height: 45px;
        transition: 0.3s;
        font-weight: 700;
        font-size: 16px;
        z-index: 2;
    }
    .black-list-container:focus + #black-list-content, #black-list-content:hover {
        display: block;
        z-index: 1;
    }
    #black-list-content button:hover {
        opacity: 1;
    }
    /* класс, который делает карточки черно-белыми */
    .is_blacklisted {
        transition: .3s;
        filter: grayscale(100%);
    }
    #blacklisted {
        transition: .3s;
        filter: grayscale(100%);
    }
    /* плашка внизу страницы */
    .total-sum {
        display: none;
    }
    .total-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 300px;
        background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
        color: #fff;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        height: 50px;
        padding: 0 20px;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 501;
        p {
            font-size: 24px;
            font-weight: bold;
            min-width: 95px;
            text-align: center;
        }
    }
    .cart-icon {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 2%;
    }
    .dishes {
        height: 600px;
    }
    // .week-mob {
    //     display: none !important;
    // }
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: $font-color;
        margin-bottom: 10px;
    }
    .dish-main {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
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
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        transition: 0.3s;
        // &-top {
        //     .dish-img {
        //         display: flex;
        //         justify-content: flex-end;
        //     }
        // }
        &:hover {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        }
        &-category {
            margin-bottom: 5%;
        }
        // &-category:last-child {
        //     margin-bottom: 30px;
        // }
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

                input {
                    color: $font-color;
                    font-weight: 700;
                    font-size: 18px;
                    text-align: center;
                    width: 90%;
                    border: none;
                    outline: none;
                    margin-top: -2px;
                }
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
            button {
                background: none;
                border: none;
                outline: none;
                cursor: pointer;
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
    .dish-mobile {
        display: none;
    }
    @media (max-width: 1110px) {
        /* плашка внизу страницы */
        .total-container {
            width: 250px;
        }
        /* контейнер слайдера чс */
        .show-black-listed {
            right: 7%;
        }
    }
    @media (max-width: 839px) {
        /* плашка внизу страницы */
        .total-sum {
            flex-direction: column;
        }
        .container {
            margin-bottom: 10px;
        }
        /* контейнер слайдера чс */
        .show-black-listed {
            left: 50%;
            transform: translateX(-50%);
            bottom: 60px;
        }
        .mobile-container {
            margin-bottom: 90px;
        }
    }
    // Юля оч много меняла в этом медиа квери, лучше целиком его добавлять в мастер
    @media (max-width: 790px) {
        .dishes {
            overscroll-behavior: contain;
        }
        .cart_comp {
            height: 96vh;
            overflow-y: scroll;
        }
        .arrow {
            display: none;
        }
        .category-name {
            width: 85%;
            margin: 10px auto 20px auto;
        }
        .dish {
            display: none;
        }
        .container {
            margin-top: 10px;
            // .week {
            //     display: none;
            // }
        }
        // .week-mob {
        //     display: block !important;
        // }
        .dish-mobile {
            display: flex;
            width: 100%;
            .swipeout-action {
                display: flex;
                align-items: center;
                padding: 0 3rem;
                cursor: pointer;
                left: 0;
            }
            .swipeout-action.dish-mobile-delete {
                height: 100%;
                background: linear-gradient(90deg, #A60000 0%, #CE0000 100%), #FFFFFF;
                .dish-mobile-delete-dish {
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
            .swipeout-action.dish-mobile-add {
                display: flex;
                justify-content: flex-end;
                height: 100%;
                background: linear-gradient(90deg, #460B79 0%, #88267F 100%), #FFFFFF;
                .dish-mobile-add-dish {
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
            .swipeout-action.dish-mobile-black-add {
                width: 60px;
                height: 100%;
                background: linear-gradient(0deg, #F2EDF6, #F2EDF6), #FFFFFF;
                .dish-mobile-black-add-dish {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    width: 100%;
                    img {
                        width: 30px;
                    }
                    div {
                        margin-top: 5px;
                        font-weight: 700;
                        font-size: 14px;
                        color: #460B79;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-delete {
                width: 60px;
                height: 100%;
                background: linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0.81) 100%), #FFFFFF;
                .dish-mobile-black-delete-dish {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    width: 100%;
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
            .card-content {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 110px;
                background: #FFFFFF;
                width: 100%;
                border-top: 1px solid #F2EDF6;
                .dish-mobile-img {
                    img {
                        width: 135px;
                        height: auto;
                        clip-path: circle(50px at center);
                        margin-left: -12px;
                    }
                }
                .dish-mobile-text {
                    width: 60%;
                    height: 125px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    flex-direction: column;
                    .dish-mobile-text-disc {
                        display: flex;
                        flex-wrap: wrap;
                        font-weight: 700;
                        font-size: 22px;
                        color: #460B79;
                    }
                    .dish-mobile-text-prelude {
                        height: auto;
                        font-weight: 400;
                        font-size: 16px;
                        color: #460B79;
                    }
                }
                .dish-mobile-price {
                    width: 23%;
                    .dish-mobile-price-grams, .dish-mobile-price-price {
                        font-weight: 400;
                        font-size: 28px;
                        display: flex;
                        align-items: center;
                        text-align: right;
                        color: #460B79;
                    }
                    .dish-mobile-price-price {
                        font-weight: 700;
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
        .total-sum {
            display: flex;
            flex-direction: row;
            align-items: center;
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            z-index: 20;
            // height: 95px;
            flex-direction: column;
        }
        .total-container {
            display: flex;
            flex-direction: row;
            height: 50px;
            width: 100%;
            z-index: 2;
            justify-content: center;
            align-items: center;
            p {
                font-size: 24px;
            }
        }
        .cart-icon {
            width: 35px;
            height: 35px;
            margin: 0 40px;
        }
        .money-spent, .money-left {
            font-size: 26px;
            font-weight: 700;
        }
        .money-left {
            color: #42D547;
        }
        /* контейнер слайдера чс */
        .show-black-listed {
            align-items: center;
            justify-content: center;
            width: 100%;
            z-index: 2;
            p {
                font-size: 18px;
            }
        }
        /* слайдер */
        .switch {
            width: 45px;
            height: 22px;
        }
        /* слайдер для включения чс*/
        .slider {
            &:before {
                height: 18px;
                width: 18px;
                left: 2px;
                bottom: 2px;
            }
        }
        input:checked + .slider:before {
            transform: translateX(22px);
        }

    }
    // Юля оч много меняла в этом медиа квери, лучше целиком его добавлять в мастер
    @media (max-width: 620px) {
        .week {
            margin-bottom: 0;
        }
        .container {
            margin-bottom: 20px;
        }
        .category-name {
            width: 85%;
            font-size: 24px;
        }
        .dish-mobile {
            display: flex;
            width: 100%;
            .swipeout-action {
                display: flex;
                align-items: center;
                padding: 0 3rem;
                cursor: pointer;
                left: 0;
            }
            .swipeout-action.dish-mobile-delete {
                .dish-mobile-delete-dish {
                    width: 30px;
                    div {
                        font-size: 12px;
                    }
                }
            }
            .swipeout-action.dish-mobile-add {
                .dish-mobile-add-dish {
                    width: 30px;
                    div {
                        font-size: 12px;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-add {
                width: 20px;
                .dish-mobile-black-add-dish {
                    div {
                        font-size: 10px;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-delete {
                width: 20px;
                .dish-mobile-black-delete-dish {
                    div {
                        font-size: 10px;
                    }
                }
            }
            .card-content {
                height: 90px;
                .dish-mobile-img {
                    img {
                        width: 110px;
                        height: auto;
                        clip-path: circle(40px at center);
                        margin-left: -12px;
                    }
                }
                .dish-mobile-text {
                    width: 60%;
                    height: 125px;
                    .dish-mobile-text-disc {
                        font-size: 18px;
                    }
                    .dish-mobile-text-prelude {
                        font-size: 14px;
                        max-height: 40%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                .dish-mobile-price {
                    .dish-mobile-price-grams, .dish-mobile-price-price {
                        font-size: 20px;
                    }
                }
            }
        }
        // .card-content:last-child {
        //     margin-bottom: 80px;
        // }
        //        ::i-block-chrome, .container {
        //     margin-bottom: 80px;
        // }
        .money-spent, .money-left {
            font-size: 24px;
            font-weight: 700;
        }
        .show-black-listed {
            p {
                font-size: 18px;
            }
        }
        /* слайдер */
        // .switch {
        //     width: 70px;
        //     height: 35px;
        // }
        // /* слайдер для включения чс*/
        // .slider {
        //     &:before {
        //         height: 27px;
        //         width: 27px;
        //         left: 5px;
        //         bottom: 5px;
        //     }
        // }
        // input:checked + .slider:before {
        //     transform: translateX(35px);
        // }
    }
    .dish-mobile {
        grid-template-columns: 25% 100% 25%;
        &-middle {
            transform: translateX(-25%);
            &-to-right {
                transform: translateX(0%);
            }
            &-to-left {
                transform: translateX(-50%);
            }
            &-to-middle {
                transform: translateX(-25%);
            }
            &-about {
                padding-left: 60px;
                width: 60%;
                &-name {
                    font-weight: 700;
                    font-size: 20px;
                }
            }
            &-typ {
                padding: 10px 5px 10px 0;
                &-PW {
                    font-size: 20px;
                }
            }
        }
    }
    // @media (max-width: 650px) {
    //     .cart_comp {
    //         padding-top: 50px;
    //     }
    // }
    @media (max-width: 500px) {
        .dish-mobile {
            display: flex;
            width: 100%;
            .swipeout-action.dish-mobile-delete {
                .dish-mobile-delete-dish {
                    width: 10px;
                    img {
                        width: 25px;
                    }
                    div {
                        font-size: 10px;
                    }
                }
            }
            .swipeout-action.dish-mobile-add {
                .dish-mobile-add-dish {
                    width: 10px;
                    img {
                        width: 25px;
                    }
                    div {
                        font-size: 10px;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-add {
                width: 5px;
                .dish-mobile-black-add-dish {
                    img {
                        width: 15px;
                    }
                    div {
                        font-size: 9px;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-delete {
                width: 5px;
                .dish-mobile-black-delete-dish {
                    img {
                        width: 25px;
                    }
                    div {
                        font-size: 9px;
                    }
                }
            }
        }
    }
    // Юля оч много меняла в этом медиа квери, лучше целиком его добавлять в мастер
    @media (max-width: 475px) {
        .container .week {
            margin-bottom: 0;
        }
        .money-spent, .money-left {
            font-size: 24px;
            font-weight: 700;
        }
        .show-black-listed {
            p {
                font-size: 18px;
            }
        }
        .cart_comp {
            height: 95vh;
        }
        /* слайдер */
        // .switch {
        //     width: 70px;
        //     height: 35px;
        // }
        // /* слайдер для включения чс*/
        // .slider {
        //     &:before {
        //         height: 27px;
        //         width: 27px;
        //         left: 5px;
        //         bottom: 5px;
        //     }
        // }
        // input:checked + .slider:before {
        //     transform: translateX(35px);
        // }
        .dish-mobile {
            .card-content {
                .dish-mobile-price {
                    width: 30%;
                }
                .dish-mobile-text {
                    .dish-mobile-text-prelude {
                        max-height: 2.5em;
                    }
                }
            }
            &-middle {
                &-about {
                    padding-left: 10px;
                    width: 65%;
                    &-name {
                        font-size: 18px;
                    }
                    &-desc {
                        padding-top: 5px;
                        font-size: 13px;
                    }
                }
                &-typ {
                    padding: 5px 10px 5px 0;
                }
            }
        }
    }
    // вот этот квери полностью новый обяз добавить
    @media (max-width: 400px) {
        .category-name {
            width: 85%;
            margin: 10px auto 20px auto;
        }
        .dish-mobile {

            .swipeout-action.dish-mobile-delete {
                .dish-mobile-delete-dish {
                    width: 0px;

                    div {
                        font-size: 10px;
                    }
                }
            }
            .swipeout-action.dish-mobile-add {
                .dish-mobile-add-dish {
                    width: 0px;

                    div {
                        font-size: 10px;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-add {
                .dish-mobile-black-add-dish {
                    width: 0px;

                    div {
                        font-size: 8px;
                    }
                }
            }
            .swipeout-action.dish-mobile-black-delete {
                .dish-mobile-black-delete-dish {
                    width: 0px;

                    div {
                        font-size: 8px;
                    }
                }
            }
            .card-content {
                height: 50px;
                padding: 2% 0 2% 0;
                .dish-mobile-img {
                    img {
                        width: 100px;
                        height: auto;
                        clip-path: circle(30px at center);
                        margin-left: -10px;
                    }
                }
                .dish-mobile-text {
                    width: 70%;
                    .dish-mobile-text-disc {
                        font-size: 12px;
                    }
                    .dish-mobile-text-prelude {
                        font-size: 10px;
                    }
                }
                .dish-mobile-price {
                    width: 30%;
                    &-amount {
                        font-size: 10px;
                    }
                    .dish-mobile-price-grams, .dish-mobile-price-price {
                        font-size: 14px;
                        margin-right: 1%;
                    }
                }
            }
            .total-sum {
                flex-direction: column;
            }
            .total-container p {
                font-size: 20px;
            }
            .show-black-listed p {
                font-size: 18px;
            }
            .money-spent, .money-left {
                font-size: 20px;
            }
            .money-left {
                color: #42D547;
            }
        }
    }

    @media (max-width: 360px) {
        /* плашка внизу страницы */
        .total-sum {
            flex-direction: column;
        }
        .total-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            z-index: 2;
        }
        .cart-icon {
            width: 30px;
            height: 30px;
        }
        /* контейнер слайдера чс */
        .show-black-listed {
            align-items: center;
            justify-content: center;
            width: 100%;
            z-index: 2;

            p {
                font-size: 16px;
            }
        }
        /* слайдер */
        // .switch {
        //     width: 50px;
        //     height: 28px;
        // }
        // /* слайдер для включения чс*/
        // .slider {
        //     &:before {
        //         height: 22px;
        //         width: 22px;
        //         left: 3px;
        //         bottom: 3px;
        //     }
        // }
        // input:checked + .slider:before {
        //     transform: translateX(22px);
        // }
    }
</style>
<style>
    .vue-notification {
        background: #F2EDF6 !important;
        border: none !important;
        margin-top: 10px !important;
        border-radius: 3px !important;
        font-size: 16px !important;
        color: #460B79 !important;
    }
    .swipeout {
        position: relative;
        overflow: hidden;
        display: flex;
        /* margin-top: 5px; */
    }
    .swipeout .swipeout-left, .swipeout .swipeout-right {
        position: absolute;
        height: 100%;
        display: flex;
        z-index: 0;
    }
    button {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
    }
    .aloneButtonL {
        transform: translate3d(312px, 0px, 0px) !important;
    }
    .aloneButtonM {
        transform: translate3d(220px, 0px, 0px) !important;
    }
    .aloneButtonS {
        transform: translate3d(170px, 0px, 0px) !important;
    }
    .aloneButtonDelL {
        transform: translate3d(-312px, 0px, 0px) !important;
    }
    .aloneButtonDelM {
        transform: translate3d(-220px, 0px, 0px) !important;
    }
    .aloneButtonDelS {
        transform: translate3d(-170px, 0px, 0px) !important;
    }
</style>
