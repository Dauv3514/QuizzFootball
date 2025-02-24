<script setup>
  import {ref, watch} from "vue"
  import Card from "../components/Card.vue"
  import useFetch from "../hooks/useFetch";

  const search = ref("")
  const {data, loading, error} = useFetch(`/api/themes`)
  const filteredData = ref([])

  watch([data, search], () => {
    if (data.value) {
      filteredData.value = data.value.filter(theme => 
        theme.name.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  })
</script>

<template>
  <div>
    <header>
      <h1>Quizz Football</h1>
      <input v-model.trim="search" type="text" placeholder="Recherchez...">
      <div class="authentification">
            <router-link to="/inscription">S'inscrire</router-link>
            <router-link to="/connexion">Se connecter</router-link>
        </div>
    </header>
  <div v-if="loading" class="loading">
    Chargement des quizz
  </div>
  <div v-else-if="error" class="error">
    Une erreur est survenue : {{ error }}
  </div>
  <div v-else class="options-container">
    <Card v-for="item in filteredData" :key="item.id" :data="item"/>
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
    margin-right: 30px;
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

  .authentification {
    margin-left: auto;
    color: #b3b3b3;
    font-size: 12px;
    display: flex;
    justify-content: center;
    gap: 26px;
  }

  .authentification a {
    color: #003e66;
    text-decoration: none;
    font-weight: 600;
  }
</style>