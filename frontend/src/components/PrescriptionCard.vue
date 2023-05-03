<template>
  <div class="prescription-card">
    <div class="card-header">
      <h3>{{ prescription.usr_username }}'s {{ prescription.med_name }}</h3>
    </div>
    <div><strong>Dosage:</strong> {{ prescription.pre_dosage }}</div>
    <div>
      Every {{ getFrequency }}
      <br>
      from {{ formatDate(prescription.pre_start_date) }} to {{ formatDate(prescription.pre_end_date) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrescriptionCard',
  props: {
    prescription: {
      required: true
    }
  },
  computed: {
    getFrequency() {
      let hours = this.prescription.pre_frequency;
      if(hours <= 24) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else if(hours < 168) {
        return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''}`;
      } else {
        return `${Math.floor(hours / 168)} week${Math.floor(hours / 168) > 1 ? 's' : ''}`;
      }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date)
        .toLocaleDateString('en-US', {
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        });
    }
  }
}
</script>

<style>
.prescription-card {
  padding: 5px;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: #cce4e4;
  overflow: hidden;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.15);
  user-select: none;
}

.card-header {
  padding-bottom: 5px;
  margin-bottom: 5px;
}
</style>
