<template>
  <div class="home">
    <div class="home-left">
      <ul>
        <li>
          <router-link to="/main/self"> about </router-link>
        </li>
        <li>
          <router-link to="/subapp/app1"> app1 </router-link>
        </li>
        <li @click="push('/subapp/app1/about')">
          app/about
        </li>
        <li @click="push('/subapp/app2/users')">
           /subapp/exception/404
        </li> 
      </ul>
    </div>
    <div class="header">这是一个header</div>
    <div class="container">
      <router-view />
      <div id="sub-app"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  methods:{
    push(item){
      this.$router.push(item)
    }
  }
};
</script>

<style>
.home {
  position: absolute;
  top: 0;
  bottom: 0;
}
.home-left {
  position: fixed;
  width: 250px;
  top: 0;
  bottom: 0;
  background: #abcdef;
}
.header {
  position: fixed;
  left: 250px;
  right: 0;
  top: 0;
  height: 60px;
  background: #e3e3e3;
}
.container {
  position: fixed;
  overflow-x: hidden;
  overflow-y: auto;
  left: 250px;
  top: 60px;
  bottom: 0;
  right: 0;
}
</style>