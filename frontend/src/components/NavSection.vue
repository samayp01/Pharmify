<template>
  <div class="header">
    <div class="home" title="Dashboard" v-on:click="home">🏠</div>
    <div class="right-end">
      <div class="settings" title="Settings" v-on:click="settings">⚙️</div>
      <div class="logout" title="Logout" v-on:click="logout">
        <img src="/exit.png" alt="Logout">
      </div>
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

<style scoped>

.header {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  padding: 20px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
}

.home {
  padding: 7px;
  font-size: 30px;
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
  border-radius: 10px;
  transition: 0.3s;
  order: 1;
  cursor: pointer;
  user-select: none;
}

.settings {
  padding: 7px;
  font-size: 30px;
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
  border-radius: 10px;
  transition: 0.3s;
  cursor: pointer;
  user-select: none;
}

.home:hover, .logout:hover, .settings:hover {
  background-color: rgb(164, 244, 226);
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
}

.logout {
  padding: 16px;
  margin: 0;
  box-shadow: 0px 0px 5px rgb(101, 152, 140);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: #fff;
  transition: 0.3s;
  user-select: none;
  vertical-align: middle;
}

.right-end {
  display: flex;
  justify-content: flex-end;
  order: 2;
}

.settings, .logout {
  margin-left: 15px;
}

.logout img {
  width: 25px;
  height: 25px;
  margin: 0;
}

</style>