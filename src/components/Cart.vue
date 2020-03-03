<template>
  <div class="cart">
    <div class="header">
      <img src="../assets/img/close.svg"
           alt="Close"
           @click="$emit('closeCart')">
    </div>

    <div class="dish">
      <img :src="dishes.dishes[0].image">
      <div class="info">
        <span class="name">{{ dishes.dishes[0].name }}</span>
        <span class="price">{{ dishes.dishes[0].price.replace(/.00/, '') }} ₽</span>
        <div class="dish-add">
            <img src="../assets/img/minus.svg">
            <div class="amount">
                {{ dishes.dishes[0].employee_dish_in_basket.count }}
            </div>
            <img src="../assets/img/plus.svg">
        </div>
      </div>
      <div class="sum">
        Всего: {{ cartSum }}
      </div>
    </div>

    <div class="btns">
      <button class="clear-cart">Очистить корзину</button>
      <button class="confirm-order">Подтвердить заказ</button>
    </div>

  </div>
</template>

<script>
  export default {
    computed: {
      dishes() {
        if(this.$store.getters.currentDishes){
            console.log(this.$store.getters.currentDishes);
            return this.$store.getters.currentDishes
        }
        else {
            return []
        }
      },
      cartSum() {
        return 120;
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/vars.scss";    
    @import "../assets/scss/root.scss";

  .cart {
    width: 550px;
    height: 765px;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.25);  
    background: #FCFAF1;

    .header {
      height: 26px;
      background: $c-main;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 10px;
      img {
        height: 12px;
        width: 13px;
        cursor: pointer;
      }
    }

    .dish {
      display: flex;
      margin-bottom: 5px;
      img {
        height: 140px;
        width: auto;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // align-items: center;
        padding: 10px 25px;
        font-size: 22px;
        font-weight: 700;

        .price {
          font-weight: 500;
          font-size: 20px;
          padding-left: 5px;
        }

        .dish-add {
          display: flex;
          img {
            width: 15px;
            height: auto;
            margin: 0 5px;
          }
          .amount {
            border: 1px solid #5288CA;
            border-radius: 10px;
            background: #ffffff;
            width: 63px;
            text-align: center;
          }
        }
      }
      .sum {
        padding: 10px 20px;
        display: flex;
        align-items: flex-end;
        font-size: 22px;
        font-weight: 700;
      }
    }

    .btns {
      position: absolute;
      bottom: 5%;
      button {
        border-radius: 46px;
        outline: none;
        width: 200px;
        height: 48px;
        font-family: $font;
        font-size: 18px;
        font-weight: 500;
        margin-left: 50px;  
      }
      .clear-cart {
        border: 1px solid $font-color;
        background: #FCFAF1;
        color: $font-color;
      }
      .confirm-order {
        border: none;
        background: $font-color;
        color: #ffffff;
      }
    }
  }
</style>