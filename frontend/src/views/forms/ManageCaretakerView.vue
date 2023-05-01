<template>
    <div class="col-lg-3" style="margin: auto">
      <NavSection />
      <OfflinePopup />
      <div class="text-center">
        <h1>My Caretakers</h1>
      </div>
      <form class="text-center" @submit.prevent="addCaretaker">
        <div class="form-group">
          <label>Username</label><br>
          <input class="form-control" type="text" v-model="name" required>
          <button class="btn btn-success" type="submit">+</button>
        </div>
        <p class="text-danger" v-if="error">{{ error }}</p>
      </form>
      <ul v-if="hasCaretakers">
        <li v-for="(ct, index) in caretakers" v-bind:key="index" :value="ct.usr_username">
          {{ ct.usr_username }}
          <button class="delete-user" @click="deleteCaretaker(ct.usr_username)">✖</button>
        </li>
      </ul>
      <p v-else class="text-center">No caretakers assigned.</p>
    </div>
  </template>
  
  <script>
  
  import axios from 'axios';
  import NavSection from '../../components/NavSection.vue'
  import OfflinePopup from '../../components/OfflinePopup.vue'
  
  const ENDPOINT = '/api';
  
  export default {
    name: 'AddCaretakerView',
    components: {
      NavSection,
      OfflinePopup
    },
    data() {
      return {
        name: '',
        caretakers: [],
        error: null
      }
    },
    computed: {
      hasCaretakers() {
        return this.caretakers.length > 0;
      }
    },
    mounted() {
      console.log('Loading caretakers.');

      axios.get(`${ENDPOINT}/users`)
      .then(response => {
        if(response.status === 200) {
          let userId = response.data.usr_id;
          axios.get(`${ENDPOINT}/users/${userId}/caretaker`)
          .then(response => {
            if(response.status === 200) {
              this.caretakers = response.data;
              console.log(response.data);
            } else {
              console.log('Error loading caretakers.');
            }        
          })
          .catch(error => {
            console.log(error)
          });
        } else {
          console.log('Error loading user.');
        }        
      })
      .catch(error => {
        console.log(error)
      });
    },
    methods: {
      addCaretaker() {
        const name = this.name.trim();
        if(name == '') {
          alert('Please fill in all required fields');
          return;
        }
  
        // TODO: more form validation
  
        axios.post(`${ENDPOINT}/users/caretaker`, {
          name: name,
        })
        .then(response => {
          if(response.status === 200) {
            console.log('New caretaker added');
            window.location.reload();
          } else {
            this.error = "Caretaker could not be added"
            console.log('Error adding caretaker');
          }
        })
        .catch(error => {
          this.error = "Caretaker could not be added"
          console.log(error);
        });

      },
      deleteCaretaker(deleteName) {
        axios.delete(`${ENDPOINT}/users/caretaker/`, {
          data: {
            name: deleteName
          }
        })
        .then(response => {
          if(response.status === 200) {
            console.log('Caretaker deleted');
            window.location.reload();
          } else {
            console.log('Error deleting caretaker');
          }
        })
        .catch(error => {
          console.log(error);
        });
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