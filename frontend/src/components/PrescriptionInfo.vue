<template>
  <div class="error" v-if="error">
    Prescription ID is invalid!
  </div>
  <div class="take-prescription" v-if="shouldTake">
    Time to take your {{ prescriptionData.med_name }} prescription!
    <br><br>
    Take the {{ prescriptionData.pre_dosage }} dose
  </div>
  <div class="time-remaining">
    Next {{ prescriptionData.med_name }} dose at {{ formattedDate }}
  </div>
  <div class="text-center">
    <button class="btn btn-success" @click="markAsTaken">Mark As Taken</button>
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
      const frequency = this.prescriptionData.pre_frequency * 60 * 60 * 1000; // convert hours to milliseconds
      const nextDose = new Date(lastDose.getTime() + frequency);
      return nextDose < Date.now();
    },

    formattedDate() {
      const lastDose = new Date(this.prescriptionData.pre_last_dose);
      const frequency = this.prescriptionData.pre_frequency * 60 * 60 * 1000; // convert hours to milliseconds
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
    // markAsTaken() {
      
    //   //let newDateTime = moment(this.prescription.pre_last_dose).add(this.prescription.pre_frequency, 'hours').format('YYYY-MM-DD HH:mm:ss');
    //   let newDateTime = moment(this.prescription.pre_last_dose).add(+this.prescription.pre_frequency, 'hours').format('YYYY-MM-DD HH:mm:ss');
    //   axios.put('/api/prescriptions/' + this.prescription.pre_id, {
    //     pre_id: this.prescription.pre_id,
    //     pre_last_dose: newDateTime
    //   })
    //   .then(response => {
    //     if (response.status == 200) {
    //       console.log("Prescription hours updated");
    //       this.$router.push('/dashboard');

    //     } else {
    //       console.log("Error updating prescription hours");
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
      
    // }
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
.error {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #F5A5A5;
}
.take-prescription {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #F5C5A5;
}
.time-remaining {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #F5F5F5;
}
</style>
