<template>
  <div>
    <NavSection />
    <div class="container text-center">
      <h1>Past Prescriptions</h1>
      <div class="prescription-list" v-if="hasPrescriptions">
        <PrescriptionCard class="card-item" v-for="prescription in prescriptions" :key="prescription.id" :prescription="prescription" />
      </div>
      <p v-else>Prescriptions courses will appear here once finished.</p>
      <button v-if="hasPrescriptions" class="btn btn-danger" v-on:click="clearHistory">Clear History</button>
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
  computed: {
    hasPrescriptions() {
      return this.prescriptions.length > 0;
    }
  },
  mounted() {
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
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 10px;
  margin: auto;
  margin-bottom: 30px;
  background-color: #d9e9e9;
  max-width: 90%;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.15);
}

.prescription-list {
  margin-bottom: 40px;
}

/* Styles for screens wider than 1001px */
@media (min-width: 1001px) {
  .container {
    max-width: 70%;
  }
}

.card-item:hover {
  background-color: #accecc;
  transition: 0.3s;
}
</style>