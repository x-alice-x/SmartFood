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
        
        <div class="mobile-container">              <!-- Mobile version -->
        <Weekdays class="week-mob"></Weekdays>   
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
                    <div class="dish-mobile-middle-about-img" 
                         :style="{'background-image': `url(${dish.image})`}">
                    </div>

                    <div class="dish-mobile-middle-about-text">
                        <div class="dish-mobile-middle-about-text-name">
                            {{ dish.name }}
                        </div>
                        <div class="dish-mobile-middle-about-text-desc">
                            {{dish.description}}
                        </div>
                    </div>
                </div>
                <div class="dish-mobile-middle-typ">
                    <div class="dish-mobile-middle-typ-counter">
                        В корзине: {{dish.in_basket_count}}
                    </div>
                    <div class="dish-mobile-middle-typ-PW">
                        <a>{{ dish.weight }} г.</a>
                        <a>{{ dish.price.replace(/.00/, '') }} Р</a>
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
    </div>
</template>

<script>
    import Vue from 'vue'
    import Vue2TouchEvents from 'vue2-touch-events'
    import Weekdays from './Weekdays'

    Vue.use(Vue2TouchEvents)
    export default {
        components: {Weekdays},
        data () {
            return {
            selected: undefined,
            button: {
                text: 'Добавить в черный список'
            }
            };
        },
        methods: {
            // Добавление блюда
            buyDish(menu_id, dish_id, index) {
                if(this.dishes.dishes[index].in_basket_count === 0){
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
                event.stopPropagation();    
                if (this.button.text == "Добавить в черный список") {
                  this.button.text = "Убрать из черного списка";
                  }
                else if (this.button.text == "Убрать из черного списка") {
                  this.button.text = "Добавить в черный список";
                  }
            }
            
        },
        computed: {
            dishes() {
                if (this.$store.getters.currentDishes){
                    return this.$store.getters.currentDishes
                }
                else {
                    return []
                }
            },
        },
        async created() {
            await this.$store.dispatch('fetchMenu');
            if (this.$store.getters.getError) {
                await this.$store.dispatch("SetNotAuth");
                await this.$store.dispatch("ClearCookies");
                this.$router.push('/');
            }
        }
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
        .dish {display: none;}
        .container {
            margin-top: 10px;
            .week {
                display: none;
            }
        }
        .week-mob {
            display: block !important;
            margin-bottom: 30px;
        }
        .dish-mobile {
            position: relative;
            position: relative;
            color: $font-color;
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
                    max-width: 80%;
                    &-img {
                        height: 100px;
                        width: 125px;
                        background-size: 125px; 
                        background-position: center;
                    }
                    &-text {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        margin-left: 20px;
                        max-width: 70%;
                        &-name{
                            font-weight: 700;
                            font-size: 20px;
                            line-height: 1;
                        }
                        &-desc{
                            padding-top: 10px;
                            font-weight: 300;
                            font-size: 14px;
                            line-height: 1;
                        }
                    }
                }
                &-typ{
                    padding: 25px 20px 25px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    &-PW{
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        font-size: 24px;
                        a:nth-child(2){
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
                    width: 82%;
                    &-text {
                        max-width: 60%;
                        line-height: 1;
                        &-name{
                            font-weight: 700;
                            font-size: 14px;
                        }
                        &-desc {
                            font-size: 12px;
                            padding-top: 0;
                        }
                    }
                    &-img {
                        width: 100px;
                    }
                }
                &-typ{
                    padding: 10px 5px 10px 0;
                    &-counter {
                        font-size: 12px;
                    }
                    &-PW{
                        font-size: 16px;
                    }
                }
            }
        }
    }
    @media (max-width: 420px) {
        .dish-mobile {
            &-middle{
                &-about{
                    width: 75%;
                    &-text {
                        max-width: 55%;
                        &-name{
                            font-size: 12px;
                        }
                        &-desc{
                            font-size: 10px;
                        }
                    }
                }
                &-typ{
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
            &-middle{
                &-about{
                    width: 75%;
                     &-text {
                        margin-left: 10px;
                        max-width: 54%;
                     }
                    // &-name{
                    //     font-size: 16px;
                    // }
                    // &-desc{
                    //     padding-top: 5px;
                    //     font-size: 12px;
                    // }
                }
                // &-typ{
                //     padding: 5px 10px 5px 0;
                // }
            }
        }
}  
</style>