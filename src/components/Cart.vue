<template>
  <div class="cart">
    <div class="header">
      <img src="../assets/img/close.svg"
           alt="Close"
           @click="$emit('closeCart')">
    </div>

    <div class="btns">
      <button class="clear-cart">Очистить корзину</button>
      <button class="confirm-order">Подтвердить заказ</button>
    </div>

  </div>
</template>

<script>
  
</script>

<style lang="scss" scoped>
    @import "../assets/scss/vars.scss";    
    @import "../assets/scss/root.scss";

  .cart {
    width: 470px;
    height: 665px;
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
    .btns {
      display: flex;
      justify-content: space-around;
      button {
        border-radius: 46px;
        outline: none;
        width: 200px;
        height: 48px;
        font-family: $font;
        font-size: 18px;  
      }
      .clear-cart {
        border: 1px solid #5288CA;
        background: #FCFAF1;
        color: #5288CA;
      }
      .confirm-order {
        border: none;
        background: #5288CA;
        color: #ffffff;
      }
    }
  }
</style>