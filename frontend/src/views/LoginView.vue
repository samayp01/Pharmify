<template>
  <div id="container" class="col-lg-3 text-center row justify-content-center">
    <OfflinePopup />
    <h1>Login</h1>
    <p class="register-link">
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
    <form ref="loginForm" @submit.prevent="onSubmit" method="POST">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" v-model="username" class="form-control" :class="{'login-failed': loginFailed}">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" :class="{'login-failed': loginFailed}">
      </div>
      <div class="form-check d-flex justify-content-center">
        <input class="form-check-input" type="checkbox" id="show-password-check" v-model="showPassword">
        <label class="form-check-label" for="show-password-check">Show Password</label>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      <p class="text-danger" v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>

import axios from 'axios'
import OfflinePopup from '../components/OfflinePopup.vue'

const ENDPOINT = '/api';

export default {
  name: 'LoginView',
  components: {
    OfflinePopup
  },
  data () {
    return {
      username: '',
      password: '',
      showPassword: false,
      loginFailed: false,
      error: null
    }
  },
  methods: {
    async onSubmit () {
      const username = this.username.trim();
      const password = this.password.trim();
      
      if(username === '' || password === '') {
        this.username = '';
        this.password = '';
        return;
      }

      axios.post(`${ENDPOINT}/auth/login`, {
        username: this.username,
        password: this.password
      })
      .then(response => {
        if(response.status === 200 && response.data.token) {
          console.log('Login Successful');
          localStorage.setItem('jwt', response.data.token);
          localStorage.setItem('user', response.data.user);
          this.$router.push('/dashboard');
        } else {
          console.log('Login Failed');
          this.error = "Invalid user credentials"
          this.loginFailed = true;
        }
        
        this.error = ""
        this.loginFailed = false;
        this.username = '';
        this.password = '';
      })
      .catch(error => {
        this.error = "Invalid user credentials"
        console.log(`Login failed: ${error}`);
      });
    }
  }
};

</script>

<style scoped>

h1 {
  font-size: 25px;
}

#container {
  padding: 30px;
  border-radius: 10px;
  margin: auto;
  margin-top: 25vh;
  background-color: #d9e9e9;
  max-width: 90%;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.15);
}

.form-group {
  font-size: 15px;
  margin-bottom: 20px;
  text-align: left;
  margin-left: 10%;
  margin-right: 10%;
}

.login-failed {
  border-color: orangered;
}

.form-check {
  margin-bottom: 20px;
}

</style>