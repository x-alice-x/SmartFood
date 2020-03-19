<template>
  <div class="not-found">
    <h1>Not Found</h1>
    <router-link to="/">Home</router-link>
  </div>
</template>
<style lang="scss" scoped>
  @import "../assets/scss/vars.scss";
  @import "../assets/scss/root.scss";
  
  .not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
    background-size: cover;
    h1 {
      color: #ffffff;
      font-family: $font;
      font-size: 50px;
    }
    .router-link-active {
      margin-top: 40px;
      color: #ffffff;
      font-size: 30px;  
    }
  }

</style>