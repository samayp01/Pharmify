<template>
  <div>
    <NavSection />
    <div class="tab-menu">
      <button id="my-prescriptions-btn" class="tab-item" @click="setActiveTab('my-prescriptions')" 
        :class="{ 'active': activeTab === 'my-prescriptions' }">
          My Meds 
          <span v-if="hasPrescriptions">{{ numPrescriptions }}</span>
      </button>
      <button id="recipient-prescriptions-btn" class="tab-item" @click="setActiveTab('recipient-prescriptions')" 
        :class="{ 'active': activeTab === 'recipient-prescriptions' }">
          Care Recipients' Meds 
          <span v-if="hasCaretakerPrescriptions">{{ numCaretakerPrescription }}</span>
      </button>
    </div>

    <div id="my-prescriptions" class="tabcontent text-center" v-show="activeTab === 'my-prescriptions'">
      <div v-if="hasPrescriptions" class="prescription-list">
        <PrescriptionCard class="card-item" v-on:click="viewSinglePrescription(prescription)" 
          v-for="prescription in filtered_prescriptiondata" :key="prescription.id" :prescription="prescription"/>
      </div>
      <p v-else class="text-center">No prescriptions. Click 'Add Prescription' to get started.</p>
      <button class="btn btn-primary" v-on:click="addPrescription">Add Prescription</button>
      <br>
      <br>
      <button class="btn btn-info" v-on:click="viewPrescriptionHistory">View History</button>
      <br>
      <br>
      <button class="btn btn-info" v-on:click="manageCaretaker">Manage Caretakers</button>
      <br>
    </div>

    <div id="recipient-prescriptions" class="tabcontent text-center" v-show="activeTab === 'recipient-prescriptions'">
      <div v-if="hasCaretakerPrescriptions" class="prescription-list">
        <PrescriptionCard class="card-item" v-on:click="viewSinglePrescription(prescription)" 
          v-for="prescription in filtered_caretakerprescriptiondata" :key="prescription.id" :prescription="prescription"/>
      </div>
      <p v-else class="text-center">No prescriptions. You will see the prescriptions of those that designate you as a caretaker here.</p>
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
    this.setActiveTab('my-prescriptions');

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
      activeTab: 'my-prescriptions'
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
    },
    hasPrescriptions() {
      return this.prescriptiondata.length > 0;
    },
    hasCaretakerPrescriptions() {
      return this.caretakerprescriptiondata.length > 0;
    }
  },
  methods: {
    numPrescriptions() {
      return this.prescriptiondata.length;
    },
    numCaretakerPrescription() {
      return this.caretakerprescriptiondata.length;
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
    },
    setActiveTab(tab) {
      document.getElementById(this.activeTab + '-btn').style.backgroundColor = 'inherit';
      this.activeTab = tab;
      document.getElementById(tab + '-btn').style.backgroundColor = '#d9e9e9';
    }
  }
}
</script>

<style scoped>

.tab-menu {
  overflow: hidden;
  background-color: #6e9f9f;
  margin: auto;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  max-width: 300px;
  padding: 0px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #6e9f9f;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
}

.tab-item:active {
  background-color: #6e9f9f;
}

.tab-item:not(:active):hover {
  background-color: #accecc;
}

.tabcontent {
  border-radius: 10px;
  padding: 20px;
  background-color: #d9e9e9;
  border-top: none;
  margin: 0px 25px 25px 25px;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.15);
}

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

span {
  color: white;
  background-color: #6e9f9f;
  padding: 3px;
  border-radius: 10px;
}

span:active {
  background-color: inherit;
}

</style>