<template>
  <div>
    <NavSection />
    <OfflinePopup />
    <div class="container text-center col-lg-3 text-center row justify-content-center">
      <h1>My Caretakers</h1>
      <form @submit.prevent="addCaretaker">
        <div class="form-group">
          <label>Username</label>
          <br>
          <div class="input-area">
            <input class="form-control" type="text" v-model="name" required>
            <button class="btn btn-success" type="submit">+</button>
          </div>
          
        </div>
        <p class="text-danger" v-if="error">{{ error }}</p>
      </form>
      <ul v-if="hasCaretakers">
        <li v-for="(ct, index) in caretakers" v-bind:key="index" :value="ct.usr_username">
          {{ ct.usr_username }}
          <button class="delete-user" @click="deleteCaretaker(ct.usr_username)">✖</button>
        </li>
      </ul>
      <p v-else>No caretakers assigned.</p>
    </div>
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
    axios.get(`${ENDPOINT}/users`)
    .then(response => {
      if(response.status === 200) {
        let userId = response.data.usr_id;
        axios.get(`${ENDPOINT}/users/${userId}/caretaker`)
        .then(response => {
          if(response.status === 200) {
            this.caretakers = response.data;
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
        this.name = '';
        return;
      }

      // TODO: more form validation

      axios.post(`${ENDPOINT}/users/caretaker`, {
        name: name,
      })
      .then(response => {
        if(response.status === 200) {
          window.location.reload();
        } else {
          this.error = "Caretaker could not be added"
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

.input-area {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.input-area button {
  margin-left: 10px;
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
  margin-left: 5%;
  margin-right: 5%;
}

.form-group label {
  margin-bottom: 0px;
  font-weight: 100;
}

select {
  overflow-y: scroll;
}

.delete-user {
  background-color: rgb(237, 122, 122);
  color: white;
  border: none;
  border-radius: 100%;
  cursor: pointer;
  font-size: 12px;
  margin-left: 4px;
}

ul {
  border: none;
  margin: auto;
  margin-top: 10px;
  list-style: none;
  padding: 25px;
  border-radius: 10px;
}

ul:empty {
  display: none;
}

li {
  background-color: #e9e9e9;
  border-radius: 10px;
  display: inline-block;
  font-size: 14px;
  font-weight: 100;
  margin: 3px;
  padding: 7px 5px 7px 7px;
  box-shadow: 0px 4px 4px rgba(102, 101, 101, 0.15);
}

input[type="text"] {
  font-size: 16px;
  padding: 8px;
}
</style>