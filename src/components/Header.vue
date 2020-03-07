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
            </div>
        </div>

        <modal name="profile-modal">
        <div class="profile-modal">
          <div class="head">
            <img src="../assets/img/user.svg"
                 alt="User Image">
              <h3 class="username">{{ username }}</h3>
              <h4 class="email">{{ email }}</h4>
          </div>
          <div class="logout-btn">
            <button @click="logout()">Logout</button>
          </div>
        </div>
      </modal>

    </div>
</template>

<script>
  export default {
        computed: {
            username() {
                return "Gram"; // getters
            },
            email() {
                return this.$store.getters.getUserEmail;
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
                    this.$router.push("/signin");
                }
                else {
                    console.log(this.errors);
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
        background: $c-main;
        color: $font-color;
        .container{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding: 0 75px;
            .user{
                cursor: pointer;
                width: 30px;
            }
            .logo {
                a {
                font-weight: 700;
                font-size: 40px;
                line-height: 45px;
                }
            }
        }
    }
.head {
    width: 100%;
    height: 250px;
    background: $c-main;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
        width: 45px;
        height: 57.43px;
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
  color: #460B79;
  margin-bottom: 5px;
}
.email {
  font-family: Roboto, sans-serif;
  font-weight: 200;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: #460B79;
  margin-bottom: 18px;
}
.logout-btn {
  display: flex;
  justify-content: center;
  margin-top: 60px;
    button {
        background: #460B79;
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
@media (max-width: 768px){
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
                    font-size: 38px;
                }
            }
            .user{
                width: 35px;
            }
        }
    }
}
</style>