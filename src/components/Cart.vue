<template>
  <div class="cart">
    <div class="header">
      <img src="../assets/img/close.svg"
           alt="Close"
           @click="showCart = !showCart">
    </div>
  <div class="dish-container">
    <div class="dish">
      <div class="dish-photo">
          <img src="https://image.flaticon.com/icons/svg/857/857681.svg">
      </div>
      <div class="info">
        <p class="name">Паста с курочкой в слив соусе</p>
        <p class="weight">144 г.</p>
        <p class="price">123 Р</p>
      </div>
      <div class="dish-add">
            <img src="../assets/img/minus.svg">
            <div class="amount">
                1
            </div>
            <img src="../assets/img/plus.svg">
      </div>
    </div> 
  </div>
    <div class="sum-container">
      <div class="sum">
       <p>Итого:</p> 
       <p class="number">100 P{{ cartSum }}</p>
      </div>
      <div class="limit">
        <p>Оставшийся лимит:</p> 
        <p class="number">100 P {{ cartSum }}</p>
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
    data () {
      return {
        showCart: false,
      }
    },
    computed: {
        todayMenu() {
            if (this.$store.getters.todayMenu) {
                return this.$store.getters.todayMenu
            } else {
                return []
            }
        }
      },
      cartSum() {
        return 120;
      }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/vars.scss";    
    @import "../assets/scss/root.scss";
  .cart {
    width: 550px;
    height: 600px;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.25);  
    background: #FCFAF1;
    
    .header {
      height: 26px;
      background: $c-main;
      display: flex;
      background: #460B79;
      justify-content: flex-end;
      align-items: center;
      padding: 0 10px;
      img {
        height: auto;
        width: 16px;
        cursor: pointer;
      }
    }
    .dish-container {
    height: auto;
     min-height: 350px;
    }
    .dish {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin: 1%;
      width: 90%;
      img {
        height: 110px;
        width: auto;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 90%;
        height: auto;
        // height: 30px;
        // align-items: center;
        padding: 10px 15px;
        font-size: 18px;
        font-weight: 700;
        .name {
        text-transform: uppercase;
        }
        .weight {
        font-size: 16px;
        font-weight: 300;
        text-align: left;
        margin-top: 5px;
        }
        .price {
          font-weight: 700;
          font-size: 16px;
          text-align: left;
          margin-top: 3px;
        }
      }
      // .sum {
      //   padding: 10px 20px;
      //   display: flex;
      //   align-items: flex-end;
      //   font-size: 22px;
      //   font-weight: 700;
      // }
    }
    .dish-add {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 15px;
            height: auto;
            margin: 0 5px;
            cursor: pointer;
          }
          .amount {
            border: 1px solid #460B79;
            border-radius: 10px;
            background: #ffffff;
            width: 88px;
            height: 32px;
            text-align: center;
          }
        }

.sum-container {
  width: 100%;
  border-top: 1px solid #BFBCBC;
  border-bottom: 1px solid #BFBCBC;
}

.sum, .limit {
  display: flex;
  justify-content: space-between;
  width: 95%;
}

.number {
  margin-right: 5%;
  font-size: 20px;
}
.sum {
  color: #460B79;
  font-size: 24px;
  font-weight: 700;
  margin: 19px auto 14px 25px;
}

.limit {
  color: #44A334;
  font-size: 20px;
  font-weight: 400;
  margin-left: 25px;
  margin-bottom: 20px;
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