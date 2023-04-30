<template>
  <div>
    <NavSection />
    <div class="container">
      <h1>Past Prescriptions</h1>
      <div class="prescription-list">
        <PrescriptionCard class="card-item" v-for="prescription in prescriptions" :key="prescription.id" :prescription="prescription" />
      </div>
      <button class="btn btn-danger" v-on:click="clearHistory">Clear History</button>
    </div>
  </div>
</template>

<script>

import PrescriptionCard from '../components/PrescriptionCard.vue'
import NavSection from '../components/NavSection.vue'
import axios from 'axios'

const ENDPOINT = '/api';

export default {
  name: 'PrescriptionsView',
  components: {
    PrescriptionCard,
    NavSection
  },
  mounted() {
    console.log('Loading past prescriptions.');
    axios.get(`${ENDPOINT}/prescriptions/history`)
      .then(response => {
        if(response.status == 200) {
          this.prescriptions = response.data;
        } else {
          console.log('Error loading prescriptions.');
        }
      })
      .catch(error => {
        console.log(error)
      });
  },
  methods: {
    clearHistory() {
      this.prescriptions = [];

      axios.delete(`${ENDPOINT}/prescriptions/history`)
        .then(response => {
          if(response.status == 200) {
            console.log('History cleared.');
          } else {
            console.log('Error clearing history.');
          }
        })
        .catch(error => {
          console.log(error)
        });
    }
  },
  data() {
    return {
      prescriptions: []
    }
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 30px;
}
.container {
  text-align: center;
}

.prescription-list {
  margin-bottom: 40px;
}

.card-item:hover {
  background-color: #eeeef5;
  transition: 0.3s;
}
</style>