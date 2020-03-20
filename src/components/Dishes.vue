<template>
    <div class="dishes">
        <div class="container">
            <Weekdays class="week"></Weekdays>
            <div class="dish-category" v-for="(categories, categoryIndex) in todayMenu.categories" :key="categoryIndex">
                <h3 class="category-name">{{categories.name}}</h3>
                <div class="dish-main">
                    <div class="dish" :class="{ active: index === activeItem}"
                         v-for="(dish, index) in categories.dishes" :key="index"
                         @click="buyDish(todayMenu.id, dish.id, index, categoryIndex, buttonId = 'card')"
                         :id="dish.in_blacklist ? 'blacklisted' : index">
                        <div class="dish-top">
                            <div class="dish-img" :style="{'background-image': `url(${dish.image})`}">
                                <div class="black-list-container">
                                    <img class="black-list" src="../assets/img/dots.svg"/>
                                </div>
                                <div id="black-list-content">
                                    <button v-if="!dish.in_blacklist"
                                            @click="blackListChange(todayMenu.id, dish.id, index, categoryIndex)">
                                        Добавить в черный список
                                    </button>
                                    <button v-if="dish.in_blacklist"
                                            @click="blackListChange(todayMenu.id, dish.id, index, categoryIndex)">
                                        Удалить из черного списка
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
                                         @click="deleteDish(todayMenu.id, dish.id, index, categoryIndex)">
                                </button>
                                <div class="dish-amount">
                                    <div class="dish-amount-color">
                                        {{dish.in_basket_count}}
                                    </div>
                                </div>
                                <button>
                                    <img src="../assets/img/plus.svg"
                                         @click="buyDish(todayMenu.id, dish.id, index, categoryIndex, buttonId = 'plus')">
                                </button>
                            </div>
                        </div>
                        <div class="dish-bottom">
                            <div class="dish-typ">
                                <a>{{ dish.price.replace(/.00/, '') }} Р</a>
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
                                 :data-disheIndex="index"
                                 :data-todayMenuId="todayMenu.id"
                                 :data-disheId="item.id"
                                 :data-revealed="revealed"
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
                                        {{ item.price.replace(/.00/, '') }} Р
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-slot:left="{ item, close, index }">
                            <div class="swipeout-action dish-mobile-add"
                                 @click="buyDish(todayMenu.id, item.id, index, categoryIndex, buttonId = 'plus')">
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
                                 @click="deleteDish(todayMenu.id, item.id, index, categoryIndex)">
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
            <div class="total-sum-container">
                <div class="total-sum">
                    <div class="total-container">
                        <p class="money-spent">{{todayMenu.basket_summ}} Р</p>
                        <img class="cart-icon" src="../assets/img/cart_white.svg"/>
                        <!-- Юля добавила ви байнд в р тэг ниже, не удалять -->
                        <p class="money-left"
                           v-bind:style="{'color' : (this.todayMenu.basket_summ >= this.todayMenu.basket_summ_limit ? '#ED2736':'#42D547')}">
                            {{moneyLeft}} Р</p>
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
    </div>
</template>

