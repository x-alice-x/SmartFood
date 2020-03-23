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
                <div class="sum">126</div>
                <img src="../assets/img/cart_white.svg" 
                     alt="Cart ico"
                     @click="showCart = !showCart">
            </div>
        </div>

        <modal name="profile-modal">
        <div class="profile-modal">
          <div class="head">
            <img v-if="avatar"
                 src="../assets/img/user.svg"
                 alt="User Image">
            <img v-if="!avatar"
                 :src="avatar"
                 alt="User Photo">
            <h3 class="username">{{ username }}</h3>
            <h4 class="email">{{ email }}</h4>
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
                showCart: false
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
                img {
                    cursor: pointer;
                    width: 25px;
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
  margin-top: 60px;
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
    z-index: 200;
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