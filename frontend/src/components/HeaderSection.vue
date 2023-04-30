<style scoped>

.header {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  border-bottom: 3px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  background-color: rgb(165, 203, 194);
}

h1 {
  user-select: none;
  font-size: 30px;
}

</style>

<template>
  <div class="header">
    <h1>Prescriptions R Us</h1>
  </div>
</template>

<script>
export default {
  name: 'HeaderSection'
}
</script>