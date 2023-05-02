<style scoped>

.header {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  user-select: none;
  font-size: 30px;
}

.home {
  padding: 5px;
  font-size: 25px;
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
  border-radius: 80%;
  transition: 0.3s;
}

.home:hover, .logout:hover {
  background-color: rgb(111, 162, 150);
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
}

.logout {
  padding: 10px;
  margin-left: 20px;
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
  border: none;
  border-radius: 100%;
  cursor: pointer;
  /* background-color: rgb(165, 203, 194); */
  color: #fff;
  transition: 0.3s;
  user-select: none;
}

.logout img {
  width: 20px;
  height: 20px;
}

</style>

<template>
  <div class="header">
    <h1 class="home" title="Dashboard" v-on:click="home">🏠</h1>
    <div class="logout" title="Log Out" v-on:click="logout">
        <img src="/exit.png" alt="Logout">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const ENDPOINT = '/api';

export default {
  name: 'NavSection',
  methods: {
    settings() {
      this.$router.push('/settings');
    },
    logout() {
      axios.post(`${ENDPOINT}/auth/logout`)
      .then(response => {
        if(response.status === 200) {
          console.log('Logged out.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$router.push('/login');
        } else {
          console.log('Error logging out.');
        }
      })
      .catch(error => {
        console.log(error)
      });
    },
    home() {
      this.$router.push('/dashboard');
    }
  }
}
</script>