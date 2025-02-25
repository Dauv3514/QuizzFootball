<script setup>
  import {ref, watch, computed} from "vue"
  import Card from "../components/Card.vue"
  import Logout from "../components/Logout.vue"
  import useFetch from "../hooks/useFetch";
  import { useAuthStore } from '../stores/auth'

  const search = ref("")
  const {data: themes, loading, error} = useFetch(`/api/themes`)
  console.log(themes, 'trerer');
  const filteredData = ref([])
  const authStore = useAuthStore()
  const filteredThemes = computed(() => 
    filteredData.value.filter(theme => 
      theme.name.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  const fetchThemeScore = async (themeId) => {
    const {data} = useFetch(`/api/results/themes/${themeId}/best-score`)
    return data
  }

  watch(themes, () => {
    if (themes.value) {
      themes.value.forEach(async (theme) => {
        const scoreData = await fetchThemeScore(theme.id)
        console.log('Score récupéré:', scoreData.value)
        const updatedTheme = {
          ...theme,
          bestScore: scoreData.value?.bestScore || 0
        }
        console.log(updatedTheme, 'nnnnn');
        
        const index = filteredData.value.findIndex(t => t.id === theme.id)
        if (index === -1) {
          filteredData.value.push(updatedTheme)
        } else {
          filteredData.value[index] = updatedTheme
        }
      })
    }
  },)

  const handleLogout = () => {
    authStore.logout()
  }

</script>

<template>
  <div>
    <header>
      <h1>Quizz Football</h1>
      <input v-model.trim="search" type="text" placeholder="Recherchez...">
      <div class="authentification">
        <template v-if="!authStore.isAuthenticated">
            <router-link to="/inscription">S'inscrire</router-link>
            <router-link to="/connexion">Se connecter</router-link>
        </template>
        <Logout v-else @logout="handleLogout" />
      </div>
    </header>
  <div v-if="loading" class="loading">
    Chargement des quizz
  </div>
  <div v-else-if="error" class="error">
    Une erreur est survenue : {{ error }}
  </div>
  <div v-else class="options-container">
    <Card 
      v-for="item in filteredThemes" 
      :key="item.id" 
      :data="item"
      :bestScore="item.bestScore"
    />
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