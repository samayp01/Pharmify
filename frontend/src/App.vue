<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if(navigator.serviceWorker) {
      navigator.serviceWorker.register('/sw.js')
        .then(register => {
          if (register.installing) {
            console.log('Service worker installing');
          } else if (register.waiting) {
            console.log('Service worker installed');
          } else if (register.active) {
            console.log('Service worker active');
          }
        })
        .catch(error => {
          console.log('Service worker registration failed: ' + error);
        });
    }
  }
}
</script>

<style>
#app {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1b2732;
}

body {
  /* background: linear-gradient(to bottom, #78dbba, #56ad92); */
  background: linear-gradient(to bottom, #5caa90, #337d65);
  margin: 0;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
