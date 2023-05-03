<template>
  <NavSection />
  <div class="container col-lg-3 text-center">
    <h1>Settings</h1>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="subscribed" @change="setSubscribe(subscribed)">
      <label class="form-check-label" for="flexCheckDefault">
        Enable push notifications
      </label>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import NavSection from '../../components/NavSection.vue'

const ENDPOINT = '/api';

export default {
  name: 'SettingsView',
  components: {
    NavSection
  },
  mounted() {
    this.requestPermission();
  },
  data() {
    return {
      subscribed: true
    }
  },
  methods: {
    requestPermission() {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.subscribeToNotifications();
          } else {
            console.warn('Permission was denied for notifications');
          }
        });
      } else {
        this.subscribeToNotifications();
      }
    },
    subscribeToNotifications() {
      navigator.serviceWorker.ready.then(swRegistration => {
        swRegistration.pushManager.subscribe({ userVisibleOnly: true })
          .then(subscription => {
            console.log('Subscribed to notifications', subscription);
            axios.post(`${ENDPOINT}/subscribe`, { subscription: subscription })
              .then(response => console.log(response))
              .catch(error => console.log(error));
          })
          .catch(error => console.warn('Failed to subscribe to notifications', error));
      });
    },
    unsubscribeFromNotifications() {
      navigator.serviceWorker.ready.then(swRegistration => {
        swRegistration.pushManager.getSubscription().then(subscription => {
          if(subscription) {
            subscription.unsubscribe()
            .then(() => {
              console.log('Unsubscribed from notifications');
              axios.post(`${ENDPOINT}/unsubscribe`, { subscription: subscription })
                .then(response => console.log(response))
                .catch(error => console.log(error));
            })
            .catch(error => console.warn('Failed to unsubscribe from notifications', error));
          }
        })
      });
    },
    setSubscribe(subscribed) {
      if(subscribed) {
        this.subscribeToNotifications();
      } else {
        this.unsubscribeFromNotifications();
      }
    },
  }
}
</script>


<style scoped>
.container {
  padding: 30px;
  border-radius: 10px;
  margin: auto;
  background-color: #d9e9e9;
  max-width: 90%;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.15);
}

h1 {
  font-size: 30px;
  margin-bottom: 30px;
  user-select: none;
}
.control-panel {
  margin-bottom: 30px;
  font-weight: normal;
}

#error {
  color: rgb(163, 3, 3);
  font-size: 12px;
  margin-top: 4px;
}

.form-group, ul {
  text-align: left;
  font-weight: bold;
  margin-left: 15%;
  margin-right: 15%;
}

.form-group label {
  margin-bottom: 0px;
}

select {
  overflow-y: scroll;
}

.delete-user {
  background-color: rgb(163, 3, 3);
  color: white;
  border: none;
  border-radius: 100%;
  cursor: pointer;
  font-size: 14px;
  margin-left: 4px;
  padding: 4px 8px;
}

ul {
  border: 1px solid #ccc;
  margin-top: 10px;
  list-style: none;
  padding: 5px;
  border-radius: 10px;
}

ul:empty {
  display: none;
}

li {
  background-color: #eee;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  margin: 4px;
  padding: 4px 8px;
}

input[type="text"] {
  font-size: 16px;
  padding: 8px;
}
</style>