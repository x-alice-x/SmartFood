<template>
  <div class="cart">
    <!-- <div class="header">
      <img src="../assets/img/close.svg"
           alt="Close"
           @click="showCart = !showCart">
    </div> -->
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
       <p class="number">100 P</p>
      </div>
      <div class="limit">
        <p>Оставшийся лимит:</p> 
        <p class="number">100 Р</p>
      </div>
    </div>
    <div class="btns">
      <button class="clear-cart">Очистить корзину</button>
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
    width: 500px;
    // min-height: 600px;
    height: auto;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.25);  
    background: #fff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    
    .header {
      height: 40px;
      // background: $c-main;
      display: flex;
      border: none;
      background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
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
    min-height: 380px;
    padding-top: 2%;
    }
    .dish {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin: 2%;
      width: 94%;
      img {
        width: 70px;
        height: auto;
        clip-path: circle(55px at center);
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
        font-size: 14px;
        font-weight: 700;
        .name {
        text-transform: uppercase;
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
            width: 15px;
            height: auto;
            margin: 0 5px;
            cursor: pointer;
          }
          .amount {
            border: 1px solid #460B79;
            border-radius: 10px;
            background: #ffffff;
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
  border-top: 1px solid #BFBCBC;
  border-bottom: 1px solid #BFBCBC;
  margin-bottom: 2%;
}

.sum, .limit {
  display: flex;
  justify-content: space-between;
  width: 95%;
}

.number {
  margin-right: 5%;
  font-size: 18px;
}
.sum {
  color: #460B79;
  font-size: 20px;
  font-weight: 700;
  margin: 14px auto 10px 25px;
}

.limit {
  color: #44A334;
  font-size: 18px;
  font-weight: 400;
  margin-left: 25px;
  margin-bottom: 14px;
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
        width: 180px;
        height: 38px;
        font-family: $font;
        font-size: 18px;
      }
      .clear-cart {
        border: 1px solid $font-color;
        background: transparent;
        color: $font-color;
      }
    }
  }
</style>