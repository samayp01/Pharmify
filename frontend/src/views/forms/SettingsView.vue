<template>
  <div class="col-lg-3" style="margin: auto">
    <NavSection />
    <div class="text-center">
      <h1>Settings</h1>
    </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="subscribed" @change="subscribe(subscribed)">
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
  data() {
    return {
      subscribed: false
    }
  },
  methods: {
    urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      return outputArray;
    },

    async getServiceWorkerSubscription() {
      return navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service worker registered, waiting...');
        const serviceWorker = registration.installing || registration.waiting || registration.active;
        let whenRegistrationActive = Promise.resolve(registration);
        if (!registration.active || registration.active.state !== 'activated') {
          whenRegistrationActive = new Promise(resolve => {
            serviceWorker.addEventListener('statechange', e => {
              if (e.target.state === 'activated') {
                resolve(registration);
              }
            })
          })
        }
        return whenRegistrationActive;
      });
    },

    subscribe(subscribed) {
      // https://www.attheminute.com/us/article/sending-a-web-push-notification-tutorial
      const publicKey = this.urlB64ToUint8Array(process.env.VUE_APP_VAPID_PUBLIC);
      if (subscribed && 'serviceWorker' in navigator && 'PushManager' in window) {
        this.getServiceWorkerSubscription().then(registration => {
          console.log('Service worker active');
          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: publicKey
          };
          return registration.pushManager.subscribe(subscribeOptions);
        }).then(subscription => {
          axios.post(`${ENDPOINT}/users/subscribe`, {
            subscription
          }).then(response => {
            if(response.status === 200) {
              console.log('Posted subscription');
            } else {
              console.log('Error posting subscription');
            }
          }).catch(error => {
            console.log(error);
          });
        });
      }
    }
  }
}
</script>


<style scoped>

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