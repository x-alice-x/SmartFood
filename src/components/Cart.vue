<template>
<div class="cart">
  <div class="dish-container">
    <div v-for="(dish, index) in todayCart.basket_dishes" :key="index">
      <div class="dish" v-if="dish.count">
        <div class="dish-photo">
            <img :src="dish.image">
        </div>
        <div class="info">
          <p class="name">{{dish.name}}</p>
          <p class="weight">{{dish.weight}} г.</p>
          <p class="price">{{dish.price.replace(/.00/, '')}} P</p>
        </div>
        <div class="dish-add">
              <img src="../assets/img/minus.svg" @click="deleteDish(index, todayCart.id, dish.id, count = 0)">
              <div class="amount">
                <p>{{dish.count}}</p>
              </div>
              <img src="../assets/img/plus.svg" @click="buyDish(index, todayCart.id, dish.id, count = 0)">
        </div>
      </div> 
    </div>
  </div>

    <div class="sum-container">
      <div class="sum">
       <p>Итого:</p> 
       <p class="number">{{todayCart.basket_summ}} P</p>
      </div>
      <div class="limit">
        <p>Оставшийся лимит:</p> 
        <p class="number">{{todayCart.basket_summ_limit}} P</p>
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
    components: {
    },
    data () {
      return {
        // showCart: false,
      }
    },
    methods: {
      buyDish(index, menu_id, dish_id, count) {
        this.$store.dispatch("OrderDish", {menu_id, dish_id, count});
        this.todayCart.basket_dishes[index].count++;
        this.todayCart.basket_summ = this.todayCart.basket_summ
                            + parseInt(this.todayCart.basket_dishes[index].price);
      },
      deleteDish(index, menu_id, dish_id, count) {
        this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
        console.log(this.todayCart.basket_dishes[index])
        this.todayCart.basket_dishes[index].count--;
        this.todayCart.basket_summ = this.todayCart.basket_summ
                            - parseInt(this.todayCart.basket_dishes[index].price);
      },
      clearCart(menu_id) {
        let dish_id = 0;
        let count = 0;
        for (let i = 0; i < this.todayCart.basket_dishes.length; i++) {
          dish_id = this.todayCart.basket_dishes[i].id;
          count = this.todayCart.basket_dishes[i].count;
          this.$store.dispatch("DeleteDish", {menu_id, dish_id, count});
        }
      }
    },
    computed: {
        todayCart() {
            return this.$store.getters.getTodayCart;
        },
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
	height: auto;
	box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.25);
	background: #fff;
	border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

	.dish-container {
		height: auto;
		min-height: 380px;
    padding-top: 2%;
    overflow: scroll;
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
			padding: 10px 0 0 0;
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
		color: #44a334;
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
			width: 180px;
			height: 38px;
			font-family: 'Roboto', sans-serif;
			font-size: 18px;
		}
		.clear-cart {
			border: 1px solid #460b79;
			background: transparent;
			color: #460b79;
		}
	}

@media (max-width: 790px) {

	.cart {
		width: 100vw;
    height: 100vh;
    // margin-top: 50px;

	}
	.dish-add {
		width: 20%;
		img {
			display: none;
		}
		.amount {
      margin-right: 12%;
      border: none;
			p {
				font-size: 24px;
				font-weight: 700;
			}
		}
	}
	.dish-container {
		min-height: 70%;
    height: auto;
    overflow:scroll;
	}
	.dish-photo {
		img {
			width: 110px;
			height: auto;
      clip-path: circle(40px at center);
      margin: 10px 10px 0 10px;
		}
	}
	.dish {
		width: 97%;
		height: 100px;
		.info {
			.name {
				font-size: 20px;
			}
			.weight {
				font-size: 18px;
			}
			.price {
				font-size: 18px;
			}
		}
	}
}
@media (max-width: 650px) {
	.dish-container {
		min-height: 61%;
		height: auto;
    padding-top: 0;
    overflow:scroll;
	}
	.dish {
		width: 97%;
		height: 70px;
		.info {
			font-size: 18px;
			.name {
				font-size: 18px;
			}
			.weight {
				font-size: 16px ;
			}
			.price {
				font-size: 16px;
			}
		}
		.dish-add {
			width: 20%;
			img {
				display: none;
			}
			.amount {
				p {
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}
@media (max-width: 470px) {
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
		height: 64%;
    overflow:scroll;
	}
	.dish-photo {
		img {
			width: 80px;
			height: auto;
			clip-path: circle(30px at center);
			margin-left: -10px;
			margin-top: 10px;
			margin-right: 10px;
		}
	}
	.dish {
		width: 97%;
		height: 70px;
		.info {
			.name {
				font-size: 14px;
			}
			.weight {
				font-size: 14px;
			}
			.price {
				font-size: 14px;
			}
		}
		.dish-add {
			width: 25%;
			img {
				display: none;
			}
			.amount {
				border: none;
				margin-right: 12%;
				p {
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}

@media (max-width: 376px) {
	.dish-container {
     height: 50%;
     overflow:scroll;
	}
}

@media (max-width: 340px) {
	.dish-container {
    max-height: 46%;
    overflow:scroll;
  }
  
	.btns {
    margin-top: 1%;
    margin-bottom: 2%;
		width: 100%;
		min-height: 37px;
		display: flex;
		justify-content: center;
		align-items: center;
		button {
			border-radius: 46px;
			outline: none;
			width: 150px;
			height: 32px;
			font-family: 'Roboto', sans-serif;
			font-size: 14px;
		}
	}
	.dish {
    max-height: 70px;
		.info {
			.name {
				font-size: 12px;
			}
			.weight {
				font-size: 12px;
			}
			.price {
				font-size: 12px;
			}
		}
		.dish-add {
			.amount {
				p {
					font-size: 16px;
				}
			}
		}
  }
}
}
</style>