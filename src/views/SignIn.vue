<template>
  <div class="signin">
    <div class="signin-title">SmartFood</div>
    <form class="signin-form" @submit.prevent="SignIn()">
      <div>
        <input
          class="form-input"
          type="text"
          id="signin-email"
          placeholder="@smartworld.team"
          v-model.trim="email"
        />
          <!-- @focusout="checkEmail()" -->
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
      emailError: ""
    };
  },
  methods: {
    async SignIn() {
      await this.$store.dispatch("SignIn", this.email);
      // .then (
      //   resp => {
      //     console.log(resp);
      //   });
      console.log(this.errors);
      if (!this.errors) {
          this.$router.push("/");
      }
      else {
        this.emailError = this.errors;
      }
    },
    // checkEmail() {
    //   this.$store.dispatch("CLEAR_ERRORS", "auth");
    //   this.authError = "";
    //   const emailArr = this.email.split("@");
    //   if (this.email != "" && emailArr[1] == undefined)
    //     this.email = emailArr[0] + "@smartworld.team";
    //   this.$store.dispatch("CHECK_EMAIL", this.email).then(
    //     result => {
    //       if (result == "empty") this.emailError = "Заполните e-mail";
    //       // else if (result == 'wrong')
    //       //   this.emailError = 'Невалидный e-mail'
    //       else {
    //         this.emailError = "";
    //         this.$store.dispatch("CLEAR_ERRORS", "email");
    //       }
    //     },
    //     error => console.log("Email checker rejected: " + error.message)
    //   );
    // }
  },
  computed: {
    errors() {
      return this.$store.getters.getError;
    }
  }
};
</script>

<style>
/*
@import "../assets/scss/vars.scss";
@import "../assets/scss/root.scss";*/

.signin {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
  /*opacity: 10%;*/
  background-size: cover;
}

  .signin-title {
    font-family: Roboto, sans-serif;
    font-size: 72px;
    line-height: 84px;
    color: #ffffff;
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
    border-bottom: 1px solid #ffffff;
    font-family: Roboto, sans-serif;
    font-weight: 300;
    font-size: 36px;
    text-align: right;
    color: #ffffff;
    transition: 0.2s;
    text-align: center;
    outline: none;
  }
  ::placeholder {
      font-family: Roboto, sans-serif;
      font-weight: 300;
      font-size: 36px;
      text-align: right;
      color: #ffffff;
    }

  .form-submit {
    font-family: Roboto, sans-serif;
    width: 200px;
    height: 50px;
    padding: 10px;
    background-color: #ffffff;
    border: 1px solid #ffffff;
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
    -webkit-background-clip: text;
    display: block;
  }
    :hover button{
      border: 1px solid lighten(#88267F, 35);
    }
  .form-error {
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    font-weight: bold;
    color: #FF6D56;
  }
@media(max-width: 768px) {
  .from-submit {
    width: 100%;
  }
  input {
    width: 100% !important;
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
      font-size: 15px !important;
    }
    ::placeholder {
      font-size: 15px;
    }
    .form-submit {
      height: 25px;
      height: 35px;
      font-size: 16px;
      padding: 0;
    }
}

</style>
