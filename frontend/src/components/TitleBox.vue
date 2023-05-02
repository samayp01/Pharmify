<template>
  <div class="title text-center">
    <h1>Pharmify <img src="/img/pill.png" alt="Logo"></h1>
  </div>
</template>

<script>

export default {
  name: 'TitleBox',
  data() {
    return {
      img: '/img/pill.png'
    }
  },
};

</script>

<style scoped>
div {
  user-select: none;
}
h1 {
  margin: auto;
  padding-top: 80px;
  padding-bottom: 80px;
  color: #3a514a;
  font-weight: 700;
  font-size: 50px;
}
img {
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
}
</style>