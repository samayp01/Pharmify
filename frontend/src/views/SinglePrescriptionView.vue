<template>
  <NavSection />
  <div class="container">
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