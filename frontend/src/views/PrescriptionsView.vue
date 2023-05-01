<template>
  <div>
    <NavSection />
    <div class="text-center">
      <h1>Prescriptions</h1>
    </div>
    

    <div class="section-header">
      <div class="header" v-on:click="toggleSection(1)">
        My Prescriptions
        <span v-if="!sections[1].opened">+</span>
        <span v-else>-</span>
      </div>
      <div class="section-content" v-show="sections[1].opened">
        <div class="prescription-list">
          <PrescriptionCard class="card-item" v-on:click="viewSinglePrescription(prescription)" 
            v-for="prescription in filtered_prescriptiondata" :key="prescription.id" :prescription="prescription"/>
        </div>

        <button class="btn btn-primary" v-on:click="addPrescription">Add Prescription</button><br>
        <br>
        <button class="btn btn-info" v-on:click="viewPrescriptionHistory">View Prescription History</button><br>
        <br>
        <button class="btn btn-info" v-on:click="manageCaretaker">Manage Caretaker</button><br>
      </div>
    </div>

    <br>

    <div class="section-header">
      <div class="header" v-on:click="toggleSection(2)">
        Care Recipients' Prescriptions
        <span v-if="!sections[2].opened">+</span>
        <span v-else>-</span>
      </div>
      <div class="section-content" v-show="sections[2].opened">
        <div class="prescription-list">
          <PrescriptionCard class="card-item" v-on:click="viewSinglePrescription(prescription)" 
            v-for="prescription in filtered_caretakerprescriptiondata" :key="prescription.id" :prescription="prescription"/>
        </div>
      </div>
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
    console.log('Loading prescriptions.');
    axios.get(`${ENDPOINT}/prescriptions`)
      .then(response => {
        if(response.status === 200) {
          this.prescriptiondata = response.data;
        } else {
          console.log('Error loading prescriptions.');
        }        
      })
      .catch(error => {
        console.log(error)
      });

    
    axios.get(`${ENDPOINT}/prescriptions/caretakers`)
      .then(response => {
        if(response.status === 200) {
          this.caretakerprescriptiondata = response.data;
        } else {
          console.log('Error loading prescriptions.');
        }        
      })
      .catch(error => {
        console.log(error)
      });
  },
  data() {
    return {
      prescriptiondata: [],
      caretakerprescriptiondata: [],
      sections: {
        1: { opened: true },  // My Prescriptions Collapsible Section
        2: { opened: true }   // Others' Prescriptions Collapsible Section
      }
    }
  },
  computed: {
    
    filtered_prescriptiondata() {
      return this.prescriptiondata.filter(prescription => {
        const now = new Date();
        let end_date = new Date(prescription.pre_end_date);
        return now <= end_date;
      });
    },
    filtered_caretakerprescriptiondata() {
      return this.caretakerprescriptiondata.filter(prescription => {
        const now = new Date();
        let end_date = new Date(prescription.pre_end_date);
        return now <= end_date;
      });
    }
  },
  methods: {
    toggleSection(index) {
      this.sections[index].opened = !this.sections[index].opened;
    },
    addPrescription() {
      this.$router.push('/add/prescription');
    },
    viewPrescriptionHistory() {
      this.$router.push('/history');
    },
    viewSinglePrescription(prescription) {
      this.$router.push({ name: "view-prescription", params: { prescription: prescription.pre_id } });
    },
    manageCaretaker() {
      this.$router.push('/manage/caretaker');
    }
  }
}
</script>

<style scoped>

.text-center {
  margin-bottom: 50px;
}

.card-item:hover {
  background-color: #eeeef5;
  transition: 0.3s;
}

.card-item:click {
  background-color: #d2d2ea;
}
.section-header {
  background-color: #8694a2;
  color: white;
  padding: 5px;
  border-radius: 10px;
  margin-left: 2%;
  margin-right: 2%;
  text-align: center;
  outline: none;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  transition: 0.5s ease;
}

.section-header:active .section-header:hover {
  background-color: #555;
  transition: 0.5s ease;
}

.section-content {
  margin-top: 8px;
  padding: 30px;
  border-radius: 10px;
  transition: 0.5s ease;
  color: black;
  background-color: #f1f1f1;

}

span {
  float: right;
  margin-left: 5px;
}

</style>