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
        .then(registration => {
          if (registration.installing) {
            console.log('Service worker installing');
          } else if (registration.waiting) {
            console.log('Service worker installed');
          } else if (registration.active) {
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
  background: linear-gradient(to bottom, #7effd4, #40846e);
  margin: 0;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
