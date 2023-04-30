<template>
  <div class="prescription-card">
    <div class="card-header">
      <h3>{{ prescription.usr_username }}'s {{ prescription.med_name }}</h3>
    </div>
    
    <div><strong>Dosage:</strong> {{ prescription.pre_dosage }}</div>
    <div><strong>Frequency:</strong> every {{ prescription.pre_frequency }} hours</div>
    <div>
      from {{ formatDate(prescription.pre_start_date) }} 
      to {{ formatDate(prescription.pre_end_date) }}</div>
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
  border: 1px solid #999;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: #F5F5F5;
  overflow: hidden;
  user-select: none;
}

.card-header {
  background-color: #e2e8ef;
  padding: 5px;
  margin-bottom: 5px;
}
</style>
