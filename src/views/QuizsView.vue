<script setup>
  import q from "../data/quiz.json"
  import {ref, watch} from "vue"
  import Card from "../components/Card.vue"

  const quiz = ref(q)
  const search = ref("")

  watch(search, () => {
    console.log("Hello from watch", search);
    quiz.value = q.filter(quiz => quiz.name.toLowerCase().includes(search.value.toLowerCase()))
  })
</script>

<template>
  <div>
    <header>
      <h1>Quizz</h1>
      <input v-model.trim="search" type="text" placeholder="Recherchez...">
    </header>
  <div class="options-container">
    <Card v-for="item in quiz" :key="item.id" :quiz="item"/>
  </div>
  </div>
</template>

<style scoped>
  header {
    margin-bottom: 10px;
    margin-top: 30px;
    display: flex;
    align-items: center;
  }
  header h1 {
    font-weight: bold;
    margin-right:30px;
  }
  header input {
    border: none;
    background-color: rgba(128,128,128,0.1);
    padding: 10px;
    border-radius:5px;
  }

  .options-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
  }
</style>