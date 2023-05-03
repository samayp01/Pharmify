<template>
  <div class="container text-center">
    <h1>{{ prescriptionData.usr_username }}'s {{ prescriptionData.med_name }}</h1>
    <div v-if="shouldTake">
      Time to take your {{ prescriptionData.med_name }} prescription!
      <br>
      <strong>Dosage:</strong> {{ prescriptionData.pre_dosage }}
    </div>
    <div v-else>Next {{ prescriptionData.med_name }} dose on {{ formattedDate }}</div>
    <button class="btn btn-success" @click="markAsTaken" v-if="shouldTake">Mark As Taken</button>
    <div class="error" v-if="error">Prescription ID is invalid!</div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: 'PrescriptionInfo',
  props: {
    prescription: {
      required: true
    }
  }, 
  computed: {
    shouldTake() {
      const lastDose = new Date(this.prescriptionData.pre_last_dose);
      const frequency = this.prescriptionData.pre_frequency * 60 * 60 * 1000;
      const nextDose = new Date(lastDose.getTime() + frequency);
      return nextDose < Date.now();
    },
    formattedDate() {
      const lastDose = new Date(this.prescriptionData.pre_last_dose);
      const frequency = this.prescriptionData.pre_frequency * 60 * 60 * 1000;
      const nextDose = new Date(lastDose.getTime() + frequency);
      return moment(nextDose).format('MMMM Do YYYY, h:mm:ss a');
    }
  },
  mounted() {
    console.log('Loading prescription.');

    axios.get(`/api/prescriptions/id/${this.prescription}`)
    .then(response => {
      if(response.status === 200) {
        this.prescriptionData = response.data;
        if (response.data.length == 0) {
          this.error = true;
        }
      } else {
        this.error = true;
        console.log('Error loading prescription.');
      }        
    })
    .catch(error => {
      this.error = true;
      console.log(error)
    });
  },
  data() {
    return {
      prescriptionData: {},
      error: null
    }
  },
  methods: {
    markAsTaken() {
       let now = new Date(Date.now());
       const newDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

       axios.put('/api/prescriptions/' + this.prescriptionData.pre_id, {
          pre_id: this.prescriptionData.pre_id,
          pre_last_dose: newDateTime
       })
       .then(response => {
         if (response.status == 200) {
         console.log("Prescription hours updated");
         this.$router.push('/dashboard');

        } else {
            console.log("Error updating prescription hours");
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
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 10px;
  font-size: 20px;
  margin: auto;
  background-color: #d9e9e9;
  max-width: 90%;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.15);
}
h1 {
  font-size: 40px;
  margin-bottom: 20px;
}
button {
  margin-top: 50px;
}
.error {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #F5A5A5;
}
</style>
