<template>
  <div class="landing-page">
    <TitleBox />
    <main class="main">
      <p class="subtitle">Seamlessly manage your medical prescriptions with ease.</p>
      <div class="divider"><hr /></div>
      <div class="buttons">
        <div v-on:click="toLogin" class="button">Login</div>
        <div v-on:click="toRegister" class="button">Register</div>
      </div>
    </main>
  </div>
</template>

<script>
import TitleBox from '../components/TitleBox.vue';

export default {
  name: 'LandingPage',
  components: {
    TitleBox,
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
    toRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #40846e;
  background: linear-gradient(to bottom, #5caa90, #337d65);
  color: white;
}

.main {
  text-align: center;
}

.subtitle {
  font-size: 18px;
}

.divider {
  margin: auto;
  margin-top: 80px;
  margin-bottom: 80px;
  width: 80%;
}

.buttons {
  display: flex;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
  margin: auto;
  width: 50%;
}

.button {
  padding: 12px 24px;
  flex: 1;
  background-color: #70adad;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  margin: 0 10px;
  font-size: 16px;
  transition: background-color 0.3s;
  cursor: pointer;
  user-select: none;
}

.button:hover {
  background-color: #306956;
}

</style>