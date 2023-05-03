<template>
  <transition enter-active-class="fade-in">
    <div>
      <div class="overlay" v-if="!isOnline"></div>
      <div class="popup" v-if="!isOnline" >
        <p>
          You are currently offline. Please check your internet connection.
        </p>
        <button @click="dismiss">Dismiss</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isOnline: window.navigator.onLine
    }
  },
  mounted() {
    window.addEventListener('online', this.checkOnlineStatus)
    window.addEventListener('offline', this.checkOnlineStatus)
  },
  beforeUnmount() {
    window.removeEventListener('online', this.checkOnlineStatus)
    window.removeEventListener('offline', this.checkOnlineStatus)
  },
  methods: {
    checkOnlineStatus() {
      this.isOnline = window.navigator.onLine
    },
    dismiss() {
      this.isOnline = true
    }
  }
}
</script>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #d9e9e9;
  color: black;
  text-align: center;
  z-index: 9999;
}

.popup button {
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: rgb(197, 95, 95);
  color: rgb(255, 255, 255);
  font-size: 15px;
  cursor: pointer;
}

.popup button:active {
  background-color: rgb(255, 0, 0);
  transition: 0.5s;
}

.fade-in {
  transition: opacity 1s;
}

.fade-in-enter {
  opacity: 0;
}

.fade-in-enter-active {
  opacity: 1;
}
</style>