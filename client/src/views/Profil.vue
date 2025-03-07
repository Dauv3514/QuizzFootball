<script setup>
  import useFetch from "../hooks/useFetch";
  import {ref, computed} from "vue"
  import EditProfil from "../components/EditProfil.vue"
  import {useRoute} from "vue-router"
  import { useAuthStore } from '../stores/auth'

  const isModalOpen = ref(false);

  const route = useRoute()
  const themeId = route.params.themeId;
  const authStore = useAuthStore()

  const {data: statsUser} = useFetch(`/api/profil/statsUser`)
  const {data: statsUsers} = useFetch(`/api/results/themes/${themeId}/scoresUsers`)
  const {data: getUserProfil} = useFetch(`/api/profil/getUserProfil`);
  const {data: getQuizAttempts} = useFetch(`/api/results/quizAttempts`);

  const profileImage = computed(() => {
    return getUserProfil.value && getUserProfil.value.user 
    ? `/api/uploads/${getUserProfil.value.user.profile_image}` 
    : null;
  })
  const userData = computed(() => getUserProfil.value);
  const statsUserData = computed(() => statsUser.value?.statsUser || []);
  const statsUsersData = computed(() => statsUsers.value?.scores || []);
  const currentUser = computed(() => authStore.user.username);
  const getUsersCompletedQuizzes = computed(() => {
    const usersStats = {};

    statsUsersData.value.forEach(item => {
      if (item.score === item.totalquestions) {
        if (usersStats[item.username]) {
          usersStats[item.username].completedQuizzes += 1;
        } else {
          usersStats[item.username] = {
            user_id: item.user_id,
            username: item.username,
            completedQuizzes: 1,
            attempts: 0,
          };
        }
      }
    });

    if (getQuizAttempts.value && Array.isArray(getQuizAttempts.value.attempts)) {
      getQuizAttempts.value.attempts.forEach(attempt => {
          Object.values(usersStats).forEach(user => {
        if (user.user_id === attempt.user_id) {
          user.attempts = parseInt(attempt.quiz_attempts, 10); // Convertir en nombre
        }
      });
      });
    } else {
      console.warn("Données de quizAttempts non disponibles ou attempts n'est pas un tableau.");
    }

    Object.values(usersStats).forEach(user => {
      if (user.attempts > 0) {
        user.successRate = (user.completedQuizzes / user.attempts) * 100;
      } else {
        user.successRate = 0;
      }
    });

    if (!usersStats[currentUser.value]) {
      usersStats[currentUser.value] = {
        username: currentUser.value,
        completedQuizzes: 0,
        attempts: 0,
        successRate: 0,
      };
    }

    return Object.values(usersStats)
      .sort((a,b) => b.completedQuizzes - a.completedQuizzes);
  });

  const editProfil = () => {
    isModalOpen.value = true;
  }

  const closeModal = () => {
    isModalOpen.value = false;
  }

  const updateUserData = (updatedUser) => {
      userData.value.user.username = updatedUser.username;
      userData.value.user.email = updatedUser.email;
      userData.value.user.profile_image = updatedUser.profile_image;
  }
</script>

<template>
  <div class="profile-page" v-if="authStore.isAuthenticated">
    <template v-if="userData">
      <h1>Bienvenue sur ton profil</h1>
      <span>{{ userData?.user?.username }}</span>
      <p>Mail: {{ userData?.user?.email }}</p>
      <img 
        v-if="profileImage" 
        :src="profileImage" 
        alt="Photo de profil"
        class="profilImage"
      />
    </template>
      <button @click="editProfil">Modifier mon profil</button>
      <div v-if="isModalOpen" class="modal">
        <EditProfil
          :isModalOpen="isModalOpen"
          :userData="userData"
          @close="closeModal"
          @updateUserData="updateUserData"
        />
      </div>
      <div class="containerGlobal">
        <div class="statsUser">
          <h3 v-if="statsUserData.length > 0">Bravo tu as terminé {{ statsUserData.length }} quiz ! 🎉🎉</h3>
          <template v-if="statsUserData.length > 0">
            <div v-for="statsUser in statsUserData" :key="statsUser.username" class="totalStatsUser">
              <div class="resultsUser">
                <p>{{ statsUser.name }}</p>
                <p>{{ statsUser.score }} / {{ statsUser.totalquestions }}</p>
              </div>
              <div class="image">
                <img :src="statsUser.image" alt="image">
              </div>
            </div>
          </template>
        <p v-else>Tu n'as pas encore terminé de Quizz</p>
      </div>
      <div class="statsUsers">
        <h3>Ton classement par rapport aux autres</h3>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Nom d'utilisateur</th>
              <th>Quiz terminés</th>
              <th>Tentatives aux quiz</th>
              <th>Pourcentage de réussite</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(userStats, index) in getUsersCompletedQuizzes" 
              :key="userStats.id"
              :class="{'highlight-row': userStats.username === currentUser}"  
            >
              <td>{{ index + 1 }}</td>
              <td>{{ userStats.username }}</td>
              <td>{{ userStats.completedQuizzes }}</td>
              <td>{{ userStats.attempts }}</td>
              <td>{{ userStats.successRate.toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .profile-page {
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .profile-page span {
    font-size: 20px;
    font-weight: bold;
  }

  .profilImage {
    margin-top: 5px;
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #ddd;
  }

  button {
      margin-top: 10px;
      background-color: black;
      color: white;
      padding: 10px 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
  }

  button:hover {
      background-color: #333;
      transform: scale(1.05);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .containerGlobal {
    display: flex;
    margin-top: 40px;
    gap: 40px;
  }

  h3 {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .resultsUser {
    display: flex;
    justify-content: center;
    gap: 5px;
  }

  .image {
    display: flex;
    justify-content: center;
  }

  .totalStatsUser img {
    width: 50%;
    height: 100px;
    margin: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  .highlight-row {
    background-color: rgba(248, 170, 170, 0.835);
  }

  .containerGlobal {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    padding: 0 10px;
  }

  .statsUser, .statsUsers {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
  }

  .statsUsers table {
    width: 100%;
    border-collapse: collapse;
  }

  .statsUsers th, .statsUsers td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }

  @media (max-width: 768px) {
    .containerGlobal {
      flex-direction: column;
      align-items: center;
    }

    .statsUser, .statsUsers {
      width: 100%;
      max-width: 400px;
    }

    .statsUsers table {
      font-size: 14px;
    }
  }
</style>
