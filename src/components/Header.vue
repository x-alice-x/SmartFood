<template>
    <div class="header">
        <div class="container">

            <div class="user">
                <img src="../assets/img/user.svg" 
                     alt="User Image"
                     @click="show" >
            </div>
            <div class="logo">
                <a>SmartFood</a>
            </div>

            <div class="cart">
                <div class="sum">126 Р</div>
                <img src="../assets/img/cart_white.svg" 
                     alt="Cart ico"
                     @click="showCart = !showCart">
            </div>
        </div>

        <modal name="profile-modal">
        <div class="profile-modal">
          <div class="head">
            <div class="close-btn" @click="hide"><img id="close-btn-img" src="../assets/img/close_icon.svg" /> </div>
            <img v-if="avatar"
                 src="../assets/img/user.svg"
                 alt="User Image">
            <img v-if="!avatar"
                 :src="avatar"
                 alt="User Photo">
            <h3 class="username">{{ username }}</h3>
            <h4 class="email">{{ email }}</h4>
          </div>
            <div class="total-sum-container">
                <div class="total-sum">
                    <div class="show-black-listed">
                        <p>Черный список</p>
                        <label class="switch">
                            <input type="checkbox" @click="blackListMenuChange">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
          <div class="logout-btn">
            <button @click="logout()">Logout</button>
          </div>
        </div>
      </modal>

      <Cart class="cart_comp" 
            v-if="showCart"
            @closeCart = "showCart=false" />
    </div>
</template>

<script>
  import Cart from "./Cart.vue";
  export default {
        components: {Cart},
        data() {
            return {
                showCart: false,
                blackListShow: false,
            }
        },
        computed: {
            username() {
                return this.$store.getters.getUserName;
            },
            email() {
                return this.$store.getters.getUserEmail;
            },
            avatar() {
              return this.$store.getters.getUserPhoto;
              // return "../assets/img/avatar.svg";
            },
            errors() {
                return this.$store.getters.getError;
            }
        },
        methods: {
            show() {
              this.$modal.show('profile-modal');
            },
            hide() {
              this.$modal.hide('profile-modal');
            },
            async logout() {
                await this.$store.dispatch("Logout");
                if (!this.errors) {
                    this.$router.push("/");
                }
            }
        }
    }
</script>

<style>

  .v--modal-background-click{
      padding-top: 20vh;
  }
  .v--modal-box.v--modal {
    top: 0 !important;
    left: 0 !important;
    width: 508px !important;
    height: 428px !important;
    border: none;
    border-radius: 10px;
    box-shadow: 0px 4px 33px rgba(0, 0, 0, 0.75);
    margin: auto;
  }
  @media (max-width: 768px) {
      .v--modal-box.v--modal {
          width: 408px !important;
          height: 328px !important;
      }
  }
  @media (max-width: 450px) {
      .v--modal-box.v--modal {
          width: 300px !important;
          height: 300px !important;
      }
  }
</style>
<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";

.sum {
    display: flex;
    align-items: center;
    font-size: 30px; 
    text-align: center;
    color: #FFFFFF;
    margin-right: 15px;
    min-width: 25%;
}

    .close-btn {
        position: absolute;
        cursor: pointer;
        right: 31px;
        top: 20px;

        #close-btn-img {
        width: 34px;
        height: 34px;
        }
    }

        .totel-sum-container {
            align-items: center;
            justify-content: center;
            width: 100%;
            z-index: 2;
        }

        .show-black-listed {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 70%;
            margin: 6% auto 2% auto;
            p {
                font-size: 22px;
                color: #000000;
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


    .header{
        height: 50px;
        width: 100%;
        background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
        color: $font-color;
        .container{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding: 0 75px;
            .user{
                left: 3%;
                right: auto;
                cursor: pointer;
                width: 25px;
                // position: absolute;
            }
            .logo {
                a {
                font-weight: 900;
                font-size: 30px;
                line-height: 45px;
                color: #ffffff;
                }
            }
            .cart {
                display: flex;
                // width: 10%;
                img {
                    cursor: pointer;
                    width: 40px;
                    height: auto;
                }
            }
        }
    }
.head {
    width: auto;
    height: 250px;
    background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
        width: 45px;
        height: 57.43px;
        border-radius: 50px;
        margin-bottom: 20px;
        margin-top: 10px;
    }
}
.username {
  text-align: center;
  font-family: $font;
  font-weight: 900;
  font-size: 36px;
  line-height: 42px;
  color: #ffffff;
  margin-bottom: 5px;
}
.email {
  font-family: Roboto, sans-serif;
  font-weight: 200;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 18px;
}
.logout-btn {
  display: flex;
  justify-content: center;
  margin-top: 30px;
    button {
        background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
        border-radius: 46px;
        border: none;
        width: 200px;
        height: 50px;
        font-weight: 900;
        font-size: 24px;
        line-height: 28px;
        text-align: center;
        color: #FFFFFF;
        text-transform: uppercase;
        cursor: pointer;
        outline: none;
    }
}
.cart_comp {
    position: absolute;
    right: 5%;
    z-index: 500;
}
@media (max-width: 790px){
    .header{
        .container{
            padding: 0 15px;
        }
    }
    body.v--modal-background-click{
        padding-top: 20vh;
    }
    body.v--modal-box.v--modal {
        top: 0 !important;
        left: 0 !important;
        width: 408px !important;
        height: 328px !important;
        border: none;
        border-radius: 10px;
        box-shadow: 0px 4px 33px rgba(0, 0, 0, 0.75);
        margin: auto;
    }
    .head {
        height: 200px;
    }
    .logout-btn {
        margin-top: 30px;
    }
}
@media (max-width: 450px) {
    .header {
        .container {
            padding: 0 15px;
            .logo {
                a {
                    font-size: 24px;
                }
            }
            .user{
                width: 20px;
            }
        }
    }
}
</style>