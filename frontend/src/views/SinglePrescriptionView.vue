<template>
  <NavSection />
  <div class="container">
      <div class="text-center">
        <h1>Current Prescription</h1>
      </div>
    <PrescriptionInfo :prescription="prescription" />
  </div>
</template>

<script>
import PrescriptionInfo from '../components/PrescriptionInfo.vue'
import NavSection from '../components/NavSection.vue'

export default {
  name: 'SinglePrescriptionView',
  components: {
    PrescriptionInfo,
    NavSection
  },
  props: {
    prescription: {
      required: true
    }
  }
}

</script>

<style>
.text-center {
  text-align: center;
  margin-bottom: 40px;
}

</style>