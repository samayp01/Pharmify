<template>
  <div class="col-lg-3" style="margin: auto">
    <NavSection />
    <OfflinePopup />
    <div class="text-center">
      <h1>Add Prescription</h1>
    </div>

        <form class="text-center" @submit.prevent="submitForm">
          <div class="form-group">
            <label>Name</label><br>
            <select class="form-control" v-model="name" required>
              <option v-for="(med, index) in medications" v-bind:key="index" :value="med.med_name">{{ med.med_name }}</option>
            </select>
          </div>
          <br>
          <div class="form-group">
            <label>Dosage</label><br>
            <input class="form-control" type="text" v-model="dosage" required>
          </div>
          <br>
          <div class="form-group">
            <label>Frequency</label><br>
            <select class="form-control" v-model="frequency" required>
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5 hours</option>
              <option value="6">6 hours</option>
              <option value="7">7 hours</option>
              <option value="8">8 hours</option>
              <option value="9">9 hours</option>
              <option value="10">10 hours</option>
              <option value="11">11 hours</option>
              <option value="12">12 hours</option>
              <option value="24">1 day</option>
              <option value="48">2 days</option>
              <option value="72">3 days</option>
              <option value="168">1 week</option>
            </select>
            <!-- <input class="form-control" type="text" v-model="frequency" required> -->
          </div>
          <br>
          <div class="form-group">
            <label>Start Date</label><br>
            <input class="form-control" type="date" v-model="start_date" required>
          </div>
          <br>
          <div class="form-group">
            <label>End Date</label><br>
            <input class="form-control" type="date" v-model="end_date">
          </div>
          <br>
          <div class="form-group">
            <label>Description</label><br>
            <textarea class="form-control" v-model="description"></textarea>
          </div>
          <br>
          <div>
            <form @submit.prevent="addUser" class="form-group">
              <!--label for="user">New Caretaker</label><br>
              <div class="row">
                <div class="col-8">
                  <input class="form-control" type="text" id="user" v-model="newUser" />
                </div>
                <div class="col-4">
                  <button class="btn btn-primary" id="logo-button" type="submit">Add</button>
                </div>
              </div-->
              <div class="error" v-if="error">{{ error }}</div>
            </form>
            <ul>
              <li v-for="(user, index) in allow_users" :key="user">
                {{ user }}
                <button class="delete-user" @click="deleteUser(index)">✖</button>
              </li>
            </ul>
          </div>
          <br>
          <button class="btn btn-success" type="submit">Submit</button>
        </form>
  </div>
</template>

<script>

import axios from 'axios';
import NavSection from '../../components/NavSection.vue'
import OfflinePopup from '../../components/OfflinePopup.vue'

const ENDPOINT = '/api';

export default {
  name: 'AddPrescriptionView',
  components: {
    NavSection,
    OfflinePopup
  },
  data() {
    return {
      name: '',
      dosage: '',
      frequency: '',
      start_date: null,
      end_date: null,
      description: '',
      allow_users: [],
      newUser: '',
      error: null,
      medications: []
    }
  },
  mounted() {
    console.log('Loading medications.');
    axios.get(`${ENDPOINT}/prescriptions/medications`)
    .then(response => {
      if(response.status === 200) {
        this.medications = response.data;
      } else {
        console.log('Error loading medications.');
      }        
    })
    .catch(error => {
      console.log(error)
    });
  },
  methods: {
    submitForm() {
      const name = this.name.trim();
      const dosage = this.dosage;
      const frequency = this.frequency;
      const start_date = this.start_date;
      const end_date = this.end_date;
      const description = this.description.trim();
      const allow_users = this.allow_users;

      if(name == '' || dosage == '' || frequency == '' || start_date == null ||
          end_date == null || description == '') {
        this.error = "Please fill out all fields";
        return;
      }

      // TODO: more form validation

      axios.post(`${ENDPOINT}/prescriptions`, {
        name: name,
        dosage: dosage,
        frequency: frequency,
        start_date: start_date,
        end_date: end_date,
        description: description,
        allow_users: allow_users
      })
      .then(response => {
        if(response.status === 200) {
          console.log('New prescription added');
          this.$router.push('/dashboard');
        } else {
          console.log('Error adding prescription');
        }
      })
      .catch(error => {
        console.log(error);
      });



    },
    addUser() {
      if (!this.newUser) {
        this.error = "Please enter a keyword";
        return;
      }
      if (this.allow_users.includes(this.newUser)) {
        this.error = "This user is already added";
        // set this.error to "" after 3 seconds
        setTimeout(() => {
          this.error = "";
        }, 1000);
        return;
      }
      this.allow_users.push(this.newUser);
      this.newUser = "";
      this.error = null;
    },
    deleteUser(index) {
      this.allow_users.splice(index, 1);
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