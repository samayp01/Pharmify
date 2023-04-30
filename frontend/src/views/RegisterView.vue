<template>
    <div id="container" class="col-lg-3 text-center row justify-content-center">
        <HeaderSection />
        <OfflinePopup />
        <h1>Register</h1>
        <p class="register-link">
          Have an account? <router-link to="/login">Login</router-link>
        </p>
        <form @submit.prevent="onSubmit" method="POST">
          <div class="form-group">
            <label for="username">Username</label>
            <input name="username" type="text" class="form-control" :class="{'username-taken': usernameTaken}" v-model="username">
          </div>
          <div class="form-group">
            <label for="firstname">First Name</label>
            <input name="firstname" type="text" class="form-control" v-model="firstname">
          </div>
          <div class="form-group">
            <label for="lastname">Last Name</label>
            <input name="lastname" type="text" class="form-control" v-model="lastname">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input name="email" type="text" class="form-control" v-model="email">
          </div>
          <div class="form-group">
            <label for="password">Password</label><br>
            <input :type="showPassword ? 'text' : 'password'" name="password" class="form-control" :class="{'login-failed': loginFailed}" v-model="password">
          </div>
          <div class="form-group">
            <label for="password2">Retype Password</label>
            <input :type="showPassword ? 'text' : 'password'" name="password2" class="form-control" :class="{'login-failed': loginFailed}" v-model="password2">
          </div>
          <div class="form-check d-flex justify-content-center">
            <input class="form-check-input" type="checkbox" id="show-password-check" v-model="showPassword">
            <label class="form-check-label" for="show-password-check">Show Password</label>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
    </div>
</template>

<script>

import axios from 'axios'
import HeaderSection from '../components/HeaderSection.vue'
import OfflinePopup from '../components/OfflinePopup.vue'

const ENDPOINT = '/api';

export default {
  name: 'RegisterView',
  components: {
    HeaderSection,
    OfflinePopup
  },
  data () {
    return {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password2: '',
      showPassword: false,
      loginFailed: false,
      usernameTaken: false
    }
  },
  methods: {
    onSubmit () {
      console.log('login attempt...');

      const username = this.username.trim();
      const firstname = this.firstname.trim();
      const lastname = this.lastname.trim();
      const email = this.email.trim();
      const password = this.password.trim();
      const password2 = this.password2.trim();

      if(username === '' || password === '' || password2 === '' ||
            firstname === '' || lastname === '' || email === '') {
        
        console.log("One or more fields are empty");
        this.username = '';
        this.password = '';
        this.password2 = '';
        this.loginFailed = true;
        this.usernameTaken = true;
        return;
      }

      if(this.password != this.password2) {
        alert("Passwords do not match");
        this.password = '';
        this.password2 = '';
        this.usernameTaken = false;
        this.loginFailed = true;
        return;
      }

      // check that a string is made up of only characters
      if(!/^[a-zA-Z]+$/.test(firstname)) {
        alert("First name must be made up of only characters");
        this.firstname = '';
        this.usernameTaken = false;
        this.loginFailed = true;
        return;
      }

      // check that a string is made up of only characters
      if(!/^[a-zA-Z]+$/.test(firstname)) {
        alert("First name must be made up of only characters");
        this.firstname = '';
        this.usernameTaken = false;
        this.loginFailed = true;
        return;
      }

      // TODO email regex
      /*
      if(false) {
        alert("Email is not valid");
        this.email = '';
        this.usernameTaken = false;
        this.loginFailed = true;
        return;
      }
      */

      axios.post(`${ENDPOINT}/auth/register`, {
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email
      })
      .then(response => {
        if(response.status === 200) {
          console.log('Registration successful!');
          this.loginFailed = false;
          this.usernameTaken = false;
          this.$router.push('/login');
        }
        else if(response.status === 409) {
          console.log('Username already taken');
          this.usernameTaken = true;
          this.loginFailed = false;
          this.username = '';
          this.password = '';
          this.password2 = '';
          return;
        }
        else {
          console.log('Registration failed');
          this.loginFailed = true;
          this.usernameTaken = false;
        }
        

        this.username = '';
        this.password = '';
        this.password2 = '';
        this.firstname = '';
        this.lastname = '';
        this.email = '';
      })
      .catch(error => {
        console.log(`failed: ${error}`);
      });

      console.log('Registration completed.');
    }
  }
};

</script>

<style>
h1 {
  font-size: 25px;
}

#container {
  margin: auto;
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

.username-taken {
  border-color: orangered;
}

</style>