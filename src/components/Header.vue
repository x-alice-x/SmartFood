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
        </div>

        <modal name="profile-modal">
        <div class="profile-modal">
          <div class="avatar">
            <img src="" v-if="avatar">
            <img src="../assets/img/avatar.svg" v-else>
          </div>
          <h3 class="username">{{ username }}</h3>
          <h4 class="email">{{ email }}</h4>
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
                return "kjhkjh@khj.com"; //getters
            },
            errors() {
                return this.$store.getters.getError;
            }
        },
        methods: {
            show() {
              this.$modal.show('profile-modal');
            },
            logout() {
                this.$store.dispatch("Logout");
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
  .v--modal-box.v--modal {
    width: 508px !important;
    height: 428px !important;
    border: none;
    border-radius: 10px;
    box-shadow: 0px 4px 33px rgba(0, 0, 0, 0.75);
  }
</style>
<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";

    .header{
        z-index: 1000;
        position: fixed;
        top: 0px;
        height: 80px;
        width: 100%;
        background: $c-main;
        .container{
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            height: 100%;
            padding: 15px;
            .user{
                position: absolute;
                align-self: flex-start;
                cursor: pointer;
            }
            .logo {
                align-self: center;
                a {
                font-weight: 900;
                font-size: 48px;
                line-height: 45px;
                color: white;
                }
            }
        }
    }
.avatar {
  margin-bottom: 16px;
  img {
    width: 508px;
    height: 250px;
    }
}
.username {
  text-align: center;
  font-family: $font;
  font-weight: 900;
  font-size: 36px;
  line-height: 42px;
  color: #460B79;
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
    }
}
</style>