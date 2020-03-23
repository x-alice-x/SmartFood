<template>
  <div class="signin">
    <div class="signin-title">SmartFood</div>
    <form class="signin-form" @submit.prevent="LogIn()">
      <div>
        <input
          :class="{'form-input': domain==false}"
          type="text"
          id="signin-email"
          v-model.trim="email"
          @focusout="checkEmail()"
        />
        <label v-if="domain">@smartworld.team</label> 
        <div class="form-error" v-if="emailError != ''">{{ emailError }}</div>
      </div>
      <button class="form-submit" type="submit" v-if="email"><span>Login</span></button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      emailError: "",
      validation: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i
    };
  },
  methods: {
    async LogIn() {
      if ((this.email.indexOf('@') == -1)&&(this.email)) {
        this.email = this.email + "@smartworld.team";
      }
      let regexp = new RegExp(this.validation);
      let isEmail = regexp.test(this.email);
      if (isEmail) {
        await this.$store.dispatch("SignIn", this.email).then(
          resp => {
            if (resp == "OK") {
              this.$router.push("/menu");
            }
          },
          err => {
            if (err.message.indexOf('401') != -1) {
              this.emailError = 'Пользователь с такой почтой не зарегистрирован';
            }
            else {
              this.emailError = this.errors;
            }
          }
        )
      }
      else {
        this.emailError = 'Неверно указана почта'
      }
    },
    checkEmail() {
      if ((this.email.indexOf('@') == -1)&&(this.email)) {
        this.email = this.email + "@smartworld.team";
      } 
    }
  },
  computed: {
    errors() {
      return this.$store.getters.getError;
    },
    domain() {
      if (this.email.indexOf('@') != -1) {
        return false;
      }
      else {
        return true;
      }
    }
  },
  async created() {
    this.$store.dispatch("CHECK_AUTHORIZED");
    if (this.$store.getters.isUserAuthenticated) {
      this.$router.push("/menu");
    }
  }
};
</script>

<style scoped>
/*  Вебкит для инпута */
  @-webkit-keyframes autofill {
    to {
      color: #F0F2F4;
      background: transparent;
    }
  }

  input:-webkit-autofill {
    -webkit-animation-name: autofill;
    -webkit-animation-fill-mode: both;
  }

.signin {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
  background-size: cover;
}

  .signin-title {
    font-family: Roboto, sans-serif;
    font-size: 72px;
    line-height: 84px;
    color: #FFFFFF;
    margin-bottom: 58px;
    margin-top: -100px;
  }

  .signin-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 170px;
  }

  .signin-form input {
    width: 640px;
    padding: 10px 0;
    border: none;
    background-color: transparent;
    border-bottom: 1px solid white;
    font-family: Roboto, sans-serif;
    font-weight: 300;
    font-size: 36px;
    text-indent: 25%;
    /*
    transform: translate(-50%);*/
    /*text-align: center; */
    transition: .4s;
    color: #ffffff;
    outline: none;
  }
  .signin-form label {
    position: absolute;
    font-family: Roboto, sans-serif;
    font-weight: 300;
    font-size: 36px;
    text-align: right;
    color: #ffffff;
    left: 50%;
    margin-top: 10px;
  }
   input:focus {
    /*text-align: left;*/
    text-indent: 1%;
  }
  .invalid {
    border-bottom: 1px solid red;
  }
  /*input:focus:invalid {
    border-bottom: 1px solid #ffffff;
  }*/
  .form-input:focus {
    /*text-align: center;*/
    text-indent: 25%;
  }

  .form-submit {
    font-family: Roboto, sans-serif;
    width: 200px;
    height: 50px;
    padding: 10px;
    background-color: white;
    border: 1px solid white;
    border-radius: 46px;
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    text-transform: uppercase;
    outline: none;
    cursor: pointer;
  }
  .form-submit span {
    background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
  }
    button:hover{
      border: 1px solid lighten(#88267F, 35);
    }
  .form-error {
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    font-weight: bold;
    color: #FF6D56;
  }
@media(max-width: 768px) {
  /* .form-submit {
    width: 100%;
  } */
  input {
    text-indent: 15% !important;
  }
  .signin-form label {
    left: 50%;
  }
  input:focus {
    /*text-align: left;*/
    text-indent: 0% !important;
  }
}

@media(max-width: 666px) {
  input {
    width: 500px !important;
    font-size: 24px !important;
  }
  .signin-form label {
    font-size: 24px;
    left: 57%;
  }
}

@media(max-width: 576px) {
  .signin-title {
      font-size: 34px;
      margin-bottom: 15px;
    }
    .signin-form {
      height: 100px;
    }
    input {
      padding: 3px 0 10px 0 !important;
      font-size: 16px !important;
      max-width: 400px !important;
      text-indent: 30% !important;
    }
    .signin-form label {
      font-size: 16px;
      margin-top: 6px;
    }
    .form-submit {
      height: 25px;
      height: 35px;
      font-size: 16px;
      padding: 0;
    }
}

@media(max-width: 400px) {
  input {
    width: 300px !important;
  }
}

</style>
