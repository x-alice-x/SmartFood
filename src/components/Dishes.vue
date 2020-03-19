/* eslint-disable vue/valid-v-on */
<template>
    <div class="dishes">
        <div class="container">
           <Weekdays class="week"></Weekdays>
           <div class="dish-category">
               <h3 class="category-name" >название категории</h3>
            <div class="dish-main" id="blacklisted" >
            <div class="dish" :class="{highlight:dish.selected}" v-for="(dish, index) in dishes.dishes" :key="index" @click="buyDish(dishes.id, dish.id, index)" >
                <div class="dish-top"> 
                    <div class="dish-img" :style="{'background-image': `url(${dish.image})`}">
                        <div class="black-list-container">
                             <img class="black-list" src="../assets/img/dots.svg" />
                        </div>
                        <div id="black-list-content">
                            <button id="add-to-list" @click="blackList(); $set(dish, 'selected', !dish.selected)">{{button.text}}</button>
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
                            <img src="../assets/img/minus.svg" @click="deleteDish(dishes.id, dish.id, index)">
                        </button>
                        <div class="dish-amount">
                            <div class="dish-amount-color">
                                {{dish.in_basket_count}}
                            </div>
                        </div>
                        <button>
                            <img src="../assets/img/plus.svg" @click="buyDishOnPlus(dishes.id, dish.id, index)">
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
            </div>
        </div>
    <div class="total-sum-container">
        <div class="total-sum">
            <div class="total-container">
                <p class="money-spent">150p</p>
                <img class="cart-icon" src="../assets/img/cart_white.svg" />
                <p class="money-left">50p</p>
            </div>
            <div class="show-black-listed">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                </label>
                <p>Черный список</p>
            </div>
      </div>
    </div>
      </div>

        <div>              <!-- Mobile version -->
            <Weekdays class="week-mob"></Weekdays>
            <swipe-list
                    ref="list"
                    class="dish-mobile"
                    :items="dishes.dishes"
                    :revealed.sync="revealed"
            >
                <template v-slot="{item, index}">
                    <!-- item is the corresponding object from the array -->
                    <!-- index is clearly the index -->
                    <!-- revealLeft is method which toggles the left side -->
                    <!-- revealRight is method which toggles the right side -->
                    <!-- close is method which closes an opened side -->
                    <div ref="content" class="card-content" :data-indexItem="index" @click="closeContent">
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
                            <div class="dish-mobile-price-grams">
                                {{ item.weight }} г.
                            </div>
                            <div class="dish-mobile-price-price">
                                {{ item.price }} ₽
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:left="{ item, close, index }">
                    <div class="swipeout-action dish-mobile-add" @click="delDish(index)">
                        <div class="dish-mobile-add-dish">
                            <img src="../assets/img/cartMobile.svg">
                            <div>ДОБАВИТЬ</div>
                        </div>
                    </div>
                    <div class="swipeout-action dish-mobile-black-add" @click="delDish(index)" v-if="black_list">
                        <div class="dish-mobile-black-add-dish">
                            <img src="../assets/img/blackListAdd.svg">
                            <div>ЧЕРНЫЙ СПИСОК</div>
                        </div>
                    </div>
                </template>
                <template v-slot:right="{ item, close, index }">
                    <div class="swipeout-action dish-mobile-black-delete" @click="delDish(index)" v-if="black_list">
                        <div class="dish-mobile-black-delete-dish">
                            <img src="../assets/img/blackListDelete.svg">
                            <div>ЧЕРНЫЙ СПИСОК</div>
                        </div>
                    </div>
                    <div class="swipeout-action dish-mobile-delete" @click="addDish(index)">
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
                revealed: {},
                zak: 0,
                currentIndex: 0,
                downX: 0,
                upX: 0,
                black_list: false
            };
        },
        components: {
            Weekdays,
            SwipeList,
        },
        methods: {
            // Добавление блюда
            buyDish(menu_id, dish_id, index) {
                if (this.dishes.dishes[index].in_basket_count === 0) {
                    this.$store.dispatch("OrderDish", {menu_id, dish_id});
                    this.dishes.dishes[index].in_basket_count++
                }
                event.stopPropagation()
            },
            buyDishOnPlus(menu_id, dish_id, index) {
                    this.$store.dispatch("OrderDish", {menu_id, dish_id});
                this.dishes.dishes[index].in_basket_count++
                event.stopPropagation()
            },
            // Удаление блюда
            deleteDish(menu_id, dish_id, index) {
                this.$store.dispatch("DeleteDish", {menu_id, dish_id});
                this.dishes.dishes[index].in_basket_count--
                event.stopPropagation()
            },
            // Удаление блюда по свайпу
            onSwipeLeft(index, menu_id, dish_id) {
                this.$store.dispatch("DeleteDish", {menu_id, dish_id});
                if (this.dishes.dishes[index].in_basket_count > 0){
                    this.dishes.dishes[index].in_basket_count--
                }
                this.dishes.dishes[index].swipe = 'left'
                setTimeout(this.setSwipeMiddle, 200, index)
            },
            // Добавление блюда по свайпу
            onSwipeRight(index, menu_id, dish_id) {
                this.$store.dispatch("OrderDish", {menu_id, dish_id});
                this.dishes.dishes[index].in_basket_count++
                this.dishes.dishes[index].swipe = 'right'
                setTimeout(this.setSwipeMiddle, 200, index)
            },
            // Это нужно для свайпа обратно
            setSwipeMiddle(index) {
                this.dishes.dishes[index].swipe = 'middle'
            },
            blackList() {

                if (this.button.text == "Добавить в черный список") {
                  this.button.text = "Убрать из черного списка";
                  }
                else if (this.button.text == "Убрать из черного списка") {
                  this.button.text = "Добавить в черный список";
                  }
            },
            addDish(index) {
                console.log(index)
                this.zak++;
                console.log('У вас блюд: ' + this.zak)
                this.$refs.list.close()
            },
            delDish(index) {
                console.log(index)
                this.zak--;
                console.log('У вас блюд: ' + this.zak)
            },
            closeContent() {
                this.$refs.list.close()
                this.black_list = false
            }
            
        },
        computed: {
            dishes() {
                if (this.$store.getters.currentDishes){
                    return this.$store.getters.currentDishes
                } else {
                    return []
                }
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
                self.currentIndex = event.currentTarget.dataset.indexitem;
                self.downX = event.changedTouches[0].clientX;
                this.black_list = false;
            });
            $(document).on("touchend  mouseup", ".card-content", function (event) {
                self.upX = event.changedTouches[0].clientX;
            })
        },
        watch: {
            upX: function () {
                if (Math.abs(this.upX - this.downX) >= 3 * window.screen.width / 4) {
                    if (this.revealed[this.currentIndex] === 'right') {
                        this.black_list = false;
                        console.log('right');
                        this.$refs.list.close()
                    } else if (this.revealed[this.currentIndex] === 'left') {
                        this.black_list = false;
                        console.log('left');
                        this.$refs.list.close()
                    }
                } else {
                    this.black_list = true
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";

// категории

.category-name {
    font-size: 36px;
    color: #000;
    margin-left: 2%;
    margin-bottom: 2%;
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
background:#fff;
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
.highlight {
    filter: grayscale(100%);
    transition: .3s;
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

    p {
        font-size: 24px;
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


    .dishes{
        height: 600px;
        
    }

    .week-mob {
        display: none !important;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: $font-color;
        margin-bottom: 60px;
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
    .dish-mobile{display: none;}

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
        margin-bottom: 90px;
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
    @media (max-width: 790px) {
        .dish {
            display: none;
        }
        .container {
            margin-top: 10px;
            .week {
                display: none;
            }
        }
        .week-mob {
            display: block !important;
        }
        .dish-mobile {
            display: flex;
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
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 900;
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
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 900;
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
                    img {
                        width: 70px;
                    }
                    div {
                        margin-top: 5px;
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 900;
                        font-size: 18px;
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
                    img {
                        width: 70px;
                    }
                    div {
                        margin-top: 5px;
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 900;
                        font-size: 18px;
                        color: #FFFFFF;
                    }
                }
            }
            .card-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 150px;
                background: #FFFFFF;
                .dish-mobile-img {
                    border-radius: 50%;
                    img {
                        width: 190px;
                        border-radius: 50%;
                        margin-left: 10px;
                    }
                }
                .dish-mobile-text {
                    width: 465px;
                    height: 125px;
                    .dish-mobile-text-disc {
                        display: flex;
                        flex-wrap: wrap;
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 900;
                        font-size: 30px;
                        line-height: 30px;
                        color: rgba(0, 0, 0, 0.75);
                    }
                    .dish-mobile-text-prelude {
                        margin-top: 10px;
                        height: 77px;
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 200;
                        font-size: 18px;
                        line-height: 21px;
                        color: #000000;
                    }
                }
                .dish-mobile-price {
                    width: 100px;
                    margin-top: 70px;
                    .dish-mobile-price-grams {
                        height: 34px;
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: 300;
                        font-size: 24px;
                        line-height: 28px;
                        display: flex;
                        align-items: center;
                        text-align: right;
                        color: #000000;
                    }
                    .dish-mobile-price-price {
                        height: 34px;
                        font-family: Roboto, sans-serif;
                        font-style: normal;
                        font-weight: bold;
                        font-size: 25px;
                        line-height: 35px;
                        display: flex;
                        align-items: center;
                        text-align: right;
                        color: #000000;
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
    }
    @media (max-width: 600px) {
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
    }
    @media (max-width: 420px) {
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
</style>