<script>
    import {SwipeList} from 'vue-swipe-actions';
    import 'vue-swipe-actions/dist/vue-swipe-actions.css';
    import Weekdays from './Weekdays'
    import $ from "jquery";

    export default {
        data() {
            return {
                activeItem: null,
                button: {
                    text: 'Добавить в черный список'
                },
                revealed: '',
                zak: 0,
                categoryIndex: 0,
                dishIndex: 0,
                todayMenuId: 0,
                dishId: 0,
                downX: 0,
                upX: 0,
                blackListShow: 0
            };
        },
        components: {
            Weekdays,
            SwipeList,
        },
        methods: {
            // Добавление блюда
            buyDish(menu_id, dish_id, index, categoryIndex, buttonId) {
                if (buttonId === 'card'){
                    if (this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count === 0) {
                        this.$store.dispatch("OrderDish", {menu_id, dish_id});
                        this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count++
                        this.todayMenu.basket_summ = this.todayMenu.basket_summ
                            + parseInt(this.todayMenu.categories[categoryIndex].dishes[index].price)
                    }
                    event.stopPropagation()
                }
                else {
                    this.$store.dispatch("OrderDish", {menu_id, dish_id});
                    this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count++
                    this.todayMenu.basket_summ = this.todayMenu.basket_summ
                        + parseInt(this.todayMenu.categories[categoryIndex].dishes[index].price)
                    event.stopPropagation()
                }
            },
            // Удаление блюда
            deleteDish(menu_id, dish_id, index, categoryIndex) {
                if (this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count != 0) {
                    this.$store.dispatch("DeleteDish", {menu_id, dish_id});
                    this.todayMenu.categories[categoryIndex].dishes[index].in_basket_count--
                    this.todayMenu.basket_summ = this.todayMenu.basket_summ
                        - parseInt(this.todayMenu.categories[categoryIndex].dishes[index].price)
                }
                event.stopPropagation()
            },
            blackList() {
                event.stopPropagation();
                if (this.button.text == "Добавить в черный список") {
                    this.button.text = "Убрать из черного списка";
                } else if (this.button.text == "Убрать из черного списка") {
                    this.button.text = "Добавить в черный список";
                }
            },
            closeContent() {
                this.$refs.list[this.categoryIndex].close()
                this.black_list = false
            },
            blackListChange(menu_id, dish_id, index, categoryIndex) {
                let whichFunc = this.todayMenu.categories[categoryIndex].dishes[index].in_blacklist
                this.$store.dispatch("BlackListChange", {menu_id, dish_id, whichFunc});
                this.todayMenu.categories[categoryIndex].dishes[index].in_blacklist = !whichFunc
                if (!whichFunc && this.blackListShow === 0) {
                    this.todayMenu.categories[categoryIndex].dishes.splice(index, 1)
                }
                event.stopPropagation()
            },
            blackListMenuChange() {
                this.blackListShow = !this.blackListShow
                this.blackListShow ? this.$store.dispatch("fetchMenu", 0) : this.$store.dispatch("fetchMenu", 1)
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
        },
        async mounted() {
            let self = this;
            await this.$store.dispatch('fetchMenu');
            if (this.$store.getters.getError) {
                await this.$store.dispatch("SetNotAuth");
                await this.$store.dispatch("ClearCookies");
                this.$router.push('/');
            }
            $(document).on("touchstart  mousedown", ".card-content", function (event) {
                self.categoryIndex = event.currentTarget.dataset.categoryindex;
                self.dishIndex = event.currentTarget.dataset.disheindex;
                self.todayMenuId = event.currentTarget.dataset.todaymenuid;
                self.dishId = event.currentTarget.dataset.dishid;
                self.buttonId = event.currentTarget.dataset.buttonId
                self.downX = event.changedTouches[0].clientX;
                self.$store.commit('showBlackList', {
                    indexCategory: self.categoryIndex,
                    indexDishes: self.dishIndex,
                    bool: false
                });
                event.stopPropagation();
            });
            $(document).on("touchend  mouseup", ".card-content", function (event) {
                self.upX = event.changedTouches[0].clientX;
                self.revealed = event.currentTarget.dataset.revealed;
                // self.$store.commit('showBlackList', {
                //     indexCategory: self.categoryIndex,
                //     indexDishes: self.dishIndex,
                //     bool: false
                // });
            })
        },
        watch: {
            upX: function () {
                this.$store.commit('showBlackList', {
                    indexCategory: this.categoryIndex,
                    indexDishes: this.dishIndex,
                    bool: false
                })
                if (Math.abs(this.upX - this.downX) >= 3 * window.screen.width / 4) {
                    if (this.revealed === 'right') {
                        this.$store.commit('showBlackList', {
                            indexCategory: this.categoryIndex,
                            indexDishes: this.dishIndex,
                            bool: false
                        });
                        this.deleteDish(this.todayMenuId, this.dishId, this.dishIndex, this.categoryIndex)
                        this.$refs.list[this.categoryIndex].close()
                    } else if (this.revealed === 'left') {
                        this.$store.commit('showBlackList', {
                            indexCategory: this.categoryIndex,
                            indexDishes: this.dishIndex,
                            bool: false
                        });
                        this.buyDish(this.todayMenuId, this.dishId, this.dishIndex, this.categoryIndex, this.buttonId);
                        this.$refs.list[this.categoryIndex].close()
                    }
                } else {
                    this.$store.commit('showBlackList', {
                        indexCategory: this.categoryIndex,
                        indexDishes: this.dishIndex,
                        bool: true
                    })
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";
    .dishes {
        max-width: 1500px;
        margin: auto;
    }
    // категории
    .category-name {
        font-size: 40px;
        color: #000;
        margin-left: 150px;
        margin-bottom: 2%;
        font-weight: 400;
    }

    /* контейнер для кнопочки открывающей кнопку чс */
    .black-list-container {
        width: 100%;
        height: auto;
        padding: 10px 20px 10px 0;
        background: transparent;
        display: flex;
        justify-content: flex-end;

        .black-list {
            width: 60px;
            height: 20px;
            cursor: pointer;
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

    .black-list-container:hover + #black-list-content, #black-list-content:hover {
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
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 50px;
        background: rgba(255, 255, 255, 0.5);
        width: 100%;
        z-index: 20;
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
        z-index: 20;

        p {
            font-size: 24px;
            font-weight: bold;
        }
    }

    .cart-icon {
        width: 30px;
        height: 30px;
    }

    /* контейнер слайдера чс */
    .show-black-listed {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        right: 15%;
        // transform: translateX(-50%);
        z-index: 2;

        p {
            margin-left: 15px;
            color: #000;
            font-size: 18px;
            font-weight: 700;
        }
    }

    /* слайдер */
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 32px;
        display: flex;
        align-items: center;
        margin-left: 20px;
        justify-content: center;
        z-index: 2;
    }

    /* убрать дефолтный чекбокс */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* слайдер для включения чс*/
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .3s;

        &:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
        }
    }

    input:checked + .slider {
        background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    .slider.round {
        border-radius: 30px;

        &:before {
            border-radius: 50%;
        }
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

        &:hover {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        }

        &-category {
            margin-bottom: 50px;
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
                width: 220px;
                height: 150px;
                background: linear-gradient(90deg, #A60000 0%, #CE0000 100%), #FFFFFF;

                .dish-mobile-delete-dish {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 60px;

                    img {
                        width: 70px;
                    }

                    div {
                        margin-top: 5px;
                        font-weight: 700;
                        font-size: 18px;
                        color: #FFFFFF;
                    }
                }
            }

            .swipeout-action.dish-mobile-add {
                display: flex;
                justify-content: flex-end;
                width: 220px;
                height: 150px;
                background: linear-gradient(90deg, #460B79 0%, #88267F 100%), #FFFFFF;

                .dish-mobile-add-dish {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 60px;

                    img {
                        width: 70px;
                    }

                    div {
                        margin-top: 5px;
                        font-weight: 700;
                        font-size: 18px;
                        color: #FFFFFF;
                    }
                }
            }

            .swipeout-action.dish-mobile-black-add {
                width: 60px;
                height: 150px;
                background: linear-gradient(0deg, #F2EDF6, #F2EDF6), #FFFFFF;

                .dish-mobile-black-add-dish {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 60px;
                    text-align: center;

                    img {
                        width: 70px;
                    }

                    div {
                        margin-top: 5px;
                        font-weight: 700;
                        font-size: 16px;
                        color: #460B79;
                    }
                }
            }

            .swipeout-action.dish-mobile-black-delete {
                width: 60px;
                height: 150px;
                background: linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0.81) 100%), #FFFFFF;

                .dish-mobile-black-delete-dish {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 60px;
                    text-align: center;

                    img {
                        width: 70px;
                    }

                    div {
                        margin-top: 5px;
                        font-weight: 700;
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                }
            }

            .card-content {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 150px;
                background: #FFFFFF;
                width: 100%;
                border-top: 1px solid #F2EDF6;

                .dish-mobile-img {
                    img {
                        width: 190px;
                        height: auto;
                        clip-path: circle(60px at center);
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
                        text-transform: uppercase;
                        color: #460B79;
                    }

                    .dish-mobile-text-prelude {
                        margin-top: 10px;
                        height: auto;
                        font-weight: 400;
                        font-size: 16px;
                        color: #460B79;
                    }
                }

                .dish-mobile-price {
                    width: 25%;
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
            flex-direction: column;
        }
        .total-container {
            display: flex;
            flex-direction: row;
            height: 70px;
            width: 100%;
            z-index: 2;
            justify-content: center;
            align-items: center;

            p {
                font-size: 36px;
            }
        }
        .cart-icon {
            width: 50px;
            height: 50px;
            margin: 0 40px;
        }
        .money-spent, .money-left {
            font-size: 36px;
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
            bottom: 90px;
            z-index: 2;

            p {
                font-size: 30px;
            }
        }
        /* слайдер */
        .switch {
            width: 90px;
            height: 44px;
        }
        /* слайдер для включения чс*/
        .slider {
            &:before {
                height: 35px;
                width: 35px;
                left: 5px;
                bottom: 5px;
            }
        }
        input:checked + .slider:before {
            transform: translateX(45px);
        }
    }

    // Юля оч много меняла в этом медиа квери, лучше целиком его добавлять в мастер
    @media (max-width: 620px) {
        .container .week {
            margin-bottom: 0;
        }
        .container {
            margin-bottom: 150px;
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

            .card-content {
                .dish-mobile-img {
                    img {
                        width: 150px;
                        clip-path: circle(50px at center);
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
                    }
                }

                .dish-mobile-price {
                    width: 25%;

                    .dish-mobile-price-grams, .dish-mobile-price-price {
                        font-size: 20px;
                    }
                }
            }
        }
        .total-sum {
            height: 140px;
        }
        .money-spent, .money-left {
            font-size: 36px;
            font-weight: 700;
        }
        .show-black-listed {
            p {
                font-size: 22px;
            }
        }
        /* слайдер */
        .switch {
            width: 70px;
            height: 35px;
        }
        /* слайдер для включения чс*/
        .slider {
            &:before {
                height: 27px;
                width: 27px;
                left: 5px;
                bottom: 5px;
            }
        }
        input:checked + .slider:before {
            transform: translateX(35px);
        }
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

    // Юля оч много меняла в этом медиа квери, лучше целиком его добавлять в мастер
    @media (max-width: 440px) {
        .container .week {
            margin-bottom: 0;
        }
        .dish-mobile {
            display: flex;
            width: 100%;

            .swipeout-action.dish-mobile-delete {
                .dish-mobile-delete-dish {
                    img {
                        width: 50px;
                    }
                }
            }

            .swipeout-action.dish-mobile-add {
                .dish-mobile-add-dish {
                    img {
                        width: 50px;
                    }
                }
            }

            .swipeout-action.dish-mobile-black-add {
                .dish-mobile-black-add-dish {
                    img {
                        width: 50px;
                    }
                }
            }

            .swipeout-action.dish-mobile-black-delete {
                .dish-mobile-black-delete-dish {
                    img {
                        width: 50px;
                    }
                }
            }

            .card-content {
                .dish-mobile-text {
                    width: 50%;
                    height: 125px;
                    margin-right: 2%;

                    .dish-mobile-text-disc {
                        font-size: 13px;
                    }

                    .dish-mobile-text-prelude {
                        font-size: 12px;
                    }
                }

                .dish-mobile-price {
                    width: 30%;
                    
                    &-amount {
                        font-size: 12px;;
                    }
                    .dish-mobile-price-grams, .dish-mobile-price-price {
                        font-size: 18px;
                    }
                }
            }
        }
        .total-sum {
            height: 140px;
        }
        .money-spent, .money-left {
            font-size: 36px;
            font-weight: 700;
        }
        .show-black-listed {
            p {
                font-size: 22px;
            }
        }
        /* слайдер */
        .switch {
            width: 70px;
            height: 35px;
        }
        /* слайдер для включения чс*/
        .slider {
            &:before {
                height: 27px;
                width: 27px;
                left: 5px;
                bottom: 5px;
            }
        }
        input:checked + .slider:before {
            transform: translateX(35px);
        }
        .dish-mobile {
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
    @media (max-width: 380px) {
        .category-name {
            width: 85%;
            margin: 10px auto 20px auto;
        }
        .dish-mobile {
            .swipeout-action.dish-mobile-delete {
                .dish-mobile-delete-dish {
                    width: 50px;

                    img {
                        width: 40px;
                    }
                }
            }

            .swipeout-action.dish-mobile-add {
                .dish-mobile-add-dish {
                    width: 50px;

                    img {
                        width: 40px;
                    }
                }
            }

            .swipeout-action.dish-mobile-black-add {
                .dish-mobile-black-add-dish {
                    width: 50px;

                    img {
                        width: 40px;
                    }
                }
            }

            .swipeout-action.dish-mobile-black-delete {
                .dish-mobile-black-delete-dish {
                    width: 50px;

                    img {
                        width: 40px;
                    }
                }
            }

            .card-content {
                min-height: 150px;
                height: auto;
                padding: 2% 0 2% 0;

                .dish-mobile-img {
                    img {
                        width: 120px;
                        height: auto;
                        clip-path: circle(40px at center);
                    }
                }

                .dish-mobile-text {
                    width: 70%;

                    .dish-mobile-text-disc {
                        font-size: 12px;
                    }

                    .dish-mobile-text-prelude {
                        font-size: 14px;
                    }
                }

                .dish-mobile-price {
                    &-amount {
                        width: 15%;
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
                font-size: 24px;
            }

            .money-spent, .money-left {
                font-size: 20px;
            }

            .money-left {
                color: #42D547;
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
            .switch {
                width: 50px;
                height: 28px;
            }
            /* слайдер для включения чс*/
            .slider {
                &:before {
                    height: 22px;
                    width: 22px;
                    left: 3px;
                    bottom: 3px;
                }
            }
            input:checked + .slider:before {
                transform: translateX(22px);
            }
            .dish-mobile {
                &-middle {
                    &-about {
                        padding-left: 10px;
                        width: 65%;

                        &-name {
                            font-size: 16px;
                        }

                        &-desc {
                            padding-top: 5px;
                            font-size: 12px;
                        }

                        // &-name{
                        //     font-size: 16px;
                        // }
                        // &-desc{
                        //     padding-top: 5px;
                        //     font-size: 12px;
                        // }
                    }

                    &-typ {
                        padding: 5px 10px 5px 0;
                    }

                    // &-typ{
                    //     padding: 5px 10px 5px 0;
                    // }
                }
            }
        }
    }
</style>
<style>
    .swipeout {
        position: relative;
        overflow: hidden;
        display: flex;
        margin-top: 5px;
    }

    .swipeout .swipeout-left, .swipeout .swipeout-right {
        position: absolute;
        height: 100%;
        display: flex;
        z-index: 0;
    }
    button 
    {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
    }
</style>