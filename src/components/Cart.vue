<template>
  <div class="cart">
  <div class="dish-container">
    <div v-for="(dish, index) in todayCart.basket_dishes" :key="index">
      <div class="dish" v-show="dish.count > 0">
        <div class="dish-photo">
            <img :src="dish.image">
        </div>
        <div class="info">
          <p class="name">{{dish.name}}</p>
          <p class="weight">{{dish.weight}} г.</p>
          <p class="price">{{dish.price.replace(/.00/, '')}} P</p>
        </div>
        <div class="dish-add">
              <img src="../assets/img/minus.svg" @click="deleteDish(index, dish.category_id, todayCart.id, dish.id, count = 1)">
              <div class="amount">
                  {{dish.count}}
              </div>
              <img src="../assets/img/plus.svg" @click="buyDish(index, dish.category_id, todayCart.id, dish.id, count = 1)">
        </div>
      </div> 
    </div>
  </div>

    <div class="sum-container">
      <div class="sum">
       <p>Итого:</p> 
       <p class="number">{{todayCart.basket_summ}} P</p>
      </div>
      <div class="limit" :style="{'color' : (this.todayCart.basket_summ >= this.todayCart.basket_summ_limit ? '#ED2736':'#42D547')}">
        <p>Оставшийся лимит:</p> 
        <p class="number">{{todayCart.basket_summ_limit - this.todayCart.basket_summ}} P</p>
      </div>
    </div>
    <div class="btns">
      <button class="clear-cart" @click="clearCart(todayCart.id)">Очистить корзину</button>
    </div>

  </div>
</template>

<script>
// import $ from "jquery";
  export default {
    data () {
      return {
        showCart: false,
      }
    },
    methods: {
      buyDish(index, categoryIndex, menu_id, dish_id, count) {
        this.$store.dispatch("OrderDish", {menu_id, dish_id, count});
        this.todayCart.basket_dishes[index].count++;
        this.todayCart.basket_summ = this.todayCart.basket_summ
                            + parseInt(this.todayCart.basket_dishes[index].price);
                            
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
        let count = 0;
        let categoryIndex = 0;
        for (let i = 0; i < this.todayCart.basket_dishes.length; i++) {
          dish_id = this.todayCart.basket_dishes[i].id;
          count = this.todayCart.basket_dishes[i].count;
          categoryIndex = this.todayCart.basket_dishes[i].category_id;
          this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
          this.todayCart.basket_dishes[i].count -= count;
          for (let k = 0; k < this.todayMenu.categories.length; k++) {
            if (this.todayMenu.categories[k].id == categoryIndex) {
              for (let j = 0; j < this.todayMenu.categories[k].dishes.length; j++)
                if (this.todayMenu.categories[k].dishes[j].id == dish_id) {
                  // console.log(this.todayMenu.categories[k].dishes[j].in_basket_count);
                  this.todayMenu.categories[k].dishes[j].in_basket_count -= count;
                }
            }
          }
        }
        this.todayCart.basket_summ = 0;
      }
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
        await this.$store.dispatch("fetchCart");
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
  // color: #44A334;
